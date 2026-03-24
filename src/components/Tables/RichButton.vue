<template>
    <!-- Rich text button component -->
    <div class="rich-button">
        <!-- Click button -->
        <el-button type="primary" link @click="showDialog">
            <el-icon>
                <View />
            </el-icon>
            View Details
        </el-button>

        <!-- Rich text content dialog -->
        <el-dialog v-model="dialogVisible" title="Content" width="50%" :lock-scroll="true" :before-close="handleClose"
            :z-index="9999" append-to-body destroy-on-close>
            <!-- Rich text content display area -->
            <div class="rich-content" v-html="content"></div>
        </el-dialog>
    </div>
</template>

<script setup>
import { View } from '@element-plus/icons-vue';
import { ref } from 'vue';

// Define component props
const props = defineProps({
    content: {
        type: String,
        default: ''
    }
})

// Dialog visibility state
const dialogVisible = ref(false)

// Show dialog
const showDialog = () => {
    dialogVisible.value = true
}

// 关闭弹窗
const handleClose = () => {
    dialogVisible.value = false
}
</script>

<style scoped>
/* 富文本按钮容器 */
.rich-button {
    display: inline-block;
    position: relative;
}

/* 富文本内容样式 */
.rich-content {
    max-height: 500px;
    overflow-y: auto;
    padding: 10px;
    line-height: 1.5;
}

/* 确保弹窗在最上层 */
:deep(.el-dialog) {
    position: relative;
    z-index: 9999;
}

:deep(.el-dialog__wrapper) {
    z-index: 9999;
}

:deep(.v-modal) {
    z-index: 9998;
}

/* 富文本内容中的图片样式 */
.rich-content img {
    max-width: 100%;
    height: auto;
}

/* 富文本内容中的表格样式 */
.rich-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
}

.rich-content th,
.rich-content td {
    border: 1px solid #dcdfe6;
    padding: 8px;
}

/* 富文本内容中的链接样式 */
.rich-content a {
    color: #409eff;
    text-decoration: none;
}

.rich-content a:hover {
    text-decoration: underline;
}
</style>