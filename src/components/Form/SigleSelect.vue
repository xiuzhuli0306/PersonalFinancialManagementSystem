<template>
    <el-select style="width: 100%;min-width: 155px;" :disabled="disabled" v-model="selectValue" filterable
        placeholder="Please select" :filterable="true" :loading="loading" :clearable="true" :remote="true"
        @change="handleChange">
        <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 14px">{{ item.label }}</span>
        </el-option>
    </el-select>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { post } from '@/api/http';
// Define props
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    url: {
        type: String,
        default: ''
    },
    columnName: {
        type: String,
        default: ''
    },
    columnValue: {
        type: String,
        default: ''
    },
    columnLabel: {
        type: String,
        default: ''
    },
    where: {
        type: Object,
        default: () => ({})
    },
    filterValue: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

// Define emit
const emit = defineEmits(['update:modelValue', 'change'])

// Reactive data
const loading = ref(false)
const options = ref([])
const selectValue = ref('')
const where_ = ref({})
const searchWhere = ref({})

// Watch modelValue changes
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal && newVal.toString().length > 0) {
            selectValue.value = newVal.toString()
        } else {
            selectValue.value = newVal
        }
    },
    { immediate: true }
)

// Fetch data list
const fetchDataList = async (searchWhere = {}) => {
    loading.value = true
    try {
        const { data: { items } } = await post(props.url, {
            limit: 999,
            ...where_.value,
            ...searchWhere
        })
        let filterValue = props.filterValue.map(x => x.toString())

        const dataList = items.filter(item =>
            !filterValue.includes(item[props.columnValue]?.toString())
        ).map(item => ({
            name: item[props.columnName],
            value: item[props.columnValue]?.toString(),
            label: item[props.columnLabel]?.toString(),
            orginRItem: item
        }))


        if (filterValue.some(x => x.toString() === selectValue.value?.toString())) {
            selectValue.value = ''
        }

        options.value = dataList
    } catch (error) {
        console.error('Failed to fetch data:', error)
    } finally {
        loading.value = false
    }
}

// Reload data
const Reload = async (where) => {
    const newSearchWhere = where ? { ...where } : {}
    searchWhere.value = newSearchWhere
    await fetchDataList(newSearchWhere)
}

// Handle selection change
const handleChange = (value) => {
    emit('update:modelValue', value)
    const selectedItem = options.value.find(x => x.value === value)
    if (selectedItem) {
        emit('change', { Value: value, SelectItem: selectedItem.orginRItem })
    }
}

// Initialize on mount
onMounted(() => {
    if (props.modelValue && props.modelValue.toString().length > 0) {
        selectValue.value = props.modelValue.toString()
    }
    where_.value = props.where
    fetchDataList()
})
// Expose methods to parent
defineExpose({
    Reload,

})
</script>

<style scoped></style>
