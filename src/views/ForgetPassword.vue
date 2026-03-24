<template>
    <div class="forget-container">
        <div class="forget-card-wrapper">
            <!-- 顶部 Logo 区域 -->
            <div class="forget-header">
                <div class="logo-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>
                <h1 class="forget-title">Reset Password</h1>
                <p class="forget-subtitle">Please fill in the following information to reset your password</p>
            </div>

            <!-- 表单卡片 -->
            <div class="forget-card">
                <el-form ref="loginFormRef" :model="formData" :rules="rules" @keyup.enter="handleForgetPassword">
                    <div class="form-group">
                        <label class="form-label">Username</label>
                        <div class="input-wrapper">
                            <span class="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <el-form-item prop="userName">
                                <el-input v-model="formData.userName" placeholder="Enter username" />
                            </el-form-item>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <div class="input-wrapper">
                            <span class="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            </span>
                            <el-form-item prop="email">
                                <el-input v-model="formData.email" placeholder="Enter email" />
                            </el-form-item>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Phone</label>
                        <div class="input-wrapper">
                            <span class="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path
                                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </span>
                            <el-form-item prop="phoneNumber">
                                <el-input v-model="formData.phoneNumber" placeholder="Enter phone number" />
                            </el-form-item>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">New Password</label>
                        <div class="input-wrapper">
                            <span class="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <el-form-item prop="passWord">
                                <el-input v-model="formData.passWord" type="password" show-password
                                    placeholder="Enter new password" />
                            </el-form-item>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Captcha</label>
                        <div class="code-row">
                            <div class="input-wrapper code-input">
                                <span class="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                    </svg>
                                </span>
                                <el-form-item prop="code">
                                    <el-input v-model="formData.code" placeholder="Enter captcha" />
                                </el-form-item>
                            </div>
                            <div class="code-image">
                                <ValidCode ref="validCodeRef" />
                            </div>
                        </div>
                    </div>

                    <el-button type="primary" class="submit-button" :loading="loading" @click="handleForgetPassword">
                        Submit
                    </el-button>
                </el-form>
            </div>

            <!-- 底部链接 -->
            <div class="forget-footer">
                <div class="footer-links">
                    <span class="footer-text">Already have an account?</span>
                    <router-link to="/login" class="footer-link">Back to Login</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { post } from '@/api/http';
import ValidCode from '@/components/Identifyingcode/ImageCode.vue';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const loginFormRef = ref(null)
const validCodeRef = ref(null)
const loading = ref(false)

const formData = reactive({
    userName: '',
    passWord: '',
    email: '',
    phoneNumber: '',
    code: ''
})

const rules = {
    userName: [
        { required: true, message: 'Please enter username', trigger: 'blur' },
        { min: 3, max: 20, message: 'Username must be 3-20 characters', trigger: 'blur' }
    ],
    passWord: [
        { required: true, message: 'Please enter password', trigger: 'blur' },
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
    email: [
        { required: true, message: 'This field is required', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                const reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
                if (!value || !reg.test(value)) {
                    callback(new Error('Please enter a valid email'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    phoneNumber: [
        { required: true, message: 'This field is required', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                const reg = /^1[123456789]\d{9}$/
                if (!value || !reg.test(value)) {
                    callback(new Error('Please enter a valid phone number'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    code: [
        { required: true, message: 'Please enter captcha', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                const identifyCode = validCodeRef.value.getCode()
                if (value !== identifyCode) {
                    callback(new Error('Incorrect captcha'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}

const handleForgetPassword = async () => {
    if (!loginFormRef.value) return
    await loginFormRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true
            try {
                const res = await post('/sysUser/forgetPassword', formData)
                if (res.success) {
                    ElMessage.success({ message: 'Password reset successful', duration: 1500 })
                    router.push('/login')
                } else {
                    validCodeRef.value.refreshCode()
                }
            } catch (error) {
                console.error(error)
                validCodeRef.value.refreshCode()
            } finally {
                loading.value = false
            }
        } else {
            ElMessage.error({ message: 'Please complete the form', duration: 1500 })
            validCodeRef.value.refreshCode()
        }
    })
}
</script>

<style scoped lang="scss">
.forget-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #f5f5f5;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.forget-card-wrapper {
    width: 100%;
    max-width: 420px;
}

/* 顶部区域 */
.forget-header {
    text-align: center;
    margin-bottom: 32px;
}

.logo-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background-color: #0f172a;
    color: #ffffff;
    margin-bottom: 16px;
}

.forget-title {
    font-size: 24px;
    font-weight: 600;
    color: #0f172a;
    letter-spacing: -0.025em;
    margin: 0 0 8px;
}

.forget-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
}

/* 表单卡片 */
.forget-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
    margin-bottom: 8px;
}

.input-wrapper {
    position: relative;

    .input-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        z-index: 1;
        display: flex;
        align-items: center;
        pointer-events: none;
    }

    :deep(.el-form-item) {
        margin-bottom: 0;
    }

    :deep(.el-input__wrapper) {
        padding-left: 36px;
        border-radius: 12px;
        box-shadow: 0 0 0 1px #e2e8f0;
        transition: all 0.2s;

        &:hover {
            box-shadow: 0 0 0 1px #cbd5e1;
        }

        &.is-focus {
            box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
        }
    }

    :deep(.el-input__inner) {
        height: 40px;
        font-size: 14px;
    }
}

/* 验证码行 */
.code-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.code-input {
    flex: 1;
}

.code-image {
    flex-shrink: 0;
    height: 40px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
}

/* 提交按钮 */
.submit-button {
    width: 100%;
    height: 42px;
    font-size: 15px;
    font-weight: 500;
    border-radius: 12px;
    margin-top: 8px;
    background-color: #0f172a;
    border-color: #0f172a;
    transition: all 0.2s;
    letter-spacing: 0.05em;

    &:hover,
    &:focus {
        background-color: #1e293b;
        border-color: #1e293b;
    }
}

/* 底部链接 */
.forget-footer {
    margin-top: 24px;
    text-align: center;
}

.footer-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
}

.footer-text {
    color: #94a3b8;
}

.footer-link {
    color: #0f172a;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
        color: #334155;
    }
}

/* 响应式 */
@media (max-width: 480px) {
    .forget-card {
        padding: 24px;
        border-radius: 12px;
    }

    .forget-title {
        font-size: 20px;
    }
}
</style>
