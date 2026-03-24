<template>
    <div>
        <el-card>
            <div slot="header" class="clearfix">
                <h2>Edit Account Information</h2>
            </div>
            <div class="margin-top-sm">
                <el-form ref="editModalForm" v-if="editShow" :model="formData" size="default" label-width="80px"
                    :rules="rules">
                    <el-form-item label="Account" prop="userName">
                        <el-input v-model="formData.userName" clearable :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="Email" prop="email">
                        <el-input v-model="formData.email" clearable> </el-input>
                    </el-form-item>
                    <el-form-item label="Name" prop="nickName">
                        <el-input v-model="formData.nickName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="Phone" prop="phoneNumber">
                        <el-input v-model="formData.phoneNumber" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="Avatar" prop="imageUrls">
                        <UploadImages v-model="formData.imageUrls"></UploadImages>
                    </el-form-item>



                    <el-form-item>
                        <el-button type="primary" size="default" @click="addOrEdit">Confirm</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { post } from '@/api/http';
import { useCommonStore } from "@/store";
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

// Get store
const commonStore = useCommonStore()

// Form visibility
const editShow = ref(false)

// Form data
const formData = reactive({})

// Form reference
const editModalForm = ref(null)

// Form validation rules
const rules = {
    userName: [
        { required: true, message: 'Please enter account', trigger: 'blur' },
        { min: 3, max: 20, message: 'Account must be 3-20 characters', trigger: 'blur' }
    ],
    email: [
        { required: true, message: 'Please enter email', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                var reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
                if (!value || !reg.test(value)) {
                    callback(new Error('Please enter a valid email'));
                }
                else {
                    callback();
                }
            }, trigger: 'blur'
        },
    ],
    nickName: [
        { required: true, message: 'Please enter name', trigger: 'blur' },
    ],
    phoneNumber: [
        { required: true, message: 'Please enter phone number', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                var reg = /^1[123456789]\d{9}$/;
                if (!value || !reg.test(value)) {
                    callback(new Error('Please enter a valid phone number'));
                }
                else {
                    callback();
                }
            }, trigger: 'blur'
        },
    ],


}

// Get account info
const showEditModal = async () => {
    const { data } = await post("/sysUser/findById", { id: commonStore.userId })
    Object.assign(formData, data)
    editShow.value = true
}

// Create or edit
const addOrEdit = async () => {
    if (!editModalForm.value) return

    await editModalForm.value.validate(async valid => {
        if (valid) {
            const { success } = await post("/sysUser/addOrEdit", formData)
            if (success) {
                ElMessage.success("Updated successfully!")
                commonStore.getInfo()
            }
        }
    })
}

// Load data on mount
onMounted(() => {
    showEditModal()
})
</script>

<style scoped lang="scss"></style>
