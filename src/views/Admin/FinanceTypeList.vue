<template>
    <div>
        <!-- Header -->
        <el-card class="box-card">
            <div class="page-header">
                <div class="header-left">
                    <el-input v-model.trim="searchForm.keyWord" placeholder="Search categories..." clearable
                        style="width: 240px" @keyup.enter="fetchData">
                        <template #prefix>
                            <el-icon>
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                    <SigleSelect url="/select/directionTypeEnum" class="search-input" columnName="name"
                        :clearable="true" columnValue="code" v-model="searchForm.directionType" @change="fetchData"
                        style="width: 160px" />
                    <el-button type="primary" @click="fetchData">Search</el-button>
                    <el-button @click="resetClick">Reset</el-button>
                </div>
                <div class="header-right" v-if="roleType !== 'Admin'">
                    <el-button type="primary" @click="showAddTopLevel()">
                        <el-icon>
                            <Plus />
                        </el-icon>Add Top Category
                    </el-button>
                </div>
            </div>
        </el-card>

        <!-- Tree content -->
        <div v-loading="loading" class="tree-container">
            <div v-if="treeData.length === 0 && !loading" class="empty-tip">
                No categories found
            </div>
            <div v-for="parent in treeData" :key="parent.id" class="parent-card">
                <div class="parent-header">
                    <div class="parent-info">
                        <span class="cat-emoji" v-if="parent.emoji">{{ parent.emoji }}</span>
                        <span class="cat-color" v-if="parent.colorCode"
                            :style="{ background: parent.colorCode }"></span>
                        <span class="parent-name">{{ parent.typeName }}</span>
                        <el-tag size="small" :type="parent.directionTypeFormat === 'Income' ? 'success' : 'danger'"
                            style="margin-left: 8px">
                            {{ parent.directionTypeFormat }}
                        </el-tag>
                        <span class="cat-desc" v-if="parent.typeDesc">{{ parent.typeDesc }}</span>
                    </div>
                    <div class="parent-actions" v-if="roleType !== 'Admin'">
                        <el-button type="primary" link size="small" @click="showAddChild(parent.id)">
                            <el-icon>
                                <Plus />
                            </el-icon>Add Sub
                        </el-button>
                        <el-button type="primary" link size="small" @click="showEditModal(parent.id)">
                            <el-icon>
                                <Edit />
                            </el-icon>Edit
                        </el-button>
                        <el-button type="danger" link size="small" @click="showDeleteModal(parent.id)">
                            <el-icon>
                                <Delete />
                            </el-icon>Delete
                        </el-button>
                    </div>
                </div>
                <!-- Children -->
                <div v-if="parent.children && parent.children.length > 0" class="children-list">
                    <div v-for="child in parent.children" :key="child.id" class="child-item">
                        <div class="child-info">
                            <span class="cat-emoji" v-if="child.emoji">{{ child.emoji }}</span>
                            <span class="cat-color" v-if="child.colorCode"
                                :style="{ background: child.colorCode }"></span>
                            <span class="child-name">{{ child.typeName }}</span>
                            <el-tag size="small" :type="child.directionTypeFormat === 'Income' ? 'success' : 'danger'"
                                style="margin-left: 8px">
                                {{ child.directionTypeFormat }}
                            </el-tag>
                            <span class="cat-desc" v-if="child.typeDesc">{{ child.typeDesc }}</span>
                        </div>
                        <div class="child-actions" v-if="roleType !== 'Admin'">
                            <el-button type="primary" link size="small" @click="showEditModal(child.id)">
                                <el-icon>
                                    <Edit />
                                </el-icon>Edit
                            </el-button>
                            <el-button type="danger" link size="small" @click="showDeleteModal(child.id)">
                                <el-icon>
                                    <Delete />
                                </el-icon>Delete
                            </el-button>
                        </div>
                    </div>
                </div>
                <div v-else class="no-children">No sub-categories</div>
            </div>
        </div>

        <!-- Edit dialog -->
        <el-dialog :title="dialogTitle" v-model="editorShow" width="500px" :lock-scroll="true">
            <el-form v-if="editorShow" ref="editModalForm" :rules="editModalFormRules" :model="formData"
                label-width="130px" size="default">
                <el-form-item label="Parent Category"
                    v-if="formData.parentId !== null && formData.parentId !== undefined">
                    <el-select v-model="formData.parentId" placeholder="Select parent" style="width: 100%" disabled>
                        <el-option v-for="item in topLevelList" :key="item.id" :label="item.typeName"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Category Name" prop="typeName">
                    <el-input v-model="formData.typeName" placeholder="Enter category name" clearable />
                </el-form-item>
                <el-form-item label="Description">
                    <el-input type="textarea" :rows="3" v-model.trim="formData.typeDesc" placeholder="Enter description"
                        clearable />
                </el-form-item>
                <el-form-item label="Direction" prop="directionType">
                    <SigleSelect url="/select/directionTypeEnum" columnName="name" columnValue="code"
                        v-model="formData.directionType" />
                </el-form-item>
                <el-form-item label="Emoji Icon">
                    <el-input v-model="formData.emoji" placeholder="e.g. 🍔" clearable />
                </el-form-item>
                <el-form-item label="Color Code">
                    <el-input v-model="formData.colorCode" placeholder="e.g. #FF9800" clearable />
                </el-form-item>
                <el-form-item label="Sort Order">
                    <el-input-number style="width:100%" v-model="formData.sortOrder" :min="1" :max="999" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editorShow = false">Cancel</el-button>
                <el-button type="primary" @click="addOrEditForm()">Confirm</el-button>
            </template>
        </el-dialog>
    </div>
