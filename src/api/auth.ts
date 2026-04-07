import { request } from '@/utils/request'
import type {
  User,
  LoginRequest,
  RegisterRequest,
  SendCodeRequest,
  ApiResponse
} from '@/types'

// 发送验证码
export function sendVerificationCode(data: SendCodeRequest): Promise<ApiResponse> {
  return request.post('/auth/send-code', data)
}

// 登录
export function login(data: LoginRequest): Promise<ApiResponse<{ token: string; user: User }>> {
  return request.post('/auth/login', data)
}

// 注册
export function register(data: RegisterRequest): Promise<ApiResponse<{ token: string; user: User }>> {
  return request.post('/auth/register', data)
}

// 获取当前用户信息
export function getCurrentUser(): Promise<ApiResponse<User>> {
  return request.get('/auth/me')
}

// 更新用户信息
export function updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
  return request.put('/auth/profile', data)
}

// 修改密码
export function changePassword(data: { oldPassword: string; newPassword: string }): Promise<ApiResponse> {
  return request.post('/auth/change-password', data)
}

// 退出登录
export function logout(): Promise<ApiResponse> {
  return request.post('/auth/logout')
}

// 上传身份验证文件
export function uploadVerificationFile(file: File, type: 'id_card_front' | 'id_card_back' | 'business_license' | 'business_card'): Promise<ApiResponse<{ url: string }>> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  return request.post('/auth/upload-verification', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 提交身份验证
export function submitVerification(data: {
  realName: string
  idCardNumber: string
  idCardFrontUrl: string
  idCardBackUrl: string
  businessLicenseUrl?: string
  businessCardUrl?: string
  companyName?: string
  position?: string
  contactPhone?: string
  contactEmail?: string
}): Promise<ApiResponse> {
  return request.post('/auth/verify', data)
}

// 获取验证状态
export function getVerificationStatus(): Promise<ApiResponse<{
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted'
  rejectReason?: string
}>> {
  return request.get('/auth/verification-status')
}
