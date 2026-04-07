import { request } from '@/utils/request'
import type {
  Project,
  Teaser,
  BusinessPlan,
  EntrepreneurProfile,
  QARecord,
  Application,
  PrivacySettings,
  PaginatedResponse,
  ApiResponse
} from '@/types'

// 获取融资用户资料
export function getEntrepreneurProfile(): Promise<ApiResponse<EntrepreneurProfile>> {
  return request.get('/entrepreneur/profile')
}

// 更新融资用户资料
export function updateEntrepreneurProfile(data: Partial<EntrepreneurProfile>): Promise<ApiResponse<EntrepreneurProfile>> {
  return request.put('/entrepreneur/profile', data)
}

// 获取工作台统计数据
export function getEntrepreneurStats(): Promise<ApiResponse<{
  uploadedBPCount: number
  generatedTeaserCount: number
  investorViewCount: number
  pendingInfoCount: number
}>> {
  return request.get('/entrepreneur/stats')
}

// 上传商业计划书
export function uploadBusinessPlan(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<BusinessPlan>> {
  const formData = new FormData()
  formData.append('file', file)

  return request.post('/entrepreneur/business-plans', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  })
}

// 获取商业计划书列表
export function getBusinessPlans(): Promise<ApiResponse<BusinessPlan[]>> {
  return request.get('/entrepreneur/business-plans')
}

// 获取商业计划书详情
export function getBusinessPlanDetail(id: number): Promise<ApiResponse<BusinessPlan>> {
  return request.get(`/entrepreneur/business-plans/${id}`)
}

// 删除商业计划书
export function deleteBusinessPlan(id: number): Promise<ApiResponse> {
  return request.delete(`/entrepreneur/business-plans/${id}`)
}

// 获取项目列表
export function getProjects(): Promise<ApiResponse<Project[]>> {
  return request.get('/entrepreneur/projects')
}

// 创建项目
export function createProject(data: Partial<Project>): Promise<ApiResponse<Project>> {
  return request.post('/entrepreneur/projects', data)
}

// 更新项目
export function updateProject(id: number, data: Partial<Project>): Promise<ApiResponse<Project>> {
  return request.put(`/entrepreneur/projects/${id}`, data)
}

// 获取项目详情
export function getProjectDetail(id: number): Promise<ApiResponse<Project>> {
  return request.get(`/entrepreneur/projects/${id}`)
}

// 发布项目
export function publishProject(id: number): Promise<ApiResponse> {
  return request.post(`/entrepreneur/projects/${id}/publish`)
}

// 隐藏项目
export function hideProject(id: number): Promise<ApiResponse> {
  return request.post(`/entrepreneur/projects/${id}/hide`)
}

// 获取Teaser
export function getTeaser(projectId: number): Promise<ApiResponse<Teaser>> {
  return request.get(`/entrepreneur/projects/${projectId}/teaser`)
}

// 预览Teaser
export function previewTeaser(id: number): Promise<ApiResponse<Teaser>> {
  return request.get(`/entrepreneur/teasers/${id}`)
}

// 更新Teaser
export function updateTeaser(id: number, data: Partial<Teaser>): Promise<ApiResponse<Teaser>> {
  return request.put(`/entrepreneur/teasers/${id}`, data)
}

// 获取收到的提问
export function getReceivedQuestions(params: {
  status?: 'pending' | 'answered' | 'ignored'
  page?: number
  pageSize?: number
}): Promise<ApiResponse<PaginatedResponse<QARecord>>> {
  return request.get('/entrepreneur/questions', { params })
}

// 回复问题
export function answerQuestion(questionId: number, data: {
  answer: string
  isPublic: boolean
}): Promise<ApiResponse<QARecord>> {
  return request.post(`/entrepreneur/questions/${questionId}/answer`, data)
}

// 忽略问题
export function ignoreQuestion(questionId: number): Promise<ApiResponse> {
  return request.post(`/entrepreneur/questions/${questionId}/ignore`)
}

// 获取隐私设置
export function getPrivacySettings(): Promise<ApiResponse<PrivacySettings>> {
  return request.get('/entrepreneur/privacy-settings')
}

// 更新隐私设置
export function updatePrivacySettings(data: Partial<PrivacySettings>): Promise<ApiResponse<PrivacySettings>> {
  return request.put('/entrepreneur/privacy-settings', data)
}

// 获取收到的申请
export function getReceivedApplications(params: {
  type?: 'get_bp' | 'contact_company' | 'view_contact'
  status?: 'pending' | 'approved' | 'rejected'
  page?: number
  pageSize?: number
}): Promise<ApiResponse<PaginatedResponse<Application>>> {
  return request.get('/entrepreneur/applications', { params })
}

// 审核申请
export function reviewApplication(applicationId: number, data: {
  status: 'approved' | 'rejected'
  rejectionReason?: string
}): Promise<ApiResponse<Application>> {
  return request.post(`/entrepreneur/applications/${applicationId}/review`, data)
}

// 获取项目分析数据
export function getProjectAnalytics(projectId: number): Promise<ApiResponse<{
  viewCount: number
  viewTrend: { date: string; count: number }[]
  topInvestors: { id: number; name: string; viewCount: number }[]
}>> {
  return request.get(`/entrepreneur/projects/${projectId}/analytics`)
}
