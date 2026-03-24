<template>
    <div class="upload-files-wrap">
        <el-upload :action="uploadUrl" list-type="text" :show-file-list="true" :on-success="handleUploadSuccess"
            :on-remove="handleRemove" :file-list="fileList" :limit="limit" :multiple="true" :accept="accept">
            <el-button size="small" type="primary">Upload</el-button>
            <div slot="tip" class="el-upload__tip">Please upload resource files<span
                    style="padding-left:10px;color:rgb(237, 95, 24)"><span v-if="accept">
                        Max upload size 1GB, supported formats: {{ accept }}</span></span>
            </div>
        </el-upload>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { post } from '@/api/http';
// Define props
const props = defineProps({
    modelValue: {
        type: [Number, String],
        default: ''
    },
    limit: {
        type: Number,
        default: 1,
    },
    accept: {
        type: String,
        default: ''
    }
});

// Define emit
const emit = defineEmits(['update:modelValue']);

// Reactive data
const uploadUrl = import.meta.env.VITE_API_BASE_URL + "/File/batchUpload";
const fileList = ref([]);

// Watch modelValue changes
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        fileList.value = newVal.split(",").map(x => {
            return {
                url: x,
                name: getFileNameByPath(x),
                status: "success"
            }
        });
    }
}, { immediate: true });

// File list conversion
const FileListConvert = (files) => {
    let list = [];
    if (Array.isArray(files)) {
        files.filter(x => x.status == "success").forEach((item) => {
            if (item.response != null) {
                list = [...list, { name: "", url: item.response.data[0].url }];
            } else {
                list = [...list, item];
            }
        });
    }
    return list;
};

// Handle upload success
const handleUploadSuccess = (response, file, fileList) => {
    let fs = FileListConvert(fileList);
    let url = fs.length > 0 ? fs.map(x => x.url).join(",") : "";
    emit('update:modelValue', url);
};

// Handle file removal
const handleRemove = (file, fileList) => {
    let fs = FileListConvert(fileList);
    let url = fs.length > 0 ? fs.map(x => x.url).join(",") : "";
    emit('update:modelValue', url);
};
</script>

<style scoped>
/* Upload component container */
.upload-files-wrap {
    width: 100%;
}

.el-upload__tip {
    margin-left: 10px;
}
</style>