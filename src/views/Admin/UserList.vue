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
            <div class="margin-top-xs">
                <el-form :inline="true" :model="searchForm" size="default">
                    <el-form-item label="Account">
                        <el-input v-model="searchForm.userName" class="search-input" placeholder="Enter account"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="Name">
                        <el-input v-model="searchForm.nickName" class="search-input" placeholder="Enter name"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="Email">
                        <el-input v-model="searchForm.email" class="search-input" placeholder="Enter email"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="Phone">
                        <el-input v-model="searchForm.phoneNumber" class="search-input" placeholder="Enter phone number"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="Role">
                        <SigleSelect v-model="searchForm.roleType" url="/select/roleType" columnName="name"
                            columnValue="code" columnLabel="label"></SigleSelect>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

        <!-- Edit dialog -->
        <el-dialog :title="formData.id ? 'Edit Account' : 'Add Account'" v-model="editorShow" width="50%"
            :lock-scroll="true" min-height="800px">
            <el-form v-if="editorShow" ref="editModalForm" :rules="editModalFormRules" :model="formData"
                label-width="140px" size="default">
                <el-row :gutter="10" class="edit-from-body">
                    <el-col :span="24">
                        <el-form-item label="Account" prop="userName" placeholder="Enter account">
                            <el-input v-model.trim="formData.userName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="!formData.id">
                        <el-form-item label="Password" prop="passWord">
                            <el-input type="password" v-model.trim="formData.passWord"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Role" prop="roleType">
                            <SigleSelect :filterValue="[2]" v-model="formData.roleType" url="/select/roleType"
                                columnName="name" columnValue="code" columnLabel="label"></SigleSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Email" prop="email" placeholder="Enter email">
                            <el-input v-model.trim="formData.email"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Phone" prop="phoneNumber" placeholder="Enter phone number">
                            <el-input v-model.trim="formData.phoneNumber"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Name" prop="nickName" placeholder="Enter name">
                            <el-input v-model.trim="formData.nickName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Avatar">
                            <UploadImages :limit="1" v-model="formData.imageUrls"></UploadImages>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="end" align="bottom">
                    <el-form-item>
                        <el-button type="primary" size="default" plain @click="addOrEditForm()">Confirm</el-button>
                        <el-button size="default" @click="editorShow = false">Cancel</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>

        <!-- Reset password dialog -->
        <el-dialog title="Reset Password" v-model="resetPasswordShow" width="40%" :lock-scroll="true">
            <el-form v-if="resetPasswordShow" ref="resetPasswordForm" :rules="resetPasswordRules"
                :model="resetPasswordData" label-width="120px" size="default">
                <el-form-item label="New Password" prop="passWord">
                    <el-input type="password" v-model.trim="resetPasswordData.passWord"
                        placeholder="Enter new password"></el-input>
                </el-form-item>
                <el-row type="flex" justify="end" align="bottom">
                    <el-form-item>
                        <el-button type="primary" size="default" plain
                            @click="confirmResetPassword()">Confirm</el-button>
                        <el-button size="default" @click="resetPasswordShow = false">Cancel</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>

        <!-- Data table -->
        <el-card class="box-card">
            <div class="table-header">
                <el-button type="primary" size="default" @click="showEditModal()">
                    <el-icon>
                        <Edit />
                    </el-icon>Add
                </el-button>
                <ExportButton exportUrl="/sysUser/export" :where="searchForm"></ExportButton>
            </div>
            <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">

                <el-table-column label="Account" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.userName }}
                    </template>
                </el-table-column>

                <el-table-column label="Name" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.nickName }}
                    </template>
                </el-table-column>
                <el-table-column label="Avatar" width="100">
                    <template #default="{ row }">
                        <el-image v-if="row.imageUrls" :src="row.imageUrls.split(',')[0]"
                            style="width: 50px; height: 50px" fit="cover" :preview-src-list="row.imageUrls.split(',')">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="Role" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.roleTypeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="Phone" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.phoneNumber }}
                    </template>
                </el-table-column>
                <el-table-column label="Email" width="150" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.email }}
                    </template>
                </el-table-column>
                <el-table-column label="Actions" width="300" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="default" class="margin-top-xs" @click="showEditModal(row.id)">
                            <el-icon>
                                <Edit />
                            </el-icon>Edit
                        </el-button>
                        <el-button type="primary" size="default" class="margin-top-xs" @click="resetPassword(row.id)">
                            <el-icon>
                                <Edit />
                            </el-icon>Reset Password
                        </el-button>
                        <el-button type="danger" size="default" class="margin-top-xs" @click="showDeleteModal(row.id)">
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
import { onMounted, reactive, ref } from 'vue';

