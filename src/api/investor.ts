import { request } from '@/utils/request'
import type {
  Teaser,
  InvestorProfile,
  InvestmentAnalysis,
  QARecord,
  Application,
  Favorite,
  PaginatedResponse,
  ApiResponse,
  DashboardStats,
  RecommendedTeaser,
  RecentActivity
} from '@/types'

// ========== 用户资料 ==========

// 获取投资人资料
export function getInvestorProfile(): Promise<ApiResponse<InvestorProfile>> {
  return request.get('/profile/investor', { headers: { _silent: true } } as any)
}

// 更新投资人资料
export function updateInvestorProfile(data: Partial<InvestorProfile>): Promise<ApiResponse<InvestorProfile>> {
  return request.put('/profile/investor', data)
}

// ========== 投资人工作台 ==========

// 获取Dashboard
export function getInvestorDashboard(): Promise<ApiResponse<{
  stats: DashboardStats
  recommendedTeasers: RecommendedTeaser[]
  recentActivities: RecentActivity[]
}>> {
  return request.get('/investor/dashboard')
}

// 获取统计数据
export function getInvestorStats(): Promise<ApiResponse<DashboardStats>> {
  return request.get('/investor/dashboard/stats')
}

// 获取推荐项目
export function getRecommendedProjects(limit?: number): Promise<ApiResponse<RecommendedTeaser[]>> {
  return request.get('/investor/dashboard/recommended', { params: { limit } })
}

// 获取最近活动
export function getRecentActivities(limit?: number): Promise<ApiResponse<RecentActivity[]>> {
  return request.get('/investor/dashboard/activities', { params: { limit } })
}

// ========== Teaser浏览与搜索 ==========

// 获取Teaser列表
export function getTeaserList(params: {
  page?: number
  size?: number
}): Promise<ApiResponse<PaginatedResponse<Teaser>>> {
  return request.get('/investor/teasers', { params })
}

// 搜索Teaser
export function searchTeasers(data: {
  keyword?: string
  industries?: string[]
  financingStages?: string[]
  minFinancingAmount?: number
  maxFinancingAmount?: number
  region?: string
  sortBy?: 'created_at' | 'view_count' | 'match_score'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}): Promise<ApiResponse<PaginatedResponse<Teaser>>> {
  return request.post('/investor/teasers/search', data)
}

// 获取Teaser详情
export function getTeaserDetail(teaserId: number): Promise<ApiResponse<Teaser>> {
  return request.get(`/investor/teasers/${teaserId}`)
}

// 获取推荐Teaser
export function getRecommendedTeasers(): Promise<ApiResponse<Teaser[]>> {
  return request.get('/investor/teasers/recommended')
}

// 获取热门Teaser
export function getHotTeasers(): Promise<ApiResponse<Teaser[]>> {
  return request.get('/investor/teasers/hot')
}

// ========== 投资人收藏 ==========

// 获取收藏列表
export function getFavoriteList(params: {
  page?: number
  size?: number
}): Promise<ApiResponse<PaginatedResponse<Favorite>>> {
  return request.get('/investor/favorites', { params })
}

// 添加收藏
export function addFavorite(data: {
  teaserId: number
  groupName?: string
  note?: string
}): Promise<ApiResponse<Favorite>> {
  return request.post('/investor/favorites', data)
}

// 取消收藏
export function removeFavorite(teaserId: number): Promise<ApiResponse> {
  return request.delete(`/investor/favorites/${teaserId}`)
}

// 检查是否已收藏
export function checkFavorite(teaserId: number): Promise<ApiResponse<boolean>> {
  return request.get(`/investor/favorites/check/${teaserId}`)
}

// 更新收藏分组
export function updateFavoriteGroup(teaserId: number, data: {
  groupName: string
}): Promise<ApiResponse> {
  return request.put(`/investor/favorites/${teaserId}/group`, data)
}

// 获取收藏分组列表
export function getFavoriteGroups(): Promise<ApiResponse<string[]>> {
  return request.get('/investor/favorites/groups')
}

// ========== 投资分析 ==========

// 获取分析列表
export function getAnalysisList(params: {
  page?: number
  size?: number
}): Promise<ApiResponse<PaginatedResponse<InvestmentAnalysis>>> {
  return request.get('/investor/analysis', { params })
}

// 创建投资分析
export function createAnalysis(data: {
  teaserId: number
  analysisType?: string
  deepAnalysis?: boolean
  customDimensions?: string
}): Promise<ApiResponse<InvestmentAnalysis>> {
  return request.post('/investor/analysis', data)
}

// 获取分析详情
export function getAnalysisDetail(analysisId: number): Promise<ApiResponse<InvestmentAnalysis>> {
  return request.get(`/investor/analysis/${analysisId}`)
}

// 获取某个Teaser的分析
export function getTeaserAnalysis(teaserId: number): Promise<ApiResponse<InvestmentAnalysis>> {
  return request.get(`/investor/analysis/teaser/${teaserId}`)
}

// 重新分析
export function reanalyze(analysisId: number): Promise<ApiResponse<InvestmentAnalysis>> {
  return request.post(`/investor/analysis/${analysisId}/reanalyze`)
}

// 删除分析
export function deleteAnalysis(analysisId: number): Promise<ApiResponse> {
  return request.delete(`/investor/analysis/${analysisId}`)
}

// ========== 投资人问答 ==========

// 获取问答列表
export function getQAList(params: {
  page?: number
  size?: number
}): Promise<ApiResponse<PaginatedResponse<QARecord>>> {
  return request.get('/investor/qa', { params })
}

// 发送问题
export function sendQuestion(data: {
  teaserId: number
  question: string
  isPublic?: boolean
  category?: string
}): Promise<ApiResponse<QARecord>> {
  return request.post('/investor/qa', data)
}

// 获取问题详情
export function getQADetail(qaId: number): Promise<ApiResponse<QARecord>> {
  return request.get(`/investor/qa/${qaId}`)
}

// 追问/追加消息
export function replyToQA(qaId: number, data: {
  content: string
  isPublic?: boolean
}): Promise<ApiResponse<QARecord>> {
  return request.post(`/investor/qa/${qaId}/reply`, data)
}

// ========== 投资人申请 ==========

// 获取申请列表
export function getApplications(params: {
  status?: string
  page?: number
  size?: number
}): Promise<ApiResponse<PaginatedResponse<Application>>> {
  return request.get('/investor/applications', { params })
}

// 创建申请
export function createApplication(data: {
  teaserId: number
  applicationType: 'get_bp' | 'contact_company' | 'view_contact'
  reason?: string
  institutionName?: string
  position?: string
}): Promise<ApiResponse<Application>> {
  return request.post('/investor/applications', data)
}

// 获取申请详情
export function getApplicationDetail(applicationId: number): Promise<ApiResponse<Application>> {
  return request.get(`/investor/applications/${applicationId}`)
}
