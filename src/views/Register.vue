<template>
    <div class="register-container">
        <div class="register-box">
            <div class="register-left">
                <img class="register-image" src="@/assets/loginbg.png" alt="注册背景图">
            </div>
            <div class="register-right">
                <div class="register-form-container">
                    <h2 class="register-title">Registration</h2>
                    <el-form ref="registerForm" :model="formData" label-width="90px" label-position="top" :rules="rules"
                        class="register-form">
                        <el-form-item label="Username" prop="userName">
                            <el-input v-model="formData.userName" placeholder="Enter username" />
                        </el-form-item>

                        <el-form-item label="Password" prop="passWord">
                            <el-input v-model="formData.passWord" type="password" show-password
                                placeholder="Enter password" />
                        </el-form-item>

                        <el-form-item label="Email" prop="email">
                            <el-input v-model="formData.email" placeholder="Enter email" />
                        </el-form-item>

                        <el-form-item label="Phone" prop="phoneNumber">
                            <el-input v-model="formData.phoneNumber" placeholder="Enter phone number" />
                        </el-form-item>

                        <el-form-item label="Name" prop="nickName">
                            <el-input v-model="formData.nickName" placeholder="Enter name" />
                        </el-form-item>

                        <el-form-item label="Captcha" prop="code">
                            <div class="code-container">
                                <el-input v-model="formData.code" placeholder="Enter captcha" />
                                <div class="code-image">
                                    <ValidCode ref="validCodeRef" />
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" class="register-button" @click="registerBtn">
                                Register
                            </el-button>
                        </el-form-item>
                    </el-form>

                    <div class="register-options">
                        <div class="login-link">
                            <span>Already have an account?</span>
                            <router-link :to="{ path: '/login' }">
                                <span class="link-text">Sign In</span>
                            </router-link>
                        </div>
                        <div class="forget-link">
                            <router-link :to="{ path: '/forgetPassword' }">
                                <span class="link-text">Forgot Password</span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { post } from '@/api/http';
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ValidCode from '../components/Identifyingcode/ImageCode.vue'

// 路由
const router = useRouter()

// 表单引用
const registerForm = ref(null)
const validCodeRef = ref(null)

// 表单数据
const formData = reactive({
    userName: '',
    passWord: '',
    phoneNumber: '',
    roleType: '2',
    email: '',
    nickName: '',
    code: ''
})

// 表单校验规则
const rules = reactive({
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
        { required: true, message: 'Please enter email', trigger: 'blur' },
        {
            type: 'email',
            message: 'Please enter a valid email format',
            trigger: 'blur'
        },
        {
            validator: (rule, value, callback) => {
                const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                if (!emailRegex.test(value)) {
                    callback(new Error('Invalid email format'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    nickName: [
        { required: true, message: 'Please enter name', trigger: 'blur' },
        { min: 2, max: 20, message: 'Name must be 2-20 characters', trigger: 'blur' }
    ],
    phoneNumber: [
        { required: true, message: 'Please enter phone number', trigger: 'blur' },
        { min: 11, max: 11, message: 'Phone number must be 11 digits', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                const phoneRegex = /^1[0-9]\d{9}$/
                if (!phoneRegex.test(value)) {
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
})

// 注册按钮点击事件
const registerBtn = () => {
    registerForm.value.validate(async (valid) => {
        if (valid) {
            try {
                const { success } = await post('/sysUser/register', formData)
                if (success) {
                    ElMessage.success('Registration successful!')
                    router.push({
                        path: '/login'
                    })
                }
            } catch (error) {
                console.error('Registration failed', error)
                validCodeRef.value.refreshCode()
            }
        } else {
            ElMessage.error('Registration validation failed')
            validCodeRef.value.refreshCode()
            return false
        }
    })
}
</script>

<style scoped lang="scss">
/* 注册页面容器 */
.register-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 注册框 */
.register-box {
    display: flex;
    width: 1200px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

/* 左侧图片区域 */
.register-left {
    flex: 1.8;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;
    overflow: hidden;
    position: relative;
}

.register-image {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* 右侧表单区域 */
.register-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
}

.register-form-container {
    width: 100%;
}

/* 注册标题 */
.register-title {
    font-size: 24px;
    color: #303133;
    margin-bottom: 30px;
    text-align: center;
    font-weight: 600;
}

/* 注册表单 */
.register-form {
    margin-top: 20px;
}

/* 验证码容器 */
.code-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.code-image {
    flex-shrink: 0;
}

/* 注册按钮 */
.register-button {
    width: 100%;
    height: 40px;
    font-size: 16px;
    margin-top: 10px;
}

/* 注册选项区域 */
.register-options {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    font-size: 14px;
    color: #606266;
}

/* 链接文本 */
.link-text {
    color: #409EFF;
    margin-left: 5px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: #66b1ff;
    }
}

/* 响应式调整 */
@media (max-width: 992px) {
    .register-box {
        width: 90%;
        height: auto;
        flex-direction: column;
    }

    .register-left {
        display: none;
    }

    .register-right {
        padding: 20px;
    }
}
</style>
