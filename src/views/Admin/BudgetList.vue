<template>
    <div>

        <!-- Search Form Card -->
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

                    <el-form-item label="User" v-if="roleType === 'Admin'">
                        <SigleSelect url="/sysUser/list" class="search-input" columnName="userName" :clearable="true"
                            columnValue="id" v-model="searchForm.userId">
                        </SigleSelect>
                    </el-form-item>

                    <el-form-item label="Total Budget" class="search-input">
                        <el-select style="width:180px" v-model="searchForm.isTotal" class="search-input"
                            :clearable="true" placeholder="Select total budget">
                            <el-option key="true" label="Yes" value="true"></el-option>
                            <el-option key="false" label="No" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

        <!-- Edit Dialog -->
        <el-dialog :title="formData.id ? 'Edit Budget' : 'Add Budget'" v-model="editorShow" width="50%"
            :lock-scroll="true" min-height="500px">
            <el-form v-if="editorShow" ref="editModalForm" :rules="editModalFormRules" :model="formData"
                label-width="140px" size="default">
                <el-row :gutter="10" class="edit-from-body">

                    <el-col :span="24" v-if="roleType === 'Admin'">
                        <el-form-item label="User" prop="userId">
                            <SigleSelect url="/sysUser/list" columnName="userName" columnValue="id"
                                v-model="formData.userId">
                            </SigleSelect>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Budget Name" prop="budgetName">
                            <el-input type="text" v-model="formData.budgetName" placeholder="Enter budget name"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Budget Amount" prop="budgetAmount">
                            <el-input-number style="width:100%" v-model="formData.budgetAmount"
                                placeholder="Enter budget amount" :clearable="true" :min="1"
                                :max="1000000"></el-input-number>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Used Amount" prop="usedAmount">
                            <el-input-number style="width:100%" v-model="formData.usedAmount"
                                placeholder="Enter used amount" :clearable="true" :min="1"
                                :max="1000000"></el-input-number>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Budget Year" prop="budgetYear">
                            <el-input-number style="width:100%" v-model="formData.budgetYear"
                                placeholder="Enter budget year" :clearable="true" :min="1"
                                :max="1000000"></el-input-number>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Budget Month" prop="budgetMonth">
                            <el-input-number style="width:100%" v-model="formData.budgetMonth"
                                placeholder="Enter budget month" :clearable="true" :min="1"
                                :max="1000000"></el-input-number>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Total Budget" prop="isTotal">
                            <el-switch v-model="formData.isTotal" :active-value="true" :inactive-value="false">
                            </el-switch>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24" v-if="!formData.isTotal">
                        <el-form-item label="Parent Category" prop="financeTypeParentId">
                            <el-select v-model="formData.financeTypeParentId" placeholder="Select parent category"
                                clearable style="width: 100%" @change="onFormParentChange">
                                <el-option v-for="item in formParentOptions" :key="item.id" :label="item.typeName"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="!formData.isTotal">
                        <el-form-item label="Sub Category" prop="financeTypeId">
                            <el-select v-model="formData.financeTypeId" placeholder="Select sub category (optional)"
                                clearable style="width: 100%" :disabled="!formData.financeTypeParentId">
                                <el-option v-for="item in formChildOptions" :key="item.id" :label="item.typeName"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Warning Rate" prop="warningRate">
                            <el-input-number style="width:100%" v-model="formData.warningRate"
                                placeholder="Enter warning rate" :clearable="true" :min="1"
                                :max="1000000"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row type="flex" justify="end" align="bottom">
                    <el-form-item>
                        <el-button size="default" type="primary" plain @click="addOrEditForm()">OK</el-button>
                        <el-button size="default" @click="editorShow = false">Cancel</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>

        <!-- Data Table -->
        <el-card class="box-card">
            <div class="table-header" v-if="roleType !== 'Admin'">
                <el-button type="primary" size="default" @click="showEditModal()">
                    <el-icon>
                        <Edit />
                    </el-icon>Add
                </el-button>
                <el-button type="danger" size="default" @click="batchDelete">
                    <el-icon>
                        <Delete />
                    </el-icon>Batch Delete
                </el-button>
            </div>
            <el-table v-loading="loading" :data="tableData" stripe style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="Username" v-if="roleType === 'Admin'">
                    <template #default="{ row }">{{ row.userDto.userName }}</template>
                </el-table-column>
                <el-table-column label="Budget Name">
                    <template #default="{ row }">{{ row.budgetName }}</template>
                </el-table-column>
                <el-table-column label="Category" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span v-if="row.isTotal">-</span>
                        <span
                            v-else-if="row.financeTypeParentDto && row.financeTypeParentDto.typeName && row.financeTypeDto && row.financeTypeDto.typeName && row.financeTypeParentDto.id !== row.financeTypeDto.id">
                            {{ row.financeTypeParentDto.typeName }} / {{ row.financeTypeDto.typeName }}
                        </span>
                        <span v-else-if="row.financeTypeDto && row.financeTypeDto.typeName">
                            {{ row.financeTypeDto.typeName }}
                        </span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="Budget Amount">
                    <template #default="{ row }">{{ row.budgetAmount }}</template>
                </el-table-column>
                <el-table-column label="Used Amount">
                    <template #default="{ row }">{{ row.usedAmount }}</template>
                </el-table-column>
                <el-table-column label="Budget Year">
                    <template #default="{ row }">{{ row.budgetYear }}</template>
                </el-table-column>
                <el-table-column label="Budget Month">
                    <template #default="{ row }">{{ row.budgetMonth }}</template>
                </el-table-column>
                <el-table-column label="Total Budget" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.isTotal ? 'success' : 'danger'">{{ row.isTotal ? 'Yes' : 'No' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Warning Rate">
                    <template #default="{ row }">{{ row.warningRate }}</template>
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
import { Delete, Edit, Refresh, Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, onBeforeMount, nextTick, watch, computed, reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const commonStore = useCommonStore();
const token = computed(() => commonStore.token)
const userInfo = computed(() => commonStore.userInfo)
const roleType = computed(() => commonStore.roleType)
const userId = computed(() => commonStore.userId)

const where = reactive({});
const searchForm = reactive({});
const formData = reactive({});
const editorShow = ref(false);
const editModalForm = ref(null);
const tableData = ref([]);
const loading = ref(false);
const selectedRows = ref([]);

const pagination = reactive({ page: 1, limit: 10, total: 0 });

const editModalFormRules = reactive({
    "budgetName": [{ required: true, message: 'This field is required', trigger: 'blur' }],
    "budgetAmount": [{ required: true, message: 'This field is required', trigger: 'blur' }],
    "budgetYear": [{ required: true, message: 'This field is required', trigger: 'blur' }],
    "budgetMonth": [{ required: true, message: 'This field is required', trigger: 'blur' }],
    "warningRate": [{ required: true, message: 'This field is required', trigger: 'blur' }],
});

// Category tree for two-level selection
const allCategoryItems = ref([]);

const loadCategoryTree = async () => {
    const params = { limit: 999 };
    if (roleType.value !== 'Admin') {
        params.userId = userId.value;
    }
    const { data, success } = await post('/financeType/list', params);
    if (success) {
        allCategoryItems.value = data.items || [];
    }
};

const formParentOptions = computed(() => allCategoryItems.value.filter(i => !i.parentId));
const formChildOptions = computed(() => {
    if (!formData.financeTypeParentId) return [];
    return allCategoryItems.value.filter(i => i.parentId === formData.financeTypeParentId);
});
const onFormParentChange = () => {
    formData.financeTypeId = null;
};

const fetchData = async () => {
    loading.value = true;
    try {
        const params = {
            page: pagination.page, limit: pagination.limit, ...searchForm, ...where
        };
        // Regular users only see their own budgets
        if (roleType.value !== 'Admin') {
            params.userId = userId.value;
        }
        const { data, success } = await post('/budget/list', params);
        if (success) {
            tableData.value = data.items || [];
            pagination.total = data.totalCount || 0;
        }
    } finally { loading.value = false; }
};

const handleCurrentChange = (page) => { pagination.page = page; fetchData(); };
const handleSizeChange = (size) => { pagination.limit = size; pagination.page = 1; fetchData(); };
const handleSelectionChange = (rows) => { selectedRows.value = rows; };

const showEditModal = async (id) => {
    if (id) {
        const { data } = await post(`/budget/findById`, { id: id });
        Object.assign(formData, data);
        // If financeTypeId equals financeTypeParentId, clear sub-category
        if (formData.financeTypeId && formData.financeTypeParentId && formData.financeTypeId === formData.financeTypeParentId) {
            formData.financeTypeId = null;
        }
    } else {
        // New budget: reset form with defaults
        Object.keys(formData).forEach(key => delete formData[key]);
        const now = new Date();
        Object.assign(formData, {
            budgetName: '',
            budgetAmount: 0,
            usedAmount: 0,
            budgetYear: now.getFullYear(),
            budgetMonth: now.getMonth() + 1,
            isTotal: false,
            warningRate: 80,
            financeTypeId: null,
            financeTypeParentId: null,
            userId: roleType.value !== 'Admin' ? userId.value : undefined
        });
    }
    editorShow.value = true;
};

const addOrEditForm = async () => {
    if (!editModalForm.value) return;
    await editModalForm.value.validate(async valid => {
        if (valid) {
            // Auto-set userId for regular users
            if (roleType.value !== 'Admin') {
                formData.userId = userId.value;
            }
            const submitData = { ...formData };
            // If total budget, clear category fields
            if (submitData.isTotal) {
                submitData.financeTypeId = null;
                submitData.financeTypeParentId = null;
            } else if (!submitData.financeTypeId && submitData.financeTypeParentId) {
                // If no sub-category selected, use parent as financeTypeId
                submitData.financeTypeId = submitData.financeTypeParentId;
            }
            const { success } = await post(`/budget/addOrEdit`, submitData);
            if (success) { editorShow.value = false; fetchData(); ElMessage.success('Operation successful'); }
        }
    });
};

const searchClick = () => { pagination.page = 1; fetchData(); };
const resetClick = () => {
    Object.keys(searchForm).forEach(key => { searchForm[key] = undefined; });
    pagination.page = 1; fetchData();
};

const showDeleteModal = async (id) => {
    try {
        await ElMessageBox.confirm('Are you sure to delete this record?', 'Warning', {
            confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning'
        })
        const { success } = await post(`/budget/deleteById`, { id: id });
        if (success) { fetchData(); ElMessage.success('Deleted successfully'); }
    } catch (error) { ElMessage.warning('Operation cancelled'); }
};

const batchDelete = async () => {
    const ids = selectedRows.value.map(x => x.id);
    if (ids.length > 0) {
        try {
            await ElMessageBox.confirm('Are you sure to delete the selected records?', 'Warning', {
                confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning'
            })
            const { success } = await post(`/budget/batchDeleteByIds`, { ids: ids });
            if (success) { fetchData(); ElMessage.success('Deleted successfully'); }
        } catch (error) { ElMessage.warning('Operation cancelled'); }
    } else { ElMessage.warning('Please select records to delete first'); }
};

onMounted(() => { loadCategoryTree(); fetchData(); });
onBeforeMount(() => { });
</script>

<style scoped lang="scss">
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
