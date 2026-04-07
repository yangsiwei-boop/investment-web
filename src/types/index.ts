// 用户类型
export type UserType = 'investor' | 'entrepreneur' | 'admin'

export type UserStatus = 'active' | 'pending' | 'inactive' | 'banned'

export interface User {
  id: number
  phone: string
  email?: string
  userType: UserType
  realName?: string
  avatarUrl?: string
  status: UserStatus
  isVerified: boolean
  createdAt: string
  lastLoginAt?: string
  notificationCount: number
  unreadQuestionCount: number
  profileCompletionRate: number
}

// 投资人资料
export interface InvestorProfile {
  id: number
  userId: number
  avatarUrl?: string
  institutionName?: string
  position?: string
  department?: string
  workYears?: number
  institutionType?: 'vc' | 'pe' | 'angel' | 'corporate' | 'family_office' | 'other'
  investmentStage?: string[]
  investmentIndustries?: string[]
  investmentRegion?: string[]
  investmentRangeMin?: number
  investmentRangeMax?: number
  phone?: string
  wechat?: string
  introduction?: string
  investmentPhilosophy?: string
  notableInvestments?: string
  websiteUrl?: string
  linkedinUrl?: string
  investmentScore: number
  activityLevel: 'low' | 'medium' | 'high'
  responseRate?: number
  avgResponseTime?: number
  investmentCount: number
  followersCount: number
  isVerified: boolean
  verificationLevel: 'basic' | 'vip' | 'premium'
}

// 融资用户资料
export interface EntrepreneurProfile {
  id: number
  userId: number
  companyName: string
  companyLogoUrl?: string
  industry?: string
  businessLicenseNumber?: string
  legalRepresentative?: string
  registeredCapital?: number
  location?: string
  officeAddress?: string
  companyStage?: 'idea' | 'seed' | 'angel' | 'a' | 'b' | 'c' | 'd'
  foundedDate?: string
  teamSize?: number
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  businessHours?: string
  websiteUrl?: string
  socialMediaUrls?: Record<string, string>
  introduction?: string
  productDescription?: string
  targetCustomers?: string
  coreAdvantages?: string
  developmentPlans?: string
}

// 项目
export interface Project {
  id: number
  entrepreneurUserId: number
  projectName: string
  projectCode?: string
  industry?: string
  location?: string
  companyFoundedDate?: string
  officeAddress?: string
  companyWebsite?: string
  financingStage?: 'seed' | 'angel' | 'a' | 'b' | 'c' | 'd'
  financingAmount?: number
  valuation?: number
  equityPercentage?: number
  financingHistory?: string
  oneLineDescription?: string
  businessDescription?: string
  logoUrl?: string
  iconEmoji?: string
  tags?: string[]
  businessPlanFileUrl?: string
  marketSize?: string
  competitiveAdvantage?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  businessModel?: string
  revenueYtd?: number
  revenueLastYear?: number
  grossMargin?: number
  teamSize?: number
  status: 'draft' | 'published' | 'hidden' | 'archived'
  isAnonymous: boolean
  viewCount: number
  favoriteCount: number
  createdAt: string
  updatedAt: string
}

// Teaser
export interface Teaser {
  id: number
  projectId: number
  businessPlanId?: number
  title: string
  coverImageUrl?: string
  subtitle?: string
  companyName?: string
  isAnonymousCompany: boolean
  iconEmoji?: string
  aiSummary?: string
  keyMetrics?: Record<string, any>
  companyOverview?: string
  coreBusiness?: string
  teamDescription?: string
  productDescription?: string
  customerCases?: string
  investmentHighlights?: string
  riskFactors?: string
  contactPermissionRequired: boolean
  marketSize?: string
  competitiveAdvantage?: string
  financialData?: Record<string, any>
  financingPlan?: string
  tags?: string[]
  viewCount: number
  favoriteCount: number
  matchScoreAvg: number
  status: 'draft' | 'published' | 'hidden'
  aiAnalysisReady: boolean
  lastAnalyzedAt?: string
  sharingUrl?: string
  expireDate?: string
  generatedAt?: string
  createdAt: string
  updatedAt: string
}

// 商业计划书
export interface BusinessPlan {
  id: number
  projectId: number
  fileName: string
  fileUrl: string
  thumbnailUrl?: string
  fileSize?: number
  pageCount?: number
  fileFormat?: 'pdf' | 'ppt' | 'pptx'
  fileHash?: string
  uploadStatus: 'uploading' | 'completed' | 'failed'
  uploadSource: 'web' | 'api' | 'mobile'
  teaserGenerationStatus: 'pending' | 'processing' | 'completed' | 'failed'
  extractionStatus: 'pending' | 'processing' | 'completed' | 'failed'
  extractedContent?: Record<string, any>
  aiAnalysisStatus: 'pending' | 'processing' | 'completed' | 'failed'
  analysisId?: number
  teaserId?: number
  createdAt: string
  updatedAt: string
}

// 问答记录
export interface QARecord {
  id: number
  projectId: number
  investorUserId: number
  entrepreneurUserId: number
  investorName?: string
  questionTitle?: string
  question: string
  investorMessage?: string
  answer?: string
  draftAnswer?: string
  isPublic: boolean
  isFromQuestionLibrary: boolean
  questionLibraryId?: number
  allowPublic: boolean
  usePrivacySetting: boolean
  questionStatus: 'pending' | 'answered' | 'ignored'
  status: 'pending' | 'answered' | 'ignored'
  sentAt: string
  answeredAt?: string
  investorViewedAt?: string
  entrepreneurViewedAt?: string
}

// 申请
export interface Application {
  id: number
  applicationType: 'get_bp' | 'contact_company' | 'view_contact'
  investorUserId: number
  projectId: number
  entrepreneurUserId: number
  investorName?: string
  investorInstitution?: string
  investorPosition?: string
  contactInfo?: string
  applicationStatus: 'pending' | 'approved' | 'rejected' | 'cancelled'
  applicationReason?: string
  rejectionReason?: string
  adminNotes?: string
  reviewedBy?: number
  reviewedAt?: string
  expiresAt?: string
  viewedCount: number
  lastViewedAt?: string
  createdAt: string
  updatedAt: string
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
  investorUserId: number
  overallScore?: number
  overallVerdict?: 'highly_recommend' | 'recommend' | 'consider' | 'pass'
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
  marketSize?: string
  marketGrowthRate?: string
  revenueData?: Record<string, any>
  profitMargin?: string
  customerCount?: number
  customerRetentionRate?: string
  dataSource?: string
  exportFileUrl?: string
  isAiGenerated: boolean
  analysisType: 'basic' | 'deep'
  createdAt: string
  updatedAt: string
}

// 通知
export interface Notification {
  id: number
  userId: number
  notificationType: 'question_received' | 'question_answered' | 'bp_request_approved' | 'bp_request_rejected' | 'contact_request_approved' | 'contact_request_rejected' | 'verification_approved' | 'verification_rejected' | 'new_project' | 'new_teaser' | 'system_announcement' | 'ai_analysis_ready'
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
  userId: number
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
  userType: UserType
}

// 注册请求
export interface RegisterRequest {
  phone: string
  verificationCode: string
  password: string
  userType: UserType
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
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