</template>


<script setup>
import { post } from '@/api/http';
import { useCommonStore } from "@/store";
import { Delete, Edit, Plus, Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, computed, reactive, ref } from 'vue';

const commonStore = useCommonStore();
const roleType = computed(() => commonStore.roleType);

// Search
const searchForm = reactive({});

// Form
const formData = reactive({});
const editorShow = ref(false);
const editModalForm = ref(null);
const dialogTitle = ref('Add Category');

// Data
const allItems = ref([]);
const treeData = ref([]);
const topLevelList = ref([]);
const loading = ref(false);

// Validation
const editModalFormRules = reactive({
    typeName: [{ required: true, message: 'This field is required', trigger: 'blur' }],
    directionType: [{ required: true, message: 'This field is required', trigger: 'blur' }],
});

// Build tree
const buildTree = (items) => {
    const tops = items.filter(item => !item.parentId);
    const subs = items.filter(item => item.parentId);
    return tops.map(parent => ({
        ...parent,
        children: subs.filter(child => child.parentId === parent.id)
    }));
};

// Fetch data
const fetchData = async () => {
    loading.value = true;
    try {
        const { data, success } = await post('/financeType/list', { limit: 999, isDefault: true, ...searchForm });
        if (success) {
            allItems.value = data.items || [];
            treeData.value = buildTree(allItems.value);
            topLevelList.value = allItems.value.filter(item => !item.parentId);
        }
    } finally {
        loading.value = false;
    }
};

// Reset form helper
const resetFormData = (extra = {}) => {
    Object.keys(formData).forEach(key => delete formData[key]);
    Object.assign(formData, {
        typeName: '', typeDesc: '', parentId: null, directionType: null,
        emoji: '', colorCode: '', sortOrder: 1, isDefault: true, ...extra
    });
};

// Add top-level
const showAddTopLevel = () => {
    resetFormData({ parentId: null });
    dialogTitle.value = 'Add Top Category';
    editorShow.value = true;
};

// Add child
const showAddChild = (parentId) => {
    resetFormData({ parentId });
    dialogTitle.value = 'Add Sub Category';
    editorShow.value = true;
};

// Edit
const showEditModal = async (id) => {
    const { data } = await post('/financeType/findById', { id });
    resetFormData();
    Object.assign(formData, data);
    dialogTitle.value = formData.parentId ? 'Edit Sub Category' : 'Edit Top Category';
    editorShow.value = true;
};

// Save
const addOrEditForm = async () => {
    if (!editModalForm.value) return;
    await editModalForm.value.validate(async valid => {
        if (valid) {
            formData.isDefault = true;
            const { success } = await post('/financeType/addOrEdit', formData);
            if (success) {
                editorShow.value = false;
                fetchData();
                ElMessage.success('Operation successful');
            }
        }
    });
};

// Search & Reset
const resetClick = () => {
    Object.keys(searchForm).forEach(key => { searchForm[key] = undefined; });
    fetchData();
};

// Delete
const showDeleteModal = async (id) => {
    try {
        await ElMessageBox.confirm('Are you sure you want to delete this category?', 'Warning', {
            confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning'
        });
        const { success } = await post('/financeType/deleteById', { id });
        if (success) { fetchData(); ElMessage.success('Deleted successfully'); }
    } catch { ElMessage.warning('Operation cancelled'); }
};

onMounted(() => { fetchData(); });
</script>

<style scoped lang="scss">
.box-card {
    margin-bottom: 20px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.tree-container {
    min-height: 200px;
}

.empty-tip {
    text-align: center;
    color: #999;
    padding: 60px 0;
    font-size: 14px;
}

.parent-card {
    background: #fff;
    border-radius: 8px;
    margin-bottom: 16px;
    border: 1px solid #e4e7ed;
    overflow: hidden;
}

.parent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
}

.parent-info {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}

.parent-name {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
}

.parent-actions,
.child-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
}

.cat-emoji {
    font-size: 18px;
}

.cat-color {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
}

.cat-desc {
    color: #909399;
    font-size: 12px;
    margin-left: 8px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.children-list {
    padding: 0;
}

.child-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px 10px 48px;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: #fafafa;
    }
}

.child-info {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}

.child-name {
    font-size: 14px;
    color: #606266;
}

.no-children {
    padding: 12px 20px 12px 48px;
    color: #c0c4cc;
    font-size: 13px;
    font-style: italic;
}
</style>