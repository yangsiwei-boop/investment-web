<template>
  <div class="login-page">
    <div class="login-container">
      <div class="logo">
        <h1>投融资对接平台</h1>
        <p>连接资本与机遇</p>
      </div>

      <div class="role-selector">
        <button
          v-for="role in roles"
          :key="role.value"
          class="role-btn"
          :class="{ active: form.userType === role.value }"
          @click="form.userType = role.value"
        >
          {{ role.label }}
        </button>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入手机号"
            size="large"
            :prefix-icon="Phone"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            :prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>
      </el-form>

      <div class="divider"><span>或</span></div>

      <div class="register-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Phone, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { UserType } from '@/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const roles = [
  { label: '投资人', value: 'INVESTOR' as UserType },
  { label: '融资用户', value: 'ENTREPRENEUR' as UserType }
]

const form = reactive({
  phone: '',
  password: '',
  userType: 'INVESTOR' as UserType
})

const rules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ]
}

async function handleLogin() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    await authStore.login(form.phone, form.password)

    ElMessage.success('登录成功')

    // 跳转到对应的工作台
    const redirect = route.query.redirect as string
    if (redirect) {
      router.push(redirect)
    } else if (form.userType === 'INVESTOR') {
      router.push({ name: 'InvestorHome' })
    } else {
      router.push({ name: 'EntrepreneurHome' })
    }
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 420px;
  padding: 48px 40px;
}

.logo {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    color: #667eea;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    color: #6b7280;
    font-size: 14px;
  }
}

.role-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.role-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.3s;

  &:hover {
    border-color: #667eea;
  }

  &.active {
    border-color: #667eea;
    background: #f5f3ff;
    color: #667eea;
    font-weight: 600;
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 8px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: #9ca3af;
  font-size: 14px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  span {
    padding: 0 16px;
  }
}

.register-link {
  text-align: center;
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
