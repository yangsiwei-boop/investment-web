// 用户类型
export type UserType = 'INVESTOR' | 'ENTREPRENEUR' | 'ADMIN'

export type UserStatus = 'active' | 'pending' | 'inactive' | 'banned'

export interface User {
  id: number
  phone: string
  email?: string
  nickname?: string
  userType: UserType
  realName?: string
  avatarUrl?: string
  status: UserStatus
  isVerified: boolean
  bio?: string
  lastLoginAt?: string
  createdAt: string
}

// 投资人资料
export interface InvestorProfile {
  id: number
  avatarUrl?: string
  institutionName?: string
  position?: string
  interestedIndustries?: string[]
  interestedStages?: string[]
  minInvestmentAmount?: number
  maxInvestmentAmount?: number
  interestedRegions?: string[]
  investmentPhilosophy?: string
  investmentCases?: string
  verificationStatus?: 'pending' | 'approved' | 'rejected'
  completeness?: number
  updatedAt?: string
}

// 融资用户资料
export interface EntrepreneurProfile {
  id: number
  companyLogoUrl?: string
  companyName: string
  industry?: string
  financingStage?: string
  location?: string
  companySize?: string
  companyIntroduction?: string
  coreBusiness?: string
  targetFinancingAmount?: number
  website?: string
  contactPhone?: string
  contactEmail?: string
  verificationStatus?: 'pending' | 'approved' | 'rejected'
  completeness?: number
  updatedAt?: string
}

