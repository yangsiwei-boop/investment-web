<template>
  <div class="register-page">
    <div class="register-container">
      <div class="header">
        <h1>注册账号</h1>
        <p>完成身份验证，开启投融资之旅</p>
      </div>

      <div class="role-tabs">
        <div
          v-for="role in roles"
          :key="role.value"
          class="role-tab"
          :class="{ active: form.userType === role.value }"
          @click="form.userType = role.value"
        >
          {{ role.label }}
        </div>
      </div>

      <div class="progress">
        <div class="progress-step" :class="{ active: step >= 1, completed: step > 1 }"></div>
        <div class="progress-step" :class="{ active: step >= 2, completed: step > 2 }"></div>
        <div class="progress-step" :class="{ active: step >= 3, completed: step > 3 }"></div>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <!-- 步骤1：手机号和验证码 -->
        <template v-if="step === 1">
          <el-form-item prop="phone" label="手机号">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              size="large"
              :prefix-icon="Phone"
            />
          </el-form-item>

          <el-form-item prop="verificationCode" label="验证码">
            <div class="code-input">
              <el-input
                v-model="form.verificationCode"
                placeholder="请输入验证码"
                size="large"
                maxlength="6"
              />
              <el-button
                type="primary"
                size="large"
                :disabled="countdown > 0"
                :loading="sendingCode"
                @click="sendCode"
              >
                {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
        </template>

        <!-- 步骤2：设置密码 -->
        <template v-else-if="step === 2">
          <el-form-item prop="password" label="设置密码">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请设置密码（6-20位）"
              size="large"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>

          <el-form-item prop="confirmPassword" label="确认密码">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              size="large"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
        </template>

        <!-- 步骤3：基本信息 -->
        <template v-else-if="step === 3">
          <el-form-item prop="realName" label="真实姓名">
            <el-input
              v-model="form.realName"
              placeholder="请输入真实姓名"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="email" label="邮箱">
            <el-input
              v-model="form.email"
              placeholder="请输入邮箱地址"
              size="large"
              :prefix-icon="Message"
            />
          </el-form-item>
        </template>
      </el-form>

      <div class="btn-group">
        <el-button
          v-if="step > 1"
          size="large"
          @click="prevStep"
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="nextStep"
        >
          {{ step === 3 ? '完成注册' : '下一步' }}
        </el-button>
      </div>

      <div class="login-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Phone, Lock, Message } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import * as authApi from '@/api/auth'
import type { UserType } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const step = ref(1)
const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)

const roles = [
  { label: '投资人', value: 'investor' as UserType },
  { label: '融资用户', value: 'entrepreneur' as UserType }
]

const form = reactive({
  phone: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
  realName: '',
  email: '',
  userType: 'investor' as UserType
})

const validatePass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

async function sendCode() {
  if (!form.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  try {
    sendingCode.value = true
    await authApi.sendVerificationCode({ phone: form.phone, type: 'register' })
    ElMessage.success('验证码已发送')

    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error: any) {
    ElMessage.error(error.message || '发送验证码失败')
  } finally {
    sendingCode.value = false
  }
}

async function nextStep() {
  if (!formRef.value) return

  // 获取当前步骤需要验证的字段
  const fieldsToValidate: string[] = []
  if (step.value === 1) {
    fieldsToValidate.push('phone', 'verificationCode')
  } else if (step.value === 2) {
    fieldsToValidate.push('password', 'confirmPassword')
  } else if (step.value === 3) {
    fieldsToValidate.push('realName', 'email')
  }

  try {
    await formRef.value.validateField(fieldsToValidate)

    if (step.value < 3) {
      step.value++
    } else {
      // 完成注册
      await handleRegister()
    }
  } catch {
    // 验证失败
  }
}

function prevStep() {
  if (step.value > 1) {
    step.value--
  }
}

async function handleRegister() {
  loading.value = true

  try {
    await authStore.register({
      phone: form.phone,
      verificationCode: form.verificationCode,
      password: form.password,
      userType: form.userType
    })

    ElMessage.success('注册成功')

    // 跳转到身份验证页面
    router.push({ name: 'Verify' })
  } catch (error: any) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  padding: 40px;
}

.header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    color: #667eea;
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    color: #6b7280;
    font-size: 14px;
  }
}

.role-tabs {
  display: flex;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 28px;
}

.role-tab {
  flex: 1;
  padding: 12px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.3s;

  &.active {
    background: white;
    color: #667eea;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.progress {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.progress-step {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  transition: all 0.3s;

  &.active {
    background: #667eea;
  }

  &.completed {
    background: #10b981;
  }
}

.code-input {
  display: flex;
  gap: 10px;

  .el-input {
    flex: 1;
  }

  .el-button {
    white-space: nowrap;
  }
}

.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 28px;

  .el-button {
    flex: 1;
    height: 48px;
    font-size: 15px;
    font-weight: 600;
  }
}

.login-link {
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
  font-size: 14px;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
