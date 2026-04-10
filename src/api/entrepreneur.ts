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

// ========== 用户资料 ==========

// 获取融资用户资料
export function getEntrepreneurProfile(): Promise<ApiResponse<EntrepreneurProfile>> {
  return request.get('/profile/entrepreneur', { headers: { _silent: true } } as any)
}

// 更新融资用户资料
export function updateEntrepreneurProfile(data: Partial<EntrepreneurProfile>): Promise<ApiResponse<EntrepreneurProfile>> {
  return request.put('/profile/entrepreneur', data)
}

// ========== 融资方Dashboard ==========

// 获取Dashboard
export function getEntrepreneurDashboard(): Promise<ApiResponse<any>> {
  return request.get('/entrepreneur/dashboard')
}

// ========== 融资方项目管理 ==========

// 获取项目列表
export function getProjects(params: {
  page?: number
  size?: number
}): Promise<ApiResponse<PaginatedResponse<Project>>> {
  return request.get('/entrepreneur/projects', { params })
}

// 创建项目
export function createProject(data: Partial<Project>): Promise<ApiResponse<Project>> {
  return request.post('/entrepreneur/projects', data)
}

// 获取项目详情
export function getProjectDetail(projectId: number): Promise<ApiResponse<Project>> {
  return request.get(`/entrepreneur/projects/${projectId}`)
}

// 更新项目
export function updateProject(projectId: number, data: Partial<Project>): Promise<ApiResponse<Project>> {
  return request.put(`/entrepreneur/projects/${projectId}`, data)
}

// 删除项目
export function deleteProject(projectId: number): Promise<ApiResponse> {
  return request.delete(`/entrepreneur/projects/${projectId}`)
}

// ========== 融资方Teaser管理 ==========

// 获取Teaser列表
export function getTeaserList(params: {
  page?: number
  size?: number
}): Promise<ApiResponse<PaginatedResponse<Teaser>>> {
  return request.get('/entrepreneur/teasers', { params })
}

// 创建Teaser
export function createTeaser(data: {
  projectId: number
  title: string
  summary: string
  iconEmoji?: string
  highlights?: string[]
  businessModel?: string
  targetMarket?: string
  competitiveAdvantage?: string
  teamIntroduction?: string
  autoGenerate?: boolean
}): Promise<ApiResponse<Teaser>> {
  return request.post('/entrepreneur/teasers', data)
}

// 获取Teaser详情
export function getTeaserDetail(teaserId: number): Promise<ApiResponse<Teaser>> {
  return request.get(`/entrepreneur/teasers/${teaserId}`)
}

// 更新Teaser
export function updateTeaser(teaserId: number, data: Partial<Teaser>): Promise<ApiResponse<Teaser>> {
  return request.put(`/entrepreneur/teasers/${teaserId}`, data)
}

// 发布Teaser
export function publishTeaser(teaserId: number): Promise<ApiResponse> {
  return request.post(`/entrepreneur/teasers/${teaserId}/publish`)
}

// 下架Teaser
export function unpublishTeaser(teaserId: number): Promise<ApiResponse> {
  return request.post(`/entrepreneur/teasers/${teaserId}/unpublish`)
}

// 自动生成Teaser
export function autoGenerateTeaser(projectId: number): Promise<ApiResponse<Teaser>> {
  return request.post(`/entrepreneur/teasers/auto-generate/${projectId}`)
}

// 删除Teaser
export function deleteTeaser(teaserId: number): Promise<ApiResponse> {
  return request.delete(`/entrepreneur/teasers/${teaserId}`)
}

// ========== 融资方商业计划书 ==========

// 获取项目的BP列表
export function getBusinessPlans(projectId: number): Promise<ApiResponse<BusinessPlan[]>> {
  return request.get(`/entrepreneur/bp/project/${projectId}`)
}

// 上传BP
export function uploadBusinessPlan(projectId: number, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<BusinessPlan>> {
  const formData = new FormData()
  formData.append('file', file)

  return request.post(`/entrepreneur/bp/upload/${projectId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  })
}

// 获取BP详情
export function getBusinessPlanDetail(bpId: number): Promise<ApiResponse<BusinessPlan>> {
  return request.get(`/entrepreneur/bp/${bpId}`)
}

// 删除BP
export function deleteBusinessPlan(bpId: number): Promise<ApiResponse> {
  return request.delete(`/entrepreneur/bp/${bpId}`)
}

// ========== 融资方问答 ==========

// 获取收到的问题列表
export function getReceivedQuestions(params: {
  status?: string
  page?: number
  size?: number
}): Promise<ApiResponse<PaginatedResponse<QARecord>>> {
  return request.get('/entrepreneur/qa', { params })
}

// 获取问题详情
export function getQuestionDetail(qaId: number): Promise<ApiResponse<QARecord>> {
  return request.get(`/entrepreneur/qa/${qaId}`)
}

// 回答问题
export function answerQuestion(qaId: number, data: {
  answer: string
  isPublic?: boolean
}): Promise<ApiResponse<QARecord>> {
  return request.post(`/entrepreneur/qa/${qaId}/answer`, data)
}

// ========== 隐私设置 ==========

// 获取隐私设置
export function getPrivacySettings(): Promise<ApiResponse<PrivacySettings>> {
  return request.get('/profile/privacy')
}

// 更新隐私设置
export function updatePrivacySettings(data: Partial<PrivacySettings>): Promise<ApiResponse<PrivacySettings>> {
  return request.put('/profile/privacy', data)
}

// ========== 融资方申请管理 ==========

// 获取收到的申请列表
export function getReceivedApplications(params: {
  status?: string
  page?: number
  size?: number
}): Promise<ApiResponse<PaginatedResponse<Application>>> {
  return request.get('/entrepreneur/applications', { params })
}

// 获取申请详情
export function getApplicationDetail(applicationId: number): Promise<ApiResponse<Application>> {
  return request.get(`/entrepreneur/applications/${applicationId}`)
}

// 审核申请（参数通过URL查询参数传递）
export function reviewApplication(applicationId: number, approved: boolean, comment?: string): Promise<ApiResponse<Application>> {
  return request.post(`/entrepreneur/applications/${applicationId}/review`, null, {
    params: { approved, comment }
  })
}
