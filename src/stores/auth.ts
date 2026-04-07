import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserType, InvestorProfile, EntrepreneurProfile } from '@/types'
import * as authApi from '@/api/auth'
import * as investorApi from '@/api/investor'
import * as entrepreneurApi from '@/api/entrepreneur'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const investorProfile = ref<InvestorProfile | null>(null)
  const entrepreneurProfile = ref<EntrepreneurProfile | null>(null)
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userType = computed(() => user.value?.userType)
  const isInvestor = computed(() => user.value?.userType === 'investor')
  const isEntrepreneur = computed(() => user.value?.userType === 'entrepreneur')
  const isAdmin = computed(() => user.value?.userType === 'admin')
  const isVerified = computed(() => user.value?.isVerified)

  // 登录
  async function login(phone: string, password: string, userType: UserType) {
    loading.value = true
    try {
      const res = await authApi.login({ phone, password, userType })
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', res.data.token)

      // 加载用户资料
      await loadProfile()

      return res
    } finally {
      loading.value = false
    }
  }

  // 注册
  async function register(data: { phone: string; verificationCode: string; password: string; userType: UserType }) {
    loading.value = true
    try {
      const res = await authApi.register(data)
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', res.data.token)
      return res
    } finally {
      loading.value = false
    }
  }

  // 发送验证码
  async function sendCode(phone: string, type: 'register' | 'login' | 'reset_password') {
    return authApi.sendVerificationCode({ phone, type })
  }

  // 加载用户资料
  async function loadProfile() {
    if (!user.value) return

    try {
      if (user.value.userType === 'investor') {
        const res = await investorApi.getInvestorProfile()
        investorProfile.value = res.data
      } else if (user.value.userType === 'entrepreneur') {
        const res = await entrepreneurApi.getEntrepreneurProfile()
        entrepreneurProfile.value = res.data
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  // 获取当前用户信息
  async function fetchCurrentUser() {
    if (!token.value) return

    loading.value = true
    try {
      const res = await authApi.getCurrentUser()
      user.value = res.data
      await loadProfile()
    } catch (error) {
      // token无效，清除登录状态
      logout()
      throw error
    } finally {
      loading.value = false
    }
  }

  // 退出登录
  function logout() {
    token.value = null
    user.value = null
    investorProfile.value = null
    entrepreneurProfile.value = null
    localStorage.removeItem('token')
  }

  // 更新用户信息
  async function updateProfile(data: Partial<User>) {
    const res = await authApi.updateUserProfile(data)
    user.value = res.data
    return res
  }

  // 初始化 - 检查是否有保存的token
  async function init() {
    if (token.value) {
      try {
        await fetchCurrentUser()
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }
  }

  return {
    // 状态
    token,
    user,
    investorProfile,
    entrepreneurProfile,
    loading,
    // 计算属性
    isAuthenticated,
    userType,
    isInvestor,
    isEntrepreneur,
    isAdmin,
    isVerified,
    // 方法
    login,
    register,
    sendCode,
    logout,
    fetchCurrentUser,
    loadProfile,
    updateProfile,
    init
  }
})
