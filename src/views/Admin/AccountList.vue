<template>
    <div>

        <!-- 搜索表单卡片 -->
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
                        <SigleSelect url="/sysUser/list" class="search-input" columnName="userName" :clearable="true"
                            columnValue="id" v-model="searchForm.userId">
                        </SigleSelect>
                    </el-form-item>


                    <el-form-item label="Enabled" class="search-input">
                        <el-select style="width:180px" v-model="searchForm.isEnabled" class="search-input"
                            :clearable="true" placeholder="Select enabled status">
                            <el-option key="true" label="Yes" value="true">
                            </el-option>
                            <el-option key="false" label="No" value="false">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <!-- 编辑对话框 -->
        <el-dialog :title="formData.id ? 'Edit Account' : 'Add Account'" v-model="editorShow" width="50%"
            :lock-scroll="true" min-height="500px">
            <el-form v-if="editorShow" ref="editModalForm" :rules="editModalFormRules" :model="formData"
                label-width="140px" size="default">
                <el-row :gutter="10" class="edit-from-body">

                    <el-col :span="24">
                        <el-form-item label="Account Name" prop="accountName">
                            <el-input type="text" v-model="formData.accountName" placeholder="Enter account name"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :span="24">
                        <el-form-item label="Emoji Icon" prop="emoji">
                            <el-input type="text" v-model="formData.emoji" placeholder="Enter emoji icon"
                                :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :span="24">
                        <el-form-item label="Enabled" prop="isEnabled">
                            <el-switch v-model="formData.isEnabled" :active-value="true" :inactive-value="false">
                            </el-switch>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="Remark" prop="remark">
                            <el-input type="textarea" :rows="5" v-model.trim="formData.remark"
                                placeholder="Enter remark" :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="User" prop="userId">
                            <SigleSelect url="/sysUser/list" columnName="userName" columnValue="id"
                                v-model="formData.userId">
                            </SigleSelect>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row type="flex" justify="end" align="bottom">
                    <el-form-item>
                        <el-button size="default" type="primary" plain @click="addOrEditForm()">Confirm</el-button>
                        <el-button size="default" @click="editorShow = false">Cancel</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>





        <!-- 数据表格 -->
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
                <ExportButton exportUrl="/account/export" :where="searchForm"></ExportButton>
            </div>
            <el-table v-loading="loading" :data="tableData" stripe style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="Account Name">
                    <template #default="{ row }">
                        {{ row.accountName }}
                    </template>
                </el-table-column>
                <el-table-column label="Emoji Icon">
                    <template #default="{ row }">
                        {{ row.emoji }}
                    </template>
                </el-table-column>
                <el-table-column label="Enabled" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.isEnabled ? 'success' : 'danger'">{{ row.isEnabled ? 'Yes' : 'No' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Remark" width="140">
                    <template #default="{ row }">
                        <RichButton :content="row.remark"></RichButton>
                    </template>
                </el-table-column>
                <el-table-column label="Username">
                    <template #default="{ row }">
                        {{ row.userDto.userName }}
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
// 计算属性
const token = computed(() => commonStore.token)
const userInfo = computed(() => commonStore.userInfo)
const roleType = computed(() => commonStore.roleType)
const userId = computed(() => commonStore.userId)

//表格条件
const where = reactive({});
// 搜索表单数据
const searchForm = reactive({});

// 编辑表单数据
const formData = reactive({});

// 编辑对话框显示状态
const editorShow = ref(false);

// 表单引用
const editModalForm = ref(null);

// 表格数据
const tableData = ref([]);
const loading = ref(false);
const selectedRows = ref([]);

// 分页配置
const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0
});


// 表单验证规则
const editModalFormRules = reactive({
    "accountName": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "emoji": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "isEnabled": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "remark": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
    "userId": [
        { required: true, message: 'This field is required', trigger: 'blur' },
    ],
});


// 获取列表数据
const fetchData = async () => {
    loading.value = true;
    try {
        const { data, success } = await post('/account/list', {
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

// 页码改变
const handleCurrentChange = (page) => {
    pagination.page = page;
    fetchData();
};

// 每页条数改变
const handleSizeChange = (size) => {
    pagination.limit = size;
    pagination.page = 1;
    fetchData();
};

// 选择行变化
const handleSelectionChange = (rows) => {
    selectedRows.value = rows;
};


// 显示编辑对话框
const showEditModal = async (id) => {

    const { data } = await post(`/account/findById`, { id: id });

    Object.assign(formData, data);

    editorShow.value = true;

};

// 创建或编辑表单
const addOrEditForm = async () => {
    if (!editModalForm.value) return;

    await editModalForm.value.validate(async valid => {
        if (valid) {
            const { success } = await post(`/account/addOrEdit`, formData);

            if (success) {
                editorShow.value = false;
                fetchData();
                ElMessage.success('Operation successful');
            }
        }
    });
};


// 搜索点击
const searchClick = () => {
    pagination.page = 1;
    fetchData();
};

// 重置搜索条件
const resetClick = () => {
    Object.keys(searchForm).forEach(key => {
        searchForm[key] = undefined;
    });
    pagination.page = 1;
    fetchData();
};

// 显示删除确认框
const showDeleteModal = async (id) => {

    try {
        await ElMessageBox.confirm('Are you sure to delete this record?', 'Warning', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
        })
        const { success } = await post(`/account/deleteById`, { id: id });
        if (success) {
            fetchData();
            ElMessage.success('Deleted successfully');
        }
    }
    catch (error) {
        ElMessage.warning('Operation cancelled');
    }
};

// 批量删除
const batchDelete = async () => {
    const ids = selectedRows.value.map(x => x.id);
    if (ids.length > 0) {
        try {
            await ElMessageBox.confirm('Are you sure to delete the selected records?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            })


            const { success } = await post(`/account/batchDeleteByIds`, { ids: ids });
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
/* 搜索表单样式 */
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