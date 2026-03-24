<template>
    <el-input-tag v-model="tagValue" clearable :placeholder="placeholder" @change="handleChange" />
</template>

<script setup>
import { ref, watch } from 'vue';

// Define props
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: 'Please enter'
    },


})

// Define emit
const emit = defineEmits(['update:modelValue', 'change'])

// Reactive data
const tagValue = ref([])

// Convert comma-separated string to array
const stringToArray = (str) => {
    if (!str) return [];
    return str.split(',').filter(item => item.trim() !== '').map(item => item.trim());
}

// Convert array to comma-separated string
const arrayToString = (arr) => {
    if (!arr || arr.length === 0) return '';
    return arr.join(',');
}

// Watch modelValue changes
watch(
    () => props.modelValue,
    (newVal) => {
        // Receive string value and convert to array for internal use
        tagValue.value = stringToArray(newVal);
    },
    { immediate: true }
)

// Handle tag value change
const handleChange = (value) => {
    // Convert array value to comma-separated string
    const stringValue = arrayToString(value);
    emit('update:modelValue', stringValue);
    emit('change', stringValue);
}
</script>

<style scoped>
/* Tag input style */
</style>
