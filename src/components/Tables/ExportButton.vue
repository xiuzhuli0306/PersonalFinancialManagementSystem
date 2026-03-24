<template>
    <el-button class="margin-left-xs" type="success" size="mini" @click="handleExport">
        <el-icon>
            <Download />
        </el-icon>Export
    </el-button>
</template>

<script setup>
import { Download } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// Define props
const props = defineProps({
    exportUrl: {
        type: String,
        required: true
    },
    where: {
        type: Object,
        default: () => ({})
    }
});

// Handle export
const handleExport = () => {
    try {

        const query = JSON.stringify(props.where)
        // Build full export URL
        const exportUrl = `${import.meta.env.VITE_API_BASE_URL}${props.exportUrl}?query=${query}`;

        // Create hidden download link
        const link = document.createElement('a');
        link.href = exportUrl;
        link.download = '';
        link.style.display = 'none';

        // Append to DOM and trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);

        ElMessage.success('Export successful');
    } catch (error) {
        console.error('Export failed:', error);
        ElMessage.error('Export failed');
    }
};
</script>

<style scoped></style>
