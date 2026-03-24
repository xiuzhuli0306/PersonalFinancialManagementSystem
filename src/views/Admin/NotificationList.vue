<template>
    <div>

        <!-- Search form card -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-row>
                    <el-button type="primary" size="default" @click="searchClick">
                        <el-icon>
                            <Search />
                        </el-icon>Search
                    </el-button>
                    <el-button type="warning" size="default" @click="resetClick">
                        <el-icon>
                            <Refresh />
                        </el-icon>Reset
                    </el-button>
                </el-row>
            </div>
            <div class="margin-top-sm">
                <el-form :inline="true" :model="searchForm" size="default">
                    <el-form-item label="Keyword" prop="keyWord">
                        <el-input v-model.trim="searchForm.keyWord" placeholder="Enter keyword"
                            :clearable="true"></el-input>
                    </el-form-item>




                    <el-form-item label="Recipient">
                        <SigleSelect url="/sysUser/list" class="search-input" columnName="userName" :clearable="true"
                            columnValue="id" v-model="searchForm.userId">
                        </SigleSelect>
                    </el-form-item>


                    <el-form-item label="Notification Type">
                        <SigleSelect url="/select/notificationTypeEnum" class="search-input" columnName="name"
                            :clearable="true" columnValue="code" v-model="searchForm.notificationType">
                        </SigleSelect>
                    </el-form-item>


                    <el-form-item label="Read" class="search-input">
                        <el-select style="width:180px" v-model="searchForm.isRead" class="search-input"
                            :clearable="true" placeholder="Select read status">
                            <el-option key="true" label="Yes" value="true">
                            </el-option>
                            <el-option key="false" label="No" value="false">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <!-- Data table -->
        <el-card class="box-card">
            <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
                <el-table-column label="Username">
                    <template #default="{ row }">
                        {{ row.userDto.userName }}
                    </template>
                </el-table-column>
                <el-table-column label="Title">
                    <template #default="{ row }">
                        {{ row.title }}
                    </template>
                </el-table-column>
                <el-table-column label="Content" width="140">
                    <template #default="{ row }">
                        <RichButton :content="row.content"></RichButton>
                    </template>
                </el-table-column>
                <el-table-column label="Notification Type">
                    <template #default="{ row }">
                        {{ row.notificationTypeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="Read" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.isRead ? 'success' : 'danger'">{{ row.isRead ? 'Yes' : 'No' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Related ID">
                    <template #default="{ row }">
                        {{ row.relatedId }}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.page" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.limit"
                    layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
                </el-pagination>
            </div>
        </el-card>



    </div>
</template>


<script setup>
import { post } from '@/api/http';
import { useCommonStore } from "@/store";

import { Delete, Edit, Refresh, Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, onBeforeMount, nextTick, watch, computed, reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const commonStore = useCommonStore();
// Computed properties
const token = computed(() => commonStore.token)
const userInfo = computed(() => commonStore.userInfo)
const roleType = computed(() => commonStore.roleType)
const userId = computed(() => commonStore.userId)

//Table conditions
const where = reactive({});
// Search form data
const searchForm = reactive({});

// Edit form data
const formData = reactive({});

// Edit dialog visibility
const editorShow = ref(false);

// Form reference
const editModalForm = ref(null);

// Table data
const tableData = ref([]);
const loading = ref(false);
const selectedRows = ref([]);

// Pagination config
const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0
});


// Form validation rules
const editModalFormRules = reactive({
    "userId": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "title": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "content": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "notificationType": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "isRead": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "relatedId": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
});


// Fetch list data
const fetchData = async () => {
    loading.value = true;
    try {
        const { data, success } = await post('/notification/list', {
            page: pagination.page,
            limit: pagination.limit,
            ...searchForm,
            ...where
        });
        if (success) {
            tableData.value = data.items || [];
            pagination.total = data.totalCount || 0;
        }
    } finally {
        loading.value = false;
    }
};

// Page change
const handleCurrentChange = (page) => {
    pagination.page = page;
    fetchData();
};

// Page size change
const handleSizeChange = (size) => {
    pagination.limit = size;
    pagination.page = 1;
    fetchData();
};

// Selection change
const handleSelectionChange = (rows) => {
    selectedRows.value = rows;
};


// Show edit dialog
const showEditModal = async (id) => {

    const { data } = await post(`/notification/findById`, { id: id });

    Object.assign(formData, data);

    editorShow.value = true;

};

// Create or edit form
const addOrEditForm = async () => {
    if (!editModalForm.value) return;

    await editModalForm.value.validate(async valid => {
        if (valid) {
            const { success } = await post(`/notification/addOrEdit`, formData);

            if (success) {
                editorShow.value = false;
                fetchData();
                ElMessage.success('Operation successful');
            }
        }
    });
};


// Search click
const searchClick = () => {
    pagination.page = 1;
    fetchData();
};

// Reset search
const resetClick = () => {
    Object.keys(searchForm).forEach(key => {
        searchForm[key] = undefined;
    });
    pagination.page = 1;
    fetchData();
};

// Show delete confirmation
const showDeleteModal = async (id) => {

    try {
        await ElMessageBox.confirm('Are you sure you want to delete this record?', 'Warning', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
        })
        const { success } = await post(`/notification/deleteById`, { id: id });
        if (success) {
            fetchData();
            ElMessage.success('Deleted successfully');
        }
    }
    catch (error) {
        ElMessage.warning('Operation cancelled');
    }
};

// Batch Delete
const batchDelete = async () => {
    const ids = selectedRows.value.map(x => x.id);
    if (ids.length > 0) {
        try {
            await ElMessageBox.confirm('Are you sure you want to delete the selected records?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            })


            const { success } = await post(`/notification/batchDeleteByIds`, { ids: ids });
            if (success) {
                fetchData();
                ElMessage.success('Deleted successfully');
            }
        }
        catch (error) {
            ElMessage.warning('Operation cancelled');
        }
    }
    else {
        ElMessage.warning('Please select records to delete first');
    }
};

onMounted(() => {
    fetchData();
});

onBeforeMount(() => {

});
</script>

<style scoped lang="scss">
/* Search form style */
.box-card {
    margin-bottom: 20px;
}

.table-header {
    margin-bottom: 15px;
}

.pagination-box {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>