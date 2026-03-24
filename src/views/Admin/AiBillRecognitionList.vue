<template>
    <div>
        <!-- Upload & Recognize Card -->
        <el-card class="box-card">
            <div class="recognize-section">
                <div class="upload-area">
                    <UploadImages :limit="1" v-model="imageUrl"></UploadImages>
                    <div class="upload-tip">Upload a bill/receipt image for AI recognition</div>
                </div>
                <el-button type="primary" size="default" :loading="recognizing" :disabled="!imageUrl"
                    @click="handleRecognize">
                    <el-icon>
                        <Search />
                    </el-icon>{{ recognizing ? 'Recognizing...' : 'AI Recognize' }}
                </el-button>
            </div>
        </el-card>

        <!-- Recognition Result Card -->
        <el-card class="box-card" v-if="currentResult">
            <div class="result-header">
                <span class="result-title">Recognition Result</span>
                <el-tag
                    :type="currentResult.statusType === 2 ? 'success' : currentResult.statusType === 3 ? 'danger' : 'warning'">
                    {{ currentResult.statusTypeFormat }}
                </el-tag>
            </div>
            <div class="result-content">
                <pre
                    class="result-text">{{ currentResult.parsedText || currentResult.recognitionResult || 'No result' }}</pre>
            </div>
            <div class="result-image" v-if="currentResult.imageUrl">
                <el-image :src="currentResult.imageUrl" style="max-width: 300px; max-height: 300px" fit="contain"
                    :preview-src-list="[currentResult.imageUrl]"></el-image>
            </div>
        </el-card>

        <!-- History Table -->
        <el-card class="box-card">
            <div class="table-header">
                <span class="table-title">Recognition History</span>
            </div>
            <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
                <el-table-column label="Image" width="120">
                    <template #default="{ row }">
                        <el-image v-if="row.imageUrl" :src="row.imageUrl.split(',')[0]"
                            style="width: 60px; height: 60px" fit="cover"
                            :preview-src-list="row.imageUrl.split(',')"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="Status" width="120">
                    <template #default="{ row }">
                        <el-tag :type="row.statusType === 2 ? 'success' : row.statusType === 3 ? 'danger' : 'warning'">
                            {{ row.statusTypeFormat }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Result" show-overflow-tooltip>
                    <template #default="{ row }">
                        <el-button type="primary" link @click="viewResult(row)">View Details</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="Time" width="180" show-overflow-tooltip>
                    <template #default="{ row }">{{ row.creationTime }}</template>
                </el-table-column>
                <el-table-column label="Actions" width="160" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="default" @click="viewResult(row)">View</el-button>
                        <el-button type="danger" size="default" @click="showDeleteModal(row.id)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.page" :page-sizes="[10, 20, 50]" :page-size="pagination.limit"
                    layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
                </el-pagination>
            </div>
        </el-card>

        <!-- Detail Dialog -->
        <el-dialog title="Recognition Details" v-model="detailShow" width="70%">
            <div v-if="detailData" class="detail-dialog">
                <div class="detail-image" v-if="detailData.imageUrl">
                    <el-image :src="detailData.imageUrl" style="max-width: 400px; max-height: 400px" fit="contain"
                        :preview-src-list="[detailData.imageUrl]"></el-image>
                </div>
                <div class="detail-result">
                    <div class="detail-status">
                        <span>Status: </span>
                        <el-tag
                            :type="detailData.statusType === 2 ? 'success' : detailData.statusType === 3 ? 'danger' : 'warning'">
                            {{ detailData.statusTypeFormat }}
                        </el-tag>
                    </div>
                    <div class="detail-time">Time: {{ detailData.creationTime }}</div>
                    <div class="detail-text-wrap">
                        <div class="detail-label">Recognition Result:</div>
                        <pre class="detail-text">{{ detailData.parsedText || detailData.recognitionResult || 'No result' }}
                </pre>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { post } from '@/api/http';
import { useCommonStore } from "@/store";
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import UploadImages from '@/components/Form/UploadImages.vue';

const commonStore = useCommonStore();
const roleType = commonStore.roleType;

const imageUrl = ref('');
const recognizing = ref(false);
const currentResult = ref(null);
const loading = ref(false);
const tableData = ref([]);
const detailShow = ref(false);
const detailData = ref(null);

const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0
});

const fetchData = async () => {
    loading.value = true;
    try {
        const params = {
            page: pagination.page,
            limit: pagination.limit,
        };
        if (roleType !== 'Admin') {
            params.userId = commonStore.userId;
        }
        const { data, success } = await post('/aiBillRecognition/list', params);
        if (success) {
            tableData.value = data.items || [];
            pagination.total = data.totalCount || 0;
        }
    } finally {
        loading.value = false;
    }
};

const handleRecognize = async () => {
    if (!imageUrl.value) {
        ElMessage.warning({ message: 'Please upload an image first', duration: 1500 });
        return;
    }
    recognizing.value = true;
    currentResult.value = null;
    try {
        const { data, success } = await post('/aiBillRecognition/recognize', {
            imageUrl: imageUrl.value,
            userId: commonStore.userId
        });
        if (success) {
            currentResult.value = data;
            ElMessage.success({ message: 'Recognition completed', duration: 1500 });
            fetchData();
        }
    } catch (e) {
        ElMessage.error({ message: 'Recognition failed', duration: 1500 });
    } finally {
        recognizing.value = false;
    }
};

const viewResult = (row) => {
    detailData.value = row;
    detailShow.value = true;
};

const handleCurrentChange = (page) => {
    pagination.page = page;
    fetchData();
};

const handleSizeChange = (size) => {
    pagination.limit = size;
    pagination.page = 1;
    fetchData();
};

const showDeleteModal = async (id) => {
    try {
        await ElMessageBox.confirm('Are you sure you want to delete this record?', 'Confirm', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
        });
        const { success } = await post('/aiBillRecognition/deleteById', { id });
        if (success) {
            fetchData();
            ElMessage.success({ message: 'Deleted successfully', duration: 1500 });
        }
    } catch {
        // cancelled
    }
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped lang="scss">
.box-card {
    margin-bottom: 20px;
}

.recognize-section {
    display: flex;
    align-items: flex-end;
    gap: 20px;
}

.upload-area {
    flex: 1;
}

.upload-tip {
    font-size: 13px;
    color: #909399;
    margin-top: 8px;
}

.result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.result-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.result-content {
    margin-bottom: 16px;
}

.result-text {
    background: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 16px;
    font-size: 14px;
    line-height: 1.8;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 400px;
    overflow-y: auto;
    font-family: inherit;
}

.table-header {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.table-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.pagination-box {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.detail-dialog {
    display: flex;
    gap: 24px;
}

.detail-image {
    flex-shrink: 0;
}

.detail-result {
    flex: 1;
    min-width: 0;
}

.detail-status {
    margin-bottom: 12px;
}

.detail-time {
    font-size: 14px;
    color: #909399;
    margin-bottom: 16px;
}

.detail-label {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
}

.detail-text {
    background: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 16px;
    font-size: 14px;
    line-height: 1.8;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 500px;
    overflow-y: auto;
    font-family: inherit;
}
</style>