// 项目
export interface Project {
  id: number
  name: string
  summary?: string
  industry?: string
  financingStage?: string
  financingAmount?: number
  financingPurpose?: string
  location?: string
  businessDescription?: string
  businessModel?: string
  targetMarket?: string
  competitiveAdvantage?: string
  status: 'draft' | 'published' | 'hidden' | 'archived'
  hasBp?: boolean
  hasTeaser?: boolean
  // 以下字段前端表单使用，后端可能不返回
  projectName?: string
  oneLineDescription?: string
  companyFoundedDate?: string
  officeAddress?: string
  companyWebsite?: string
  teamSize?: number
  equityPercentage?: number
  financingHistory?: string
  marketSize?: string
  revenueYtd?: number
  revenueLastYear?: number
  grossMargin?: number
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  isAnonymous?: boolean
  iconEmoji?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

// Teaser
export interface Teaser {
  id: number
  projectId: number
  projectName?: string
  title: string
  summary?: string
  iconEmoji?: string
  industry?: string
  financingStage?: string
  financingAmount?: number
  financingPurpose?: string
  location?: string
  highlights?: string[]
  businessModel?: string
  targetMarket?: string
  competitiveAdvantage?: string
  teamIntroduction?: string
  status: 'draft' | 'published' | 'hidden'
  viewCount: number
  favoriteCount: number
  matchScore?: number
  isFavorite?: boolean
  tags?: string[]
  createdAt: string
  publishedAt?: string
  // 前端兼容旧字段
  subtitle?: string
  companyOverview?: string
  coreBusiness?: string
  investmentHighlights?: string
  marketSize?: string
  financialData?: Record<string, any>
  financingPlan?: string
}

// 商业计划书
export interface BusinessPlan {
  id: number
  projectId: number
  fileName: string
  fileUrl: string
  fileSize?: number
  fileFormat?: string
  teaserGenerationStatus?: 'pending' | 'processing' | 'completed' | 'failed'
  teaserId?: number
  createdAt: string
  updatedAt: string
}

// 问答记录
export interface QARecord {
  id: number
  teaserId: number
  teaserTitle?: string
  projectName?: string
  questionerId?: number
  questionerName?: string
  question: string
  category?: string
  answer?: string
  answererId?: number
  answererName?: string
  status: 'pending' | 'answered' | 'ignored'
  isPublic: boolean
  questionedAt?: string
  answeredAt?: string
  createdAt: string
  // 前端兼容旧字段
  projectId?: number
  investorName?: string
  investorMessage?: string
  questionTitle?: string
  questionStatus?: 'pending' | 'answered' | 'ignored'
  sentAt?: string
}

// 申请
export interface Application {
  id: number
  teaserId: number
  teaserTitle?: string
  projectName?: string
  applicantId?: number
  applicantName?: string
  applicationType: 'get_bp' | 'contact_company' | 'view_contact'
  reason?: string
  institutionName?: string
  position?: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  reviewComment?: string
  reviewerId?: number
  reviewedAt?: string
  createdAt: string
}

// 问题库问题
export interface QuestionLibraryItem {
  id: number
  questionTitle: string
  questionDescription?: string
  category: 'business_model' | 'product_technology' | 'market_expansion' | 'financial_data' | 'team' | 'other'
  questionTags?: string
  isFrequent: boolean
  isTemplate: boolean
  usageCount: number
  lastUsedAt?: string
  sortOrder: number
  createdAt: string
}

// 投资分析
export interface InvestmentAnalysis {
  id: number
  teaserId: number
  analysisType?: string
  overallScore?: number
  overallVerdict?: string
  industryAnalysisScore?: number
  industryAnalysisText?: string
  teamAnalysisScore?: number
  teamAnalysisText?: string
  technologyAnalysisScore?: number
  technologyAnalysisText?: string
  competitivenessAnalysisScore?: number
  competitivenessAnalysisText?: string
  financialHealthScore?: number
  financialHealthText?: string
  investmentValueScore?: number
  investmentValueText?: string
  investmentHighlights?: string
  riskWarnings?: string
  investmentSuggestion?: string
  createdAt: string
  updatedAt: string
  // 前端兼容旧字段
  dataSource?: string
}

// 通知
export interface Notification {
  id: number
  type: string
  title: string
  content?: string
  relatedId?: number
  relatedType?: string
  isRead: boolean
  createdAt: string
}

// 隐私设置
export interface PrivacySettings {
  id: number
  allowShowCompanyName: boolean
  allowShowFoundedTime: boolean
  allowShowCompanyScale: boolean
  allowShowOfficeAddress: boolean
  allowShowContactInfo: boolean
  allowShowFinancialData: boolean
  allowShowFinancingHistory: boolean
  allowShowFounderDetails: boolean
  allowShowTeamInfo: boolean
  allowPublicQa: boolean
  defaultQaPublic: boolean
  questionLibraryQaPublic: boolean
  requireBpApproval: boolean
  requireContactApproval: boolean
  allowViewQaRecords: boolean
  allowReceiveQuestions: boolean
  autoReplyTemplate?: string
  createdAt: string
  updatedAt: string
}

// 登录请求
export interface LoginRequest {
  phone: string
  password: string
  loginType?: 'PASSWORD' | 'SMS_CODE'
}

// 登录响应
export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

// 注册请求
export interface RegisterRequest {
  phone: string
  code: string
  password: string
  userType: UserType
  agreedToTerms?: boolean
}

// 注册响应
export interface RegisterResponse {
  userId: number
  token: string
  refreshToken: string
  userType: UserType
  expiresAt: number
}

// 发送验证码请求
export interface SendCodeRequest {
  phone: string
  type: 'register' | 'login' | 'reset_password'
}

// API响应
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: string
}

// 分页响应（Spring Data标准格式）
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  numberOfElements: number
}

// Dashboard统计
export interface DashboardStats {
  viewedCount?: number
  favoriteCount: number
  analyzedCount: number
  pendingCount: number
}

// 推荐Teaser
export interface RecommendedTeaser {
  id: number
  title: string
  summary: string
  iconEmoji?: string
  industry: string
  financingStage: string
  matchScore: number
  viewCount: number
  favoriteCount: number
  isFavorite: boolean
  tags?: string[]
  createdAt: string
}

// 最近活动
export interface RecentActivity {
  type: string
  teaserId: number
  teaserTitle: string
  description: string
  timestamp: string
}

// 收藏
export interface Favorite {
  id: number
  teaserId: number
  teaserTitle: string
  teaserSummary?: string
  iconEmoji?: string
  industry?: string
  financingStage?: string
  financingAmount?: number
  groupName?: string
  note?: string
  tags?: string[]
  createdAt: string
}

// 文件上传响应
export interface FileUploadResponse {
  fileName: string
  filePath: string
  fileUrl: string
  fileSize: number
  fileType: string
}
