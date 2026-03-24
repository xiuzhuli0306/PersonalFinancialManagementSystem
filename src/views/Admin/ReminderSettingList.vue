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

                    <el-form-item label="User">
                        <SigleSelect url="/sysUser/list" class="search-input" columnName="userName" :clearable="true"
                            columnValue="id" v-model="searchForm.userId">
                        </SigleSelect>
                    </el-form-item>

                    <el-form-item label="Budget Reminder" class="search-input">
                        <el-select style="width:180px" v-model="searchForm.isBudgetRemind" class="search-input"
                            :clearable="true" placeholder="Select budget reminder">
                            <el-option key="true" label="Yes" value="true">
                            </el-option>
                            <el-option key="false" label="No" value="false">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

        <!-- Edit Dialog -->
        <el-dialog :title="formData.id ? 'Edit Reminder' : 'Add Reminder'" v-model="editorShow" width="50%"
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
                        <el-form-item label="Budget Reminder" prop="isBudgetRemind">
                            <el-switch v-model="formData.isBudgetRemind" :active-value="true" :inactive-value="false">
                            </el-switch>
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
                <el-table-column label="Username">
                    <template #default="{ row }">
                        {{ row.userDto.userName }}
                    </template>
                </el-table-column>
                <el-table-column label="Budget Reminder" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.isBudgetRemind ? 'success' : 'danger'">{{ row.isBudgetRemind ? 'Yes' : 'No'
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

const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0
});

const editModalFormRules = reactive({
    "userId": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "isBudgetRemind": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
});

const fetchData = async () => {
    loading.value = true;
    try {
        const { data, success } = await post('/reminderSetting/list', {
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

const handleCurrentChange = (page) => {
    pagination.page = page;
    fetchData();
};

const handleSizeChange = (size) => {
    pagination.limit = size;
    pagination.page = 1;
    fetchData();
};

const handleSelectionChange = (rows) => {
    selectedRows.value = rows;
};

const showEditModal = async (id) => {
    const { data } = await post(`/reminderSetting/findById`, { id: id });
    Object.assign(formData, data);
    editorShow.value = true;
};

const addOrEditForm = async () => {
    if (!editModalForm.value) return;
    await editModalForm.value.validate(async valid => {
        if (valid) {
            const { success } = await post(`/reminderSetting/addOrEdit`, formData);
            if (success) {
                editorShow.value = false;
                fetchData();
                ElMessage.success('Operation successful');
            }
        }
    });
};

const searchClick = () => {
    pagination.page = 1;
    fetchData();
};

const resetClick = () => {
    Object.keys(searchForm).forEach(key => {
        searchForm[key] = undefined;
    });
    pagination.page = 1;
    fetchData();
};

const showDeleteModal = async (id) => {
    try {
        await ElMessageBox.confirm('Are you sure to delete this record?', 'Warning', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
        })
        const { success } = await post(`/reminderSetting/deleteById`, { id: id });
        if (success) {
            fetchData();
            ElMessage.success('Deleted successfully');
        }
    } catch (error) {
        ElMessage.warning('Operation cancelled');
    }
};

const batchDelete = async () => {
    const ids = selectedRows.value.map(x => x.id);
    if (ids.length > 0) {
        try {
            await ElMessageBox.confirm('Are you sure to delete the selected records?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            })
            const { success } = await post(`/reminderSetting/batchDeleteByIds`, { ids: ids });
            if (success) {
                fetchData();
                ElMessage.success('Deleted successfully');
            }
        } catch (error) {
            ElMessage.warning('Operation cancelled');
        }
    } else {
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
