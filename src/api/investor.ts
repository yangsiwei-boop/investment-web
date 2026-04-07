import { request } from '@/utils/request'
import type {
  Teaser,
  Project,
  InvestorProfile,
  InvestmentAnalysis,
  QARecord,
  Application,
  PaginatedResponse,
  ApiResponse
} from '@/types'

// 获取投资人资料
export function getInvestorProfile(): Promise<ApiResponse<InvestorProfile>> {
  return request.get('/investor/profile')
}

// 更新投资人资料
export function updateInvestorProfile(data: Partial<InvestorProfile>): Promise<ApiResponse<InvestorProfile>> {
  return request.put('/investor/profile', data)
}

// 获取工作台统计数据
export function getInvestorStats(): Promise<ApiResponse<{
  viewedTeasers: number
  favoriteCount: number
  analyzedCount: number
  pendingCount: number
}>> {
  return request.get('/investor/stats')
}

// 搜索Teaser
export function searchTeasers(params: {
  keyword?: string
  industry?: string
  stage?: string
  page?: number
  pageSize?: number
}): Promise<ApiResponse<PaginatedResponse<Teaser>>> {
  return request.get('/investor/teasers', { params })
}

// 获取推荐Teaser
export function getRecommendedTeasers(limit?: number): Promise<ApiResponse<Teaser[]>> {
  return request.get('/investor/teasers/recommended', { params: { limit } })
}

// 获取Teaser详情
export function getTeaserDetail(id: number): Promise<ApiResponse<Teaser & { project?: Project }>> {
  return request.get(`/investor/teasers/${id}`)
}

// 收藏Teaser
export function favoriteTeaser(teaserId: number): Promise<ApiResponse> {
  return request.post(`/investor/teasers/${teaserId}/favorite`)
}

// 取消收藏
export function unfavoriteTeaser(teaserId: number): Promise<ApiResponse> {
  return request.delete(`/investor/teasers/${teaserId}/favorite`)
}

// 获取收藏列表
export function getFavoriteTeasers(params: { page?: number; pageSize?: number }): Promise<ApiResponse<PaginatedResponse<Teaser>>> {
  return request.get('/investor/favorites', { params })
}

// 申请获取BP
export function applyForBP(data: {
  projectId: number
  entrepreneurUserId: number
  applicationReason: string
}): Promise<ApiResponse<Application>> {
  return request.post('/investor/applications/bp', data)
}

// 申请联系企业
export function applyForContact(data: {
  projectId: number
  entrepreneurUserId: number
  contactInfo: string
  applicationReason: string
}): Promise<ApiResponse<Application>> {
  return request.post('/investor/applications/contact', data)
}

// 获取申请列表
export function getApplications(params: {
  type?: 'get_bp' | 'contact_company' | 'view_contact'
  status?: 'pending' | 'approved' | 'rejected'
  page?: number
  pageSize?: number
}): Promise<ApiResponse<PaginatedResponse<Application>>> {
  return request.get('/investor/applications', { params })
}

// 获取BP内容
export function getBPContent(applicationId: number): Promise<ApiResponse<{
  fileUrl: string
  fileName: string
}>> {
  return request.get(`/investor/applications/${applicationId}/bp`)
}

// 获取联系方式
export function getContactInfo(applicationId: number): Promise<ApiResponse<{
  contactPerson: string
  contactPhone: string
  contactEmail: string
}>> {
  return request.get(`/investor/applications/${applicationId}/contact`)
}

// AI基础分析
export function analyzeTeaser(teaserId: number): Promise<ApiResponse<InvestmentAnalysis>> {
  return request.post(`/investor/teasers/${teaserId}/analyze`)
}

// AI深度分析
export function deepAnalyzeTeaser(teaserId: number): Promise<ApiResponse<InvestmentAnalysis>> {
  return request.post(`/investor/teasers/${teaserId}/deep-analyze`)
}

// 获取分析结果
export function getAnalysisResult(teaserId: number): Promise<ApiResponse<InvestmentAnalysis>> {
  return request.get(`/investor/teasers/${teaserId}/analysis`)
}

// 发送问题
export function sendQuestion(data: {
  projectId: number
  entrepreneurUserId: number
  question: string
  investorMessage?: string
  questionLibraryId?: number
}): Promise<ApiResponse<QARecord>> {
  return request.post('/investor/questions', data)
}

// 获取问答记录
export function getQARecords(params: {
  status?: 'pending' | 'answered' | 'ignored'
  page?: number
  pageSize?: number
}): Promise<ApiResponse<PaginatedResponse<QARecord>>> {
  return request.get('/investor/questions', { params })
}

// 获取公开问答
export function getPublicQA(teaserId: number): Promise<ApiResponse<QARecord[]>> {
  return request.get(`/investor/teasers/${teaserId}/public-qa`)
}
