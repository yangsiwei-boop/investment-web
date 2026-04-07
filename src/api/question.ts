import { request } from '@/utils/request'
import type { ApiResponse } from '@/types'

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

// 获取问题库列表
export function getQuestionLibrary(params?: {
  category?: string
  isFrequent?: boolean
  keyword?: string
}): Promise<ApiResponse<QuestionLibraryItem[]>> {
  return request.get('/question-library', { params })
}

// 添加自定义问题
export function addCustomQuestion(data: {
  questionTitle: string
  questionDescription?: string
  category: string
  questionTags?: string
}): Promise<ApiResponse<QuestionLibraryItem>> {
  return request.post('/question-library', data)
}

// 更新问题
export function updateQuestion(id: number, data: Partial<QuestionLibraryItem>): Promise<ApiResponse<QuestionLibraryItem>> {
  return request.put(`/question-library/${id}`, data)
}

// 删除问题
export function deleteQuestion(id: number): Promise<ApiResponse> {
  return request.delete(`/question-library/${id}`)
}

// 设为常用
export function setFrequent(id: number, isFrequent: boolean): Promise<ApiResponse> {
  return request.put(`/question-library/${id}/frequent`, { isFrequent })
}

// 获取常用问题
export function getFrequentQuestions(): Promise<ApiResponse<QuestionLibraryItem[]>> {
  return request.get('/question-library/frequent')
}

// 获取模板问题
export function getTemplateQuestions(): Promise<ApiResponse<QuestionLibraryItem[]>> {
  return request.get('/question-library/templates')
}
