<template>
    <div class="login-container">
        <div class="login-card-wrapper">
            <!-- 顶部 Logo 区域 -->
            <div class="login-header">
                <div class="logo-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                    </svg>
                </div>
                <h1 class="login-title">Personal Finance Management</h1>
                <p class="login-subtitle">Welcome back, please sign in to your account</p>
            </div>

            <!-- 表单卡片 -->
            <div class="login-card">
                <el-form ref="loginForm" :model="formData" :rules="rules" @keyup.enter="loginBtn">
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
                        <label class="form-label">Password</label>
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
                                    placeholder="Enter password" />
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
                                <ImageCode ref="validCodeRef" />
                            </div>
                        </div>
                    </div>

                    <el-button type="primary" class="login-button" :loading="loading" @click="loginBtn">
                        Sign In
                    </el-button>
                </el-form>
            </div>

            <!-- 底部链接 -->
            <div class="login-footer">
                <div class="footer-links">

                    <router-link to="/forgetPassword" class="footer-link">Forgot Password</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import ImageCode from '@/components/Identifyingcode/ImageCode.vue'
import { useCommonStore } from '@/store'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const commonStore = useCommonStore()
const loginForm = ref(null)
const validCodeRef = ref(null)
const loading = ref(false)

const formData = reactive({
    userName: '',
    passWord: '',
    code: ''
})

const rules = reactive({
    userName: [
        { required: true, message: 'Please enter username', trigger: 'blur' },
        { min: 3, max: 20, message: 'Username must be 3-20 characters', trigger: 'blur' }
    ],
    passWord: [
        { required: true, message: 'Please enter password', trigger: 'blur' },
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
})

const loginBtn = () => {
    loginForm.value.validate(async (valid) => {
        if (valid) {
            loading.value = true
            try {
                const { success } = await commonStore.login(formData)
                if (success) {
                    ElMessage.success({ message: 'Login successful', duration: 1500 })
                    router.push({ path: '/admin' })
                }
            } catch (error) {
                console.error('Login failed', error)
            } finally {
                loading.value = false
            }
        } else {
            ElMessage.error({ message: 'Please complete login information', duration: 1500 })
            return false
        }
    })
}
</script>

<style scoped lang="scss">
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #f5f5f5;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.login-card-wrapper {
    width: 100%;
    max-width: 420px;
}

/* 顶部 Logo 区域 */
.login-header {
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

.login-title {
    font-size: 24px;
    font-weight: 600;
    color: #0f172a;
    letter-spacing: -0.025em;
    margin: 0 0 8px;
}

.login-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
}

/* 表单卡片 */
.login-card {
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

    :deep(.el-select) {
        width: 100%;

        .el-select__wrapper {
            padding-left: 36px;
            border-radius: 12px;
            box-shadow: 0 0 0 1px #e2e8f0;
            min-height: 40px;
            transition: all 0.2s;

            &:hover {
                box-shadow: 0 0 0 1px #cbd5e1;
            }

            &.is-focus {
                box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
            }
        }
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

/* 登录按钮 */
.login-button {
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
.login-footer {
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

.footer-divider {
    color: #e2e8f0;
}

/* 响应式 */
@media (max-width: 480px) {
    .login-card {
        padding: 24px;
        border-radius: 12px;
    }

    .login-title {
        font-size: 20px;
    }
}
</style>
