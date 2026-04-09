import { request } from '@/utils/request'
import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SendCodeRequest,
  ApiResponse
} from '@/types'

// 发送验证码
export function sendVerificationCode(data: SendCodeRequest): Promise<ApiResponse> {
  return request.post('/auth/send-code', data)
}

// 登录
export function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  return request.post('/auth/login', data)
}

// 注册
export function register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
  return request.post('/auth/register', data)
}

// 刷新Token
export function refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; expiresAt: number }>> {
  return request.post('/auth/refresh', { refreshToken })
}

// 获取当前用户资料
export function getCurrentUser(): Promise<ApiResponse<User>> {
  return request.get('/profile')
}

// 更新用户资料
export function updateUserProfile(data: {
  nickname?: string
  email?: string
  avatarUrl?: string
  bio?: string
}): Promise<ApiResponse<User>> {
  return request.put('/profile', data)
}

// 修改密码
export function changePassword(data: { oldPassword: string; newPassword: string }): Promise<ApiResponse> {
  return request.post('/auth/password/change', data)
}

// 退出登录
export function logout(): Promise<ApiResponse> {
  return request.post('/auth/logout')
}

// 提交实名认证
export function submitVerification(data: {
  realName: string
  idCardNumber: string
  idCardFrontUrl: string
  idCardBackUrl: string
  verificationType?: 'investor' | 'entrepreneur'
  businessLicenseUrl?: string
  companyName?: string
}): Promise<ApiResponse<number>> {
  return request.post('/profile/verification', data)
}

// 获取认证状态
export function getVerificationStatus(): Promise<ApiResponse<string>> {
  return request.get('/profile/verification/status')
}

// 上传图片
export function uploadImage(file: File, dir?: string): Promise<ApiResponse<{
  fileName: string
  filePath: string
  fileUrl: string
  fileSize: number
  fileType: string
}>> {
  const formData = new FormData()
  formData.append('file', file)
  if (dir) {
    formData.append('dir', dir)
  }
  return request.post('/common/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 上传文档
export function uploadDocument(file: File, dir?: string): Promise<ApiResponse<{
  fileName: string
  filePath: string
  fileUrl: string
  fileSize: number
  fileType: string
}>> {
  const formData = new FormData()
  formData.append('file', file)
  if (dir) {
    formData.append('dir', dir)
  }
  return request.post('/common/upload/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 上传头像
export function uploadAvatar(file: File): Promise<ApiResponse<{
  fileName: string
  filePath: string
  fileUrl: string
  fileSize: number
  fileType: string
}>> {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/common/upload/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
