import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification } from '@/types'
import * as notificationApi from '@/api/notification'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)
  const serverUnreadCount = ref(0)

  // 获取通知列表
  async function fetchNotifications(page: number = 1, size: number = 20) {
    try {
      const res = await notificationApi.getNotifications({ page, size })
      if (res.data) {
        notifications.value = res.data.content ?? []
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  // 获取未读数量
  async function fetchUnreadCount() {
    try {
      const res = await notificationApi.getUnreadCount()
      if (res.data !== undefined) {
        serverUnreadCount.value = res.data
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  // 标记已读
  async function markAsRead(id: number) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
    try {
      await notificationApi.markAsRead(id)
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  // 全部标记已读
  async function markAllAsRead() {
    notifications.value.forEach(n => n.isRead = true)
    try {
      await notificationApi.markAllAsRead()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  // 删除通知
  async function removeNotification(id: number) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
    try {
      await notificationApi.deleteNotification(id)
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  // 清空所有通知
  async function clearAll() {
    notifications.value = []
    try {
      await notificationApi.clearAllNotifications()
    } catch (error) {
      console.error('Failed to clear notifications:', error)
    }
  }

  // 添加本地通知（用于即时显示）
  function addNotification(notification: Notification) {
    notifications.value.unshift(notification)
  }

  return {
    notifications,
    unreadCount,
    serverUnreadCount,
    fetchNotifications,
    fetchUnreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  }
})
