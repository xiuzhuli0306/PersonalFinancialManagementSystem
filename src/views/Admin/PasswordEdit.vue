<template>
    <div>

        <el-card class="margin-top-sm">
            <template #header>
                <div class="clearfix">
                    <h2>Change Password</h2>
                </div>
            </template>
            <div>
                <el-form ref="editModalForm" :model="formData" label-width="80px" size="default" :rules="rules">
                    <el-form-item label="Current Password" prop="orginPassword">
                        <el-input type="password" v-model.trim="formData.orginPassword"
                            placeholder="Enter current password" show-password></el-input>
                    </el-form-item>

                    <el-form-item label="New Password" prop="newPassword">
                        <el-input type="password" v-model.trim="formData.newPassword" placeholder="Enter new password"
                            show-password></el-input>
                    </el-form-item>

                    <el-form-item label="Confirm" prop="passWord">
                        <el-input type="password" v-model.trim="formData.passWord" placeholder="Re-enter new password"
                            show-password></el-input>
                    </el-form-item>
                </el-form>
                <div class="button-container">
                    <el-button type="primary" size="default" @click="addOrEdit">Confirm</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { post } from '@/api/http';
import { useCommonStore } from "@/store"
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

// Get store and router instances
const commonStore = useCommonStore()
const router = useRouter()

// Form data
const formData = reactive({})
formData.id = commonStore.userId

// Form validation rules
const rules = {
    orginPassword: [
        { required: true, message: 'This field is required', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: 'This field is required', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {

                var reg = /^.{8,16}$/;
                if (!value || !reg.test(value)) {
                    callback(new Error('Password must be 8-16 characters'));
                } else {
                    callback();
                }
            }, trigger: 'blur'
        },
    ],
    passWord: [
        { required: true, message: 'This field is required', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {

                var reg = /^.{8,16}$/;
                if (!value || !reg.test(value)) {
                    callback(new Error('Password must be 8-16 characters'));
                } else {
                    callback();
                }
            }, trigger: 'blur'
        },
    ]
}

// Form reference
const editModalForm = ref(null)

// Submit form
const addOrEdit = async () => {
    if (!editModalForm.value) return

    await editModalForm.value.validate(async (valid) => {
        if (valid) {
            // Check if new password and confirm password match
            if (formData.newPassword !== formData.passWord) {
                ElMessage.error("New password and confirm password do not match")
                return false
            }
            const { success } = await post("/sysUser/changePassword", formData)
            if (success) {
                ElMessage.success("Password changed successfully!")
                await commonStore.logout()
                router.push("/login")
            }
        } else {

            return false
        }
    })
}
</script>

<style scoped lang="scss">
/* Card style */
.margin-top-sm {
    margin-top: 20px;
}

/* Clearfix */
.clearfix::after {
    content: '';
    display: table;
    clear: both;
}

/* Button container */
.button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
</style>
