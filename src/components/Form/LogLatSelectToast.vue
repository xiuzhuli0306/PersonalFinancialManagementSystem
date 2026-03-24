<template>
    <!-- Dialog wrapper -->
    <el-dialog title="Select Location" v-model="visible" :close-on-click-modal="false" width="80%"
        class="location-select-dialog" @close="handleClose">
        <div class="address-select">
            <!-- Left search panel -->
            <div class="search-panel">
                <div class="panel-header">
                    <h2>Address Selection</h2>
                    <p class="subtitle">Search or select a location on the map</p>
                </div>

                <!-- Search box -->
                <div class="search-box">
                    <el-input v-model="searchForm.address" placeholder="Search address..." :prefix-icon="Search"
                        clearable @keyup.enter="searchByKeyword">
                        <template #append>
                            <el-button @click="searchByKeyword">Search</el-button>
                        </template>
                    </el-input>
                </div>

                <!-- Search results list -->
                <div class="search-results" v-if="addressList.length">
                    <div v-for="(item, index) in addressList" :key="index" class="result-item"
                        :class="{ active: isSelected(item) }" @click="selectSearchResult(item)">
                        <div class="item-content">
                            <el-icon>
                                <Location />
                            </el-icon>
                            <div class="item-details">
                                <div class="item-name">{{ item.title }}</div>
                                <div class="item-address">{{ item.address }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Currently selected address -->
                <div class="selected-address" v-if="selectAddress.lng">
                    <div class="info-card">
                        <div class="card-header">
                            <el-icon class="success">
                                <Location />
                            </el-icon>
                            <span>Selected Location</span>
                        </div>
                        <div class="card-content">

                            <div class="address-detail">
                                <p>Full Address: {{ selectAddress.fullAddress }}</p>
                                <p class="address-components">
                                    <span>Province: {{ selectAddress.province }}</span>
                                    <span>City: {{ selectAddress.city }}</span>
                                    <span>District: {{ selectAddress.district }}</span>
                                    <span v-if="selectAddress.street">Street: {{ selectAddress.street }}</span>
                                    <span v-if="selectAddress.streetNumber">Street No.: {{ selectAddress.streetNumber
                                        }}</span>
                                </p>
                            </div>
                            <div class="coordinates">
                                Longitude: {{ selectAddress.lng }}<br>
                                Latitude: {{ selectAddress.lat }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right side map -->
            <div class="map-container">
                <el-skeleton v-if="map == null" :rows="12" animated />
                <div id="containerMap"></div>
            </div>
        </div>
        <!-- Footer buttons -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">Cancel</el-button>
                <el-button type="primary" @click="Save">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { post } from '@/api/http';
import { useCommonStore } from '@/store';
import { Location, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Get store and router instances
const commonStore = useCommonStore()
const router = useRouter()
const route = useRoute()

// Reactive data
const searchForm = reactive({ address: "" });
const addressList = ref([]);
const map = ref(null);
const search = ref(null);
const markers = ref(null);
const currentMarker = ref(null);
const currentInfoWindow = ref(null);
const selectAddress = reactive({
    lat: "",
    lng: "",
    name: "",
    province: "",
    city: "",
    district: "",
    street: "",
    streetNumber: "",
    fullAddress: ""
});
const visible = ref(false);
const callback = ref(null);
const scriptsLoaded = ref(false);

// Dynamically load map scripts
const loadMapScripts = () => {
    return new Promise((resolve, reject) => {
        // Return immediately if already loaded
        if (window.TMap) {
            scriptsLoaded.value = true;
            resolve();
            return;
        }

        // Track number of scripts to load
        let loadedCount = 0;
        const totalScripts = 2;

        // Create and load first script
        const script1 = document.createElement('script');
        script1.charset = 'utf-8';
        script1.src = 'https://map.qq.com/api/js?v=2.exp&key=R33BZ-DISK4-4J7UB-D3JHM-GQA3E-V6BBF&libraries=place';
        script1.async = true;

        // Create and load second script
        const script2 = document.createElement('script');
        script2.src = 'https://map.qq.com/api/gljs?v=1.exp&key=R33BZ-DISK4-4J7UB-D3JHM-GQA3E-V6BBF&libraries=service';
        script2.async = true;

        // Script load success handler
        const handleScriptLoad = () => {
            loadedCount++;
            if (loadedCount === totalScripts) {
                scriptsLoaded.value = true;
                resolve();
            }
        };

        // Script load error handler
        const handleScriptError = (error) => {
            reject(error);
            ElMessage.error('Map script failed to load, please refresh and try again');
        };

        // Set event listeners
        script1.addEventListener('load', handleScriptLoad);
        script1.addEventListener('error', handleScriptError);
        script2.addEventListener('load', handleScriptLoad);
        script2.addEventListener('error', handleScriptError);

        // Append to document
        document.head.appendChild(script1);
        document.head.appendChild(script2);
    });
};

// Methods
const OpenToast = async (Latitude, Longitude, Address, cb) => {
    selectAddress.lat = Latitude;
    selectAddress.lng = Longitude;
    selectAddress.name = Address;
    visible.value = true;
    callback.value = cb;

    // Wait for scripts to load
    if (!scriptsLoaded.value) {
        try {
            await loadMapScripts();
        } catch (error) {
            console.error('Failed to load map scripts:', error);
            return;
        }
    }

    nextTick(() => {
        InitMap();
    });
};

const InitMap = () => {
    // Ensure TMap is loaded
    if (!window.TMap) {
        ElMessage.error('Map component not loaded yet, please try again later');
        return;
    }

    const center = selectAddress.lat && selectAddress.lng
        ? new TMap.LatLng(selectAddress.lat, selectAddress.lng)
        : new TMap.LatLng(42.317556, 118.944677);

    map.value = new TMap.Map('containerMap', {
        zoom: selectAddress.lat ? 15 : 6,
        center: center,
        showControl: true,
        mapStyleId: 'style1' // Map style selection
    });

    // Initialize search service
    search.value = new TMap.service.Search({ pageSize: 10 });

    // Initialize marker layer
    markers.value = new TMap.MultiMarker({
        map: map.value,
        geometries: []
    });

    initializeMarker(center);
    bindMapEvents();
};

const initializeMarker = (position) => {
    if (selectAddress.lat && selectAddress.lng) {
        currentMarker.value = new TMap.MultiMarker({
            map: map.value,
            geometries: [{
                id: 'selected',
                position: position,
            }]
        });

        showInfoWindow(position, selectAddress.name);
    }
};

const showInfoWindow = (position, content) => {
    if (currentInfoWindow.value) {
        currentInfoWindow.value.close();
    }

    currentInfoWindow.value = new TMap.InfoWindow({
        map: map.value,
        position: position,
        content: `
            <div class="custom-info-window">
                <h3>${content || 'Selected Location'}</h3>
                <p>${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</p>
            </div>
        `,
        offset: { x: 0, y: -50 }
    });
    currentInfoWindow.value.open();
};

const bindMapEvents = () => {
    map.value.on("click", (evt) => {
        updateSelection({
            lat: evt.latLng.lat,
            lng: evt.latLng.lng,
            name: evt.poi ? evt.poi.name : 'Unknown location'
        });
    });
};

const updateSelection = async (location) => {
    // Create geocoder instance
    const geocoder = new TMap.service.Geocoder();

    try {
        // Resolve coordinates to get detailed address
        const result = await geocoder.getAddress({
            location: new TMap.LatLng(location.lat, location.lng)
        });

        if (result.status === 0 && result.result) {
            const addressInfo = result.result.address_component;
            Object.assign(selectAddress, {
                lat: location.lat,
                lng: location.lng,
                name: location.name,
                province: addressInfo.province || '',
                city: addressInfo.city || '',
                district: addressInfo.district || '',
                street: addressInfo.street || '',
                streetNumber: addressInfo.street_number || '',
                fullAddress: result.result.address || ''
            });
        }
    } catch (error) {
        console.error('Failed to get detailed address:', error);
        Object.assign(selectAddress, {
            lat: location.lat,
            lng: location.lng,
            name: location.name,
            province: '',
            city: '',
            district: '',
            street: '',
            streetNumber: '',
            fullAddress: ''
        });
    }

    const position = new TMap.LatLng(location.lat, location.lng);

    if (currentMarker.value) {
        currentMarker.value.setGeometries([{
            id: 'selected',
            position: position,
        }]);
    } else {
        currentMarker.value = new TMap.MultiMarker({
            map: map.value,
            geometries: [{
                id: 'selected',
                position: position,
            }]
        });
    }

    showInfoWindow(position, location.name);
};

const searchByKeyword = async () => {
    if (!searchForm.address.trim()) {
        return;
    }

    try {
        // Use search service
        const result = await search.value.searchRectangle({
            keyword: searchForm.address,
            bounds: map.value.getBounds(),
        });

        addressList.value = result.data;

        // Clear previous search markers
        if (markers.value) {
            // Clear previous markers
            markers.value.setGeometries([]);

            // Add new search result markers
            const geometries = result.data.map((item, index) => ({
                id: String(index),
                position: item.location,
            }));

            markers.value.setGeometries(geometries);
        }
    } catch (error) {
        console.error('Search failed:', error);
        ElMessage.error('Search failed, please try again');
    }
};

const selectSearchResult = (item) => {
    updateSelection({
        lat: item.location.lat,
        lng: item.location.lng,
        name: item.title
    });

    map.value.panTo(item.location);
    map.value.setZoom(16);
};

const isSelected = (item) => {
    return selectAddress.lat === item.location.lat
        && selectAddress.lng === item.location.lng;
};

const Save = () => {
    if (callback.value) {
        callback.value(selectAddress);
    }
    handleClose();
};

const handleClose = () => {
    if (map.value) {
        map.value.destroy();
        map.value = null;
    }
    visible.value = false;
};

// Expose methods for external use
defineExpose({
    OpenToast
});

// Lifecycle hooks
onBeforeUnmount(() => {
    if (map.value) {
        map.value.destroy();
        map.value = null;
    }
});

// Preload map scripts
// Can preload scripts after mount for better UX
onMounted(() => {
    // Optionally preload
    // loadMapScripts().catch(error => console.error('Failed to preload map scripts:', error));
});
</script>

<style lang="scss" scoped>
.location-select-dialog {
    :deep(.el-dialog__body) {
        padding: 0;
    }

    :deep(.el-dialog__header) {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;

        .el-dialog__title {
            font-size: 18px;
            font-weight: 500;
        }
    }

    :deep(.el-dialog__footer) {
        padding: 15px 20px;
        border-top: 1px solid #eee;
    }
}

.address-select {
    height: 600px; // Fixed height
    display: flex;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-panel {
    width: 400px;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    background: #fff;

    .panel-header {
        padding: 20px;
        border-bottom: 1px solid #eee;

        h2 {
            margin: 0;
            font-size: 24px;
            color: #303133;
        }

        .subtitle {
            margin: 8px 0 0;
            color: #909399;
            font-size: 14px;
        }
    }

    .search-box {
        padding: 20px;
        border-bottom: 1px solid #eee;
    }

    .search-results {
        flex: 1;
        overflow-y: auto;
        padding: 0 10px;

        .result-item {
            padding: 15px;
            cursor: pointer;
            border-radius: 4px;
            margin: 5px 0;
            transition: all 0.3s;

            &:hover {
                background: #f5f7fa;
            }

            &.active {
                background: #ecf5ff;
                border: 1px solid #409EFF;
            }

            .item-content {
                display: flex;
                align-items: flex-start;

                .el-icon {
                    color: #409EFF;
                    font-size: 20px;
                    margin-right: 12px;
                    margin-top: 2px;
                }

                .item-details {
                    flex: 1;

                    .item-name {
                        font-weight: 500;
                        color: #303133;
                        margin-bottom: 4px;
                    }

                    .item-address {
                        font-size: 12px;
                        color: #909399;
                    }
                }
            }
        }
    }

    .selected-address {
        padding: 20px;
        border-top: 1px solid #eee;

        .info-card {
            background: #f5f7fa;
            border-radius: 8px;
            padding: 15px;

            .card-header {
                display: flex;
                align-items: center;
                margin-bottom: 12px;

                .el-icon {
                    color: #67c23a;
                    margin-right: 8px;
                    font-size: 18px;

                    &.success {
                        color: #67c23a;
                    }
                }

                span {
                    font-weight: 500;
                    color: #303133;
                }
            }

            .card-content {
                .address-name {
                    font-size: 14px;
                    color: #606266;
                    margin-bottom: 8px;
                }

                .address-detail {
                    margin: 10px 0;

                    p {
                        margin: 5px 0;
                        color: #606266;
                        font-size: 13px;
                    }

                    .address-components {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;

                        span {
                            color: #909399;
                            font-size: 12px;
                        }
                    }
                }

                .coordinates {
                    font-size: 12px;
                    color: #909399;
                    line-height: 1.6;
                }
            }

            .card-actions {
                margin-top: 15px;
                display: flex;
                gap: 10px;
            }
        }
    }
}

.map-container {
    flex: 1;
    position: relative;

    #containerMap {
        width: 100%;
        height: 100%;
    }
}

// Custom info window style
:deep(.custom-info-window) {
    padding: 10px;

    h3 {
        margin: 0 0 5px;
        font-size: 16px;
        color: #303133;
    }

    p {
        margin: 0;
        font-size: 12px;
        color: #909399;
    }
}
</style>
