<template>
    <div>
        <div id="aiEditor" :style="{ height: height }"></div>
    </div>
</template>

<script setup>
import { AiEditor } from "aieditor";
import "aieditor/dist/style.css";
import { nextTick, onMounted, ref, watch } from 'vue';

import { postUpload } from '@/api/http';
// Define props
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    height: {
        type: String,
        default: '300px'
    }
})

// Define emit
const emit = defineEmits(['update:modelValue'])

// Reactive data
const uploadUrl = import.meta.env.VITE_API_BASE_URL + "/File/batchUpload"
const fileList = ref([])
let editor = null

// Initialize editor
const initEditor = () => {
    editor = new AiEditor({
        element: "#aiEditor",
        placeholder: "Click to enter content...",
        theme: "light",
        content: props.modelValue,
        contentIsMarkdown: false,
        contentRetention: false,
        contentRetentionKey: 'ai-editor-content',
        draggable: true,
        pasteAsText: false,
        image: {
            uploadUrl: uploadUrl,
            uploader: async (file, uploadUrl, headers, formName) => {
                const formData = new FormData()
                formData.append('file', file)

                let { success, data } = await postUpload(uploadUrl, formData)

                return {
                    "errorCode": 0,
                    "data": {
                        "src": data[0].url,
                        "alt": data[0].fileName,
                        "align": "center",
                        "width": "100%",
                        "height": "auto",
                        "class": "image-class",
                        "loading": true,
                        "data-src": data[0].url
                    }
                }
            },
        },
        onChange: (aiEditor) => {
            emit('update:modelValue', aiEditor.getHtml())
        },
        ai: {
            models: {
                spark: {
                    appId: "2e9be894",
                    apiKey: "69b882dc87fb511d0b32198636617d57",
                    apiSecret: "NWE5OTJmZmM1MjAxYjViYTQ4OTdjMzg0",
                    version: "v1.1"
                }
            }
        }
    })
}

// Initialize editor after mount
onMounted(() => {
    nextTick(() => {
        initEditor()
    })
})

// Watch modelValue changes
watch(() => props.modelValue, (newValue) => {
    if (editor && newValue !== editor.getHtml()) {
        editor.setContent(newValue)
    }
})
</script>

<style scoped>
/* Editor container */
#aiEditor {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}
</style>