const commonStore = useCommonStore();

// Search form data
const searchForm = reactive({});

// Edit form data
const formData = reactive({});

// Edit dialog visibility
const editorShow = ref(false);

// Form reference
const editModalForm = ref(null);

// Reset password form data
const resetPasswordData = reactive({
    id: null,
    passWord: '123456'
});

// Reset password dialog visibility
const resetPasswordShow = ref(false);

// Reset password form reference
const resetPasswordForm = ref(null);

// Table data
const tableData = ref([]);
const loading = ref(false);

// Pagination config
const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0
});

// Form validation rules
const editModalFormRules = {
    userName: [
        { required: true, message: 'This field is required', trigger: 'blur' },
        { min: 3, max: 20, message: 'Account must be 3-20 characters', trigger: 'blur' }
    ],
    passWord: [
        {
            validator: (rule, value, callback) => {
                // Required for new entries
                if (!formData.id && !value) {
                    callback(new Error('This field is required'));
                    return;
                }
                var reg = /^.{8,16}$/;
                if (!value || !reg.test(value)) {
                    callback(new Error('Password must be 8-16 characters'));
                } else {
                    callback();
                }
            }, trigger: 'blur'
        },
    ],
    email: [
        { required: true, message: 'This field is required', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (!value || !reg.test(value)) {
                    callback(new Error('Please enter a valid email address'));
                } else {
                    callback();
                }
            }, trigger: 'blur'
        },
    ],
    imageUrls: [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    nickName: [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    phoneNumber: [
        { required: true, message: 'This field is required', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                var reg = /^1[123456789]\d{9}$/;
                if (!value || !reg.test(value)) {
                    callback(new Error('Please enter a valid phone number (11 digits starting with 1)'));
                } else {
                    callback();
                }
            }, trigger: 'blur'
        },
    ],

    roleType: [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
};

// Reset password validation rules
const resetPasswordRules = {
    passWord: [
        { required: true, message: 'This field is required', trigger: 'blur' },
        { min: 6, max: 20, message: 'Password must be 6-20 characters', trigger: 'blur' }
    ],
};

// Fetch list data
const fetchData = async () => {
    loading.value = true;
    try {
        const { data, success } = await post('/sysUser/list', {
            page: pagination.page,
            limit: pagination.limit,
            ...searchForm
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

// Show reset password dialog
const resetPassword = (id) => {
    resetPasswordData.id = id;
    resetPasswordData.passWord = '123456';
    resetPasswordShow.value = true;
    // Clear form validation
    if (resetPasswordForm.value) {
        resetPasswordForm.value.clearValidate();
    }
};

// Confirm reset password
const confirmResetPassword = async () => {
    if (!resetPasswordForm.value) return;

    await resetPasswordForm.value.validate(async valid => {
        if (valid) {
            try {
                const { success } = await post(`/sysUser/resetPassword`, resetPasswordData);
                if (success) {
                    resetPasswordShow.value = false;
                    ElMessage.success('Password reset successful');
                }
            } catch (error) {
                ElMessage.error('Password reset failed');
            }
        }
    });
};

// Show edit dialog
const showEditModal = async (id) => {
    const { data } = await post(`/sysUser/findById`, { id: id });
    Object.assign(formData, data);
    editorShow.value = true;
};

// Create or edit form
const addOrEditForm = async () => {
    if (!editModalForm.value) return;

    await editModalForm.value.validate(async valid => {
        if (valid) {
            const { success } = await post(`/sysUser/addOrEdit`, formData);

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

// Reset search conditions
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
        await ElMessageBox.confirm('Are you sure you want to delete this account?', 'Confirm', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
        });

        const { success } = await post(`/sysUser/batchDeleteByIds`, { ids: [id] });
        if (success) {
            fetchData();
            ElMessage.success('Deleted successfully');
        }
    }
    catch (error) {
        ElMessage.warning('Operation cancelled');
    }
};

// Load data on mount
onMounted(() => {
    fetchData();
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
