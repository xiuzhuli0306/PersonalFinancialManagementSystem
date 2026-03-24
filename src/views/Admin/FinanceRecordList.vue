<template>
    <div>

        <!-- Search Form -->
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






                    <el-form-item label="User">
                        <SigleSelect class="search-input" columnName="userName" :clearable="true" columnValue="id"
                            v-model="searchForm.userId" url="/sysUser/list">
                        </SigleSelect>
                    </el-form-item>


                    <el-form-item label="Direction">
                        <SigleSelect url="/select/directionTypeEnum" class="search-input" columnName="name"
                            :clearable="true" columnValue="code" v-model="searchForm.directionType">
                        </SigleSelect>
                    </el-form-item>


                    <el-form-item label="Record Time" class="search-input">
                        <el-date-picker v-model="searchForm.recordTimeRange" type="datetimerange"
                            start-placeholder="Start time" end-placeholder="End time"
                            value-format="YYYY-MM-DD HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>


                    <el-form-item label="Trade Time" class="search-input">
                        <el-date-picker v-model="searchForm.tradeTimeRange" type="datetimerange"
                            start-placeholder="Start time" end-placeholder="End time"
                            value-format="YYYY-MM-DD HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>


                    <el-form-item label="Large Amount" class="search-input">
                        <el-select style="width:180px" v-model="searchForm.isLargeAmount" class="search-input"
                            :clearable="true" placeholder="Select large amount status">
                            <el-option key="true" label="Yes" :value="true">
                            </el-option>
                            <el-option key="false" label="No" :value="false">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-dialog :title="formData.id ? 'Edit Transaction' : 'Add Transaction'" v-model="editorShow" width="50%"
            :lock-scroll="true" min-height="500px">
            <el-form v-if="editorShow" ref="editModalForm" :rules="editModalFormRules" :model="formData"
                label-width="140px" size="default">
                <el-row :gutter="10" class="edit-from-body">

                    <el-col :span="24">
                        <el-form-item label="User" prop="userId">
                            <SigleSelect url="/sysUser/list" columnName="userName" columnValue="id"
                                v-model="formData.userId">
                            </SigleSelect>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Transaction No." prop="recordNo">
                            <el-input type="text" v-model="formData.recordNo" placeholder="Enter transaction no."
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :span="24">
                        <el-form-item label="Direction" prop="directionType">
                            <SigleSelect url="/select/directionTypeEnum" columnName="name" columnValue="code"
                                v-model="formData.directionType">
                            </SigleSelect>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Parent Category" prop="financeTypeParentId">
                            <el-select v-model="formData.financeTypeParentId" placeholder="Select parent category"
                                clearable style="width: 100%" @change="onFormParentChange">
                                <el-option v-for="item in formParentOptions" :key="item.id" :label="item.typeName"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Sub Category" prop="financeTypeId">
                            <el-select v-model="formData.financeTypeId" placeholder="Select sub category (optional)"
                                clearable style="width: 100%" :disabled="!formData.financeTypeParentId">
                                <el-option v-for="item in formChildOptions" :key="item.id" :label="item.typeName"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Account" prop="accountId">
                            <SigleSelect url="/account/list" columnName="accountName" columnValue="id"
                                v-model="formData.accountId" :where="roleType !== 'Admin' ? { userId: userId } : {}">
                            </SigleSelect>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Amount" prop="amount">
                            <el-input-number style="width:100%" v-model="formData.amount" placeholder="Enter amount"
                                :clearable="true" :min="1" :max="1000000"></el-input-number>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Record Time" prop="recordTime">
                            <el-date-picker v-model="formData.recordTime" align="right" type="datetime"
                                placeholder="Select time" value-format="YYYY-MM-DD HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Trade Time" prop="tradeTime">
                            <el-date-picker v-model="formData.tradeTime" align="right" type="datetime"
                                placeholder="Select time" value-format="YYYY-MM-DD HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Remark" prop="remark">
                            <el-input type="textarea" :rows="5" v-model.trim="formData.remark"
                                placeholder="Enter remark" :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Trader" prop="trader">
                            <el-input type="text" v-model="formData.trader" placeholder="Enter trader"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :span="24">
                        <el-form-item label="Receipt Image" prop="imageUrls">
                            <UploadImages :limit="1" v-model="formData.imageUrls"></UploadImages>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Large Amount" prop="isLargeAmount">
                            <el-switch v-model="formData.isLargeAmount" :active-value="true" :inactive-value="false">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row type="flex" justify="end" align="bottom">
                    <el-form-item>
                        <el-button size="default" type="primary" plain @click="addOrEditForm()">Save</el-button>
                        <el-button size="default" @click="editorShow = false">Cancel</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>





        <!-- Data Table -->
        <el-card class="box-card">
            <div class="table-header">
                <el-button v-if="roleType !== 'Admin'" type="primary" size="default" @click="showEditModal()">
                    <el-icon>
                        <Edit />
                    </el-icon>Add
                </el-button>
                <el-button v-if="roleType !== 'Admin'" type="danger" size="default" @click="batchDelete">
                    <el-icon>
                        <Delete />
                    </el-icon>Batch Delete
                </el-button>
                <ExportButton exportUrl="/financeRecord/export" :where="searchForm"></ExportButton>
            </div>
            <el-table v-loading="loading" :data="tableData" stripe style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="Username">
                    <template #default="{ row }">
                        {{ row.userDto.userName }}
                    </template>
                </el-table-column>
                <el-table-column label="Transaction No.">
                    <template #default="{ row }">
                        {{ row.recordNo }}
                    </template>
                </el-table-column>
                <el-table-column label="Direction">
                    <template #default="{ row }">
                        {{ row.directionTypeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="Category Name">
                    <template #default="{ row }">
                        <span
                            v-if="row.financeTypeParentDto && row.financeTypeParentDto.typeName && row.financeTypeDto && row.financeTypeDto.typeName && row.financeTypeParentDto.id !== row.financeTypeDto.id">
                            {{ row.financeTypeParentDto.typeName }} / {{ row.financeTypeDto.typeName }}
                        </span>
                        <span v-else>
                            {{ row.financeTypeDto.typeName }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="Account Name">
                    <template #default="{ row }">
                        {{ row.accountDto.accountName }}
                    </template>
                </el-table-column>
                <el-table-column label="Amount">
                    <template #default="{ row }">
                        {{ row.amount }}
                    </template>
                </el-table-column>
                <el-table-column label="Record Time">
                    <template #default="{ row }">
                        {{ row.recordTime }}
                    </template>
                </el-table-column>
                <el-table-column label="Trade Time">
                    <template #default="{ row }">
                        {{ row.tradeTime }}
                    </template>
                </el-table-column>
                <el-table-column label="Remark" width="140">
                    <template #default="{ row }">
                        <RichButton :content="row.remark"></RichButton>
                    </template>
                </el-table-column>
                <el-table-column label="Trader">
                    <template #default="{ row }">
                        {{ row.trader }}
                    </template>
                </el-table-column>
                <el-table-column label="Receipt Image" width="120">
                    <template #default="{ row }">
                        <el-image v-if="row.imageUrls" :src="row.imageUrls.split(',')[0]"
                            style="width: 50px; height: 50px" fit="cover" :preview-src-list="row.imageUrls.split(',')">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="Large Amount" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.isLargeAmount ? 'success' : 'danger'">{{ row.isLargeAmount ? 'Yes' : 'No'
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Actions" width="200" fixed="right" v-if="roleType !== 'Admin'">
                    <template #default="{ row }">
                        <el-button type="primary" size="default" @click="showEditModal(row.id)">
                            <el-icon>
                                <Edit />
                            </el-icon>Edit
                        </el-button>
                        <el-button type="danger" size="default" @click="showDeleteModal(row.id)">
                            <el-icon>
                                <Delete />
                            </el-icon>Delete
                        </el-button>
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
import ExportButton from '@/components/Tables/ExportButton.vue';

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

// Category tree for cascader
const categoryTree = ref([]);

// Editor dialog visibility
const editorShow = ref(false);

// Form ref
const editModalForm = ref(null);

// Table data
const tableData = ref([]);
const loading = ref(false);
const selectedRows = ref([]);

// Pagination
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
    "recordNo": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "directionType": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "financeTypeId": [
    ],
    "financeTypeParentId": [
        { required: true, message: 'This field is required', trigger: 'change' },
    ],
    "accountId": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "amount": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "recordTime": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "tradeTime": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "remark": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "trader": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "imageUrls": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "isLargeAmount": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
});


// All flat category items for building options
const allCategoryItems = ref([]);

// Load category tree for current user
const loadCategoryTree = async () => {
    const params = { limit: 999 };
    // Non-admin users only see their own categories
    if (roleType.value !== 'Admin') {
        params.userId = userId.value;
    }
    const { data, success } = await post('/financeType/list', params);
    if (success) {
        allCategoryItems.value = data.items || [];
        const allItems = data.items || [];
        // Build tree: top-level items (no parentId) with children
        const topLevel = allItems.filter(item => !item.parentId);
        const subLevel = allItems.filter(item => item.parentId);
        categoryTree.value = topLevel.map(parent => {
            const children = subLevel.filter(child => child.parentId === parent.id);
            return {
                ...parent,
                children: children.length > 0 ? children : undefined
            };
        });
    }
};

// --- Edit form: two-level category ---
const formParentOptions = computed(() => allCategoryItems.value.filter(i => !i.parentId));
const formChildOptions = computed(() => {
    if (!formData.financeTypeParentId) return [];
    return allCategoryItems.value.filter(i => i.parentId === formData.financeTypeParentId);
});
const onFormParentChange = () => {
    formData.financeTypeId = null;
};

// Fetch list data
const fetchData = async () => {
    loading.value = true;
    try {
        const { data, success } = await post('/financeRecord/list', {
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

    const { data } = await post(`/financeRecord/findById`, { id: id });

    Object.assign(formData, data);

    // If financeTypeId equals financeTypeParentId, it means only parent was selected
    // Clear financeTypeId so the sub-category dropdown shows empty
    if (formData.financeTypeId && formData.financeTypeParentId && formData.financeTypeId === formData.financeTypeParentId) {
        formData.financeTypeId = null;
    }

    editorShow.value = true;

};

// Save form
const addOrEditForm = async () => {
    if (!editModalForm.value) return;

    await editModalForm.value.validate(async valid => {
        if (valid) {
            // If no sub-category selected, use parent as financeTypeId
            const submitData = { ...formData };
            if (!submitData.financeTypeId && submitData.financeTypeParentId) {
                submitData.financeTypeId = submitData.financeTypeParentId;
            }
            const { success } = await post(`/financeRecord/addOrEdit`, submitData);

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

// Delete confirmation
const showDeleteModal = async (id) => {

    try {
        await ElMessageBox.confirm('Are you sure you want to delete this record?', 'Warning', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
        })
        const { success } = await post(`/financeRecord/deleteById`, { id: id });
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

            const { success } = await post(`/financeRecord/batchDeleteByIds`, { ids: ids });
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
    loadCategoryTree();
    fetchData();
});

onBeforeMount(() => {

});
</script>

<style scoped lang="scss">
/* Search form styles */
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