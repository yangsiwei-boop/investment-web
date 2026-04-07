<template>
  <div class="notification-panel">
    <div class="panel-header">
      <span class="title">通知</span>
      <el-button type="primary" link size="small" @click="markAllAsRead" v-if="unreadCount > 0">
        全部已读
      </el-button>
    </div>

    <div class="notification-list" v-if="notifications.length > 0">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
        :class="{ unread: !notification.isRead }"
        @click="handleClick(notification)"
      >
        <div class="notification-icon">
          {{ getNotificationIcon(notification.notificationType) }}
        </div>
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-desc" v-if="notification.content">{{ notification.content }}</div>
          <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">📭</div>
      <div class="empty-text">暂无通知</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import type { Notification } from '@/types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const router = useRouter()
const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

function getNotificationIcon(type: Notification['notificationType']): string {
  const iconMap: Record<string, string> = {
    question_received: '❓',
    question_answered: '💬',
    bp_request_approved: '✅',
    bp_request_rejected: '❌',
    contact_request_approved: '🤝',
    contact_request_rejected: '🚫',
    verification_approved: '🎉',
    verification_rejected: '⚠️',
    new_project: '📄',
    new_teaser: '📊',
    system_announcement: '📢',
    ai_analysis_ready: '🤖'
  }
  return iconMap[type] || '🔔'
}

function formatTime(time: string): string {
  return dayjs(time).fromNow()
}

function handleClick(notification: Notification) {
  notificationStore.markAsRead(notification.id)

  // 根据通知类型跳转到相应页面
  if (notification.relatedType === 'teaser' && notification.relatedId) {
    router.push({ name: 'TeaserDetail', params: { id: notification.relatedId } })
  } else if (notification.relatedType === 'question' && notification.relatedId) {
    router.push({ name: 'InvestorQA' })
  }
}

function markAllAsRead() {
  notificationStore.markAllAsRead()
}
</script>

<style scoped lang="scss">
.notification-panel {
  max-height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }
}

.notification-list {
  flex: 1;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #f9fafb;
  }

  &.unread {
    background: #f0f9ff;
  }
}

.notification-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-desc {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  font-size: 12px;
  color: #9ca3af;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 14px;
    color: #6b7280;
  }
}
</style>
