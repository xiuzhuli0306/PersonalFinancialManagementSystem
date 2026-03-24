<template>
    <el-select style="width: 100%" :disabled="disabled" v-model="selectValue" multiple allow-create
        placeholder="Please select" :filterable="true" :loading="loading" :clearable="true" :remote="true"
        @change="handleChange">
        <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
        </el-option>
    </el-select>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { post } from '@/api/http';
// Define props
const props = defineProps({
    modelValue: {
        type: [Number, String],
        default: ''
    },
    url: {
        type: String, // Default request URL
        default: ""
    },
    columnName: { // Default column property
        type: String, // Default request URL
        default: ""
    },
    where: {
        type: Object,
        default: () => ({})
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

// Define emit
const emit = defineEmits(['update:modelValue'])

// Reactive data
const loading = ref(false)
const options = ref([])
const selectValue = ref([])
const where_ = ref({})

// Watch modelValue changes
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal?.toString()?.length > 0) {
            selectValue.value = newVal.toString().split(",")
        } else {
            selectValue.value = []
        }
    },
    { immediate: true }
)

// Fetch data list
const fetchDataList = async () => {
    if (props.url) {
        loading.value = true
        try {
            const { data: { items } } = await post(props.url, {
                ...where_.value
            })

            const dataList = items.map(item => ({
                name: item[props.columnName]
            }))

            options.value = dataList
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            loading.value = false
        }
    }
}

// Initialize data
const initData = () => {
    where_.value = {}
}

// Reload data
const reload = async (where) => {
    if (where) {
        where_.value = { ...where }
    }
    await fetchDataList()
}

// Handle selection change
const handleChange = (value) => {
    if (Array.isArray(value) && value.length > 0) {
        emit('update:modelValue', value.join(","))
    } else {
        emit('update:modelValue', '')
    }
}

// Initialize on mount
onMounted(() => {
    where_.value = props.where
    fetchDataList()
})

// Expose methods to parent
defineExpose({
    initData,
    reload,
    fetchDataList
})
</script>

<style scoped lang="scss"></style>
