import { request } from '@/utils/request'
import type { Notification, PaginatedResponse, ApiResponse } from '@/types'

// 获取通知列表
export function getNotifications(params: {
  page?: number
  size?: number
}): Promise<ApiResponse<PaginatedResponse<Notification>>> {
  return request.get('/notifications', { params })
}

// 获取未读通知
export function getUnreadNotifications(): Promise<ApiResponse<Notification[]>> {
  return request.get('/notifications/unread')
}

// 获取未读数量
export function getUnreadCount(): Promise<ApiResponse<number>> {
  return request.get('/notifications/unread/count')
}

// 标记已读
export function markAsRead(notificationId: number): Promise<ApiResponse> {
  return request.put(`/notifications/${notificationId}/read`)
}

// 全部标记已读
export function markAllAsRead(): Promise<ApiResponse> {
  return request.put('/notifications/read-all')
}

// 删除通知
export function deleteNotification(notificationId: number): Promise<ApiResponse> {
  return request.delete(`/notifications/${notificationId}`)
}

// 清空所有通知
export function clearAllNotifications(): Promise<ApiResponse> {
  return request.delete('/notifications/clear')
}
