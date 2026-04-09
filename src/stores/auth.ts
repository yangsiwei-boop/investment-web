import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserType, InvestorProfile, EntrepreneurProfile } from '@/types'
import * as authApi from '@/api/auth'
import * as investorApi from '@/api/investor'
import * as entrepreneurApi from '@/api/entrepreneur'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const user = ref<User | null>(null)
  const investorProfile = ref<InvestorProfile | null>(null)
  const entrepreneurProfile = ref<EntrepreneurProfile | null>(null)
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userType = computed(() => user.value?.userType)
  const isInvestor = computed(() => user.value?.userType === 'INVESTOR')
  const isEntrepreneur = computed(() => user.value?.userType === 'ENTREPRENEUR')
  const isAdmin = computed(() => user.value?.userType === 'ADMIN')
  const isVerified = computed(() => user.value?.isVerified)

  // 登录
  async function login(phone: string, password: string, loginType: 'PASSWORD' | 'SMS_CODE' = 'PASSWORD') {
    loading.value = true
    try {
      const res = await authApi.login({ phone, password, loginType })
      const { token: newToken, refreshToken: newRefreshToken, user: userData } = res.data
      token.value = newToken
      refreshToken.value = newRefreshToken
      user.value = userData
      localStorage.setItem('token', newToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      // 加载用户资料
      await loadProfile()

      return res
    } finally {
      loading.value = false
    }
  }

  // 注册
  async function register(data: { phone: string; code: string; password: string; userType: UserType }) {
    loading.value = true
    try {
      const res = await authApi.register(data)
      const { token: newToken, refreshToken: newRefreshToken } = res.data
      token.value = newToken
      refreshToken.value = newRefreshToken
      localStorage.setItem('token', newToken)
      localStorage.setItem('refreshToken', newRefreshToken)
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
      if (user.value.userType === 'INVESTOR') {
        const res = await investorApi.getInvestorProfile()
        investorProfile.value = res.data
      } else if (user.value.userType === 'ENTREPRENEUR') {
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
      logout()
      throw error
    } finally {
      loading.value = false
    }
  }

  // 退出登录
  function logout() {
    // 尝试调用后端登出接口
    if (token.value) {
      authApi.logout().catch(() => {})
    }
    token.value = null
    refreshToken.value = null
    user.value = null
    investorProfile.value = null
    entrepreneurProfile.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  // 更新用户资料
  async function updateProfile(data: { nickname?: string; email?: string; avatarUrl?: string; bio?: string }) {
    const res = await authApi.updateUserProfile(data)
    if (res.data) {
      user.value = { ...user.value!, ...res.data }
    }
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
    refreshToken,
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
