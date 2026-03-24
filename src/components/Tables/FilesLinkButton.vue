<template>
    <!-- File view button and dialog -->
    <span class="file-link-container">
        <el-button type="primary" link @click="showImport">
            <el-icon>
                <Document />
            </el-icon>
            View Files
        </el-button>

        <el-dialog v-model="show" title="View Files" width="70%" :lock-scroll="true" class="file-dialog"
            :before-close="handleClose" :z-index="9999" append-to-body destroy-on-close>
            <el-table :data="files" style="width: 100%">
                <!-- File name column -->
                <el-table-column prop="name" label="File Name" align="center">
                    <template #default="{ row }">
                        <el-tag>{{ row.name }}</el-tag>
                    </template>
                </el-table-column>

                <!-- File type column -->
                <el-table-column prop="type" label="File Type" align="center">
                    <template #default="{ row }">
                        <el-tag type="success">{{ row.type }}</el-tag>
                    </template>
                </el-table-column>

                <!-- Actions column -->
                <el-table-column label="Actions" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="handleDownload(row)">
                            <el-icon>
                                <Download />
                            </el-icon>
                            Download
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </span>
</template>

<script setup>
import { Document, Download } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref, watch } from 'vue';

// Define props
const props = defineProps({
    url: {
        type: String,
        default: ''
    }
})

// Reactive data
const show = ref(false)
const files = ref([])

// Parse URL string to file array
const parseUrls = window.parseUrls

// Watch url changes
watch(() => props.url, (newUrl) => {
    files.value = parseUrls(newUrl)
}, { immediate: true })

// Show file view dialog
const showImport = () => {
    if (!props.url) {
        ElMessage.warning('Please upload resources first!')
        return
    }
    show.value = true
}

// Close dialog
const handleClose = () => {
    show.value = false
}

// Handle file download
const handleDownload = (file) => {
    window.open(file.url, '_blank')
}
</script>

<style scoped>
/* File link container */
.file-link-container {
    margin: 0 10px;
}

/* File view dialog */
.file-dialog {
    height: 800px;
}

/* Table tag style */
:deep(.el-tag) {
    margin: 2px;
}

/* Ensure dialog is on top */
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
</style>