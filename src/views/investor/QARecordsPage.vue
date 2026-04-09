<template>
  <div class="qa-records-page">
    <div class="back-btn" @click="router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>

    <div class="page-header">
      <h1>问答记录</h1>
      <p>查看您发送的问题和收到的回复</p>
    </div>

    <div class="filter-bar">
      <el-radio-group v-model="statusFilter" @change="loadQARecords">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="PENDING">待回复</el-radio-button>
        <el-radio-button value="ANSWERED">已回复</el-radio-button>
        <el-radio-button value="IGNORED">已忽略</el-radio-button>
      </el-radio-group>
    </div>

    <div class="qa-list" v-if="qaRecords.length > 0">
      <div v-for="record in qaRecords" :key="record.id" class="qa-item">
        <div class="qa-header">
          <div class="project-info">
            <span class="project-name">{{ record.teaserTitle || record.projectName || getProjectName(record.projectId) }}</span>
            <span class="qa-time">{{ formatDate(record.questionedAt || record.sentAt || record.createdAt) }}</span>
          </div>
          <el-tag :type="getStatusType(record.status || record.questionStatus)" size="small">
            {{ getStatusLabel(record.status || record.questionStatus) }}
          </el-tag>
        </div>

        <div class="qa-content">
          <div class="question">
            <div class="label">
              <el-icon><QuestionFilled /></el-icon>
              我的问题
            </div>
            <div class="text">{{ record.question }}</div>
            <div class="message" v-if="record.investorMessage">
              <span class="message-label">附言：</span>{{ record.investorMessage }}
            </div>
          </div>

          <div class="answer" v-if="record.answer">
            <div class="label">
              <el-icon><ChatDotRound /></el-icon>
              企业回复
              <span class="answer-time" v-if="record.answeredAt">
                {{ formatDate(record.answeredAt) }}
              </span>
            </div>
            <div class="text">{{ record.answer }}</div>
            <div class="public-tag" v-if="record.isPublic">
              <el-tag type="success" size="small">公开问答</el-tag>
            </div>
          </div>
        </div>

        <!-- Conversation thread with multi-round replies -->
        <div class="conversation-thread" v-if="record.replies && record.replies.length > 0">
          <div
            v-for="reply in record.replies"
            :key="reply.id"
            class="reply-bubble"
            :class="reply.userType === 'INVESTOR' ? 'own' : 'other'"
          >
            <div class="reply-header">
              <span class="reply-name">{{ reply.userName }}</span>
              <span class="reply-time">{{ formatDate(reply.createdAt) }}</span>
            </div>
            <div class="reply-content">{{ reply.content }}</div>
          </div>
        </div>

        <!-- Inline follow-up input -->
        <div class="follow-up-input">
          <el-input
            v-model="followUpTexts[record.id] || ''"
            placeholder="输入追问内容..."
            size="small"
            @keyup.enter="sendFollowUp(record)"
          >
            <template #append>
              <el-button @click="sendFollowUp(record)" :loading="sendingFollowUp === record.id">
                发送
              </el-button>
            </template>
          </el-input>
        </div>

        <div class="qa-actions">
          <el-button size="small" @click="viewProject(record.projectId || record.teaserId)">查看项目</el-button>
          <el-button size="small" v-if="record.answer && record.isPublic" @click="viewPublicQA(record)">
            查看公开问答
          </el-button>
        </div>
      </div>
    </div>

    <EmptyState
      v-else-if="!loading"
      icon="❓"
      title="暂无问答记录"
      description="去浏览项目并向企业提问吧"
      action-text="浏览项目"
      @action="router.push({ name: 'InvestorSearch' })"
    />

    <div class="pagination" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="loadQARecords"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, QuestionFilled, ChatDotRound } from '@element-plus/icons-vue'
import EmptyState from '@/components/common/EmptyState.vue'
import * as investorApi from '@/api/investor'
import type { QARecord } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()

const qaRecords = ref<QARecord[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 10
const total = ref(0)
const statusFilter = ref('')

// Multi-round conversation state
const followUpTexts = ref<Record<number, string>>({})
const sendingFollowUp = ref<number | null>(null)

const projectNames: Record<number, string> = {}

function formatDate(date: string | undefined) {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''
}

function getStatusType(status: string | undefined): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'ANSWERED':
      return 'success'
    case 'IGNORED':
      return 'info'
    default:
      return 'info'
  }
}

function getStatusLabel(status: string | undefined) {
  switch (status) {
    case 'PENDING':
      return '待回复'
    case 'ANSWERED':
      return '已回复'
    case 'IGNORED':
      return '已忽略'
    default:
      return status || ''
  }
}

function getProjectName(projectId: number | undefined): string {
  return (projectId && projectNames[projectId]) || `项目`
}

function viewProject(projectId: number | undefined) {
  if (projectId) {
    router.push({ name: 'TeaserDetail', params: { id: projectId } })
  }
}

function viewPublicQA(record: QARecord) {
  router.push({ name: 'PublicQA', params: { id: record.id } })
}

async function sendFollowUp(record: QARecord) {
  const text = followUpTexts.value[record.id]?.trim()
  if (!text) return
  sendingFollowUp.value = record.id
  try {
    await investorApi.replyToQA(record.id, { content: text, isPublic: true })
    ElMessage.success('追问已发送')
    followUpTexts.value[record.id] = ''
    loadQARecords()
  } catch (error: any) {
    ElMessage.error(error.message || '发送失败')
  } finally {
    sendingFollowUp.value = null
  }
}

async function loadQARecords() {
  loading.value = true
  try {
    const res = await investorApi.getQAList({
      page: currentPage.value,
      size: pageSize
    })
    qaRecords.value = res.data.content ?? []
    total.value = res.data.totalElements ?? 0
  } catch (error) {
    console.error('Failed to load QA records:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadQARecords()
})
</script>

<style scoped lang="scss">
.qa-records-page {
  padding-bottom: 40px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.3s;
  margin-bottom: 24px;
  width: fit-content;

  &:hover {
    background: #f3f4f6;
  }
}

.page-header {
  margin-bottom: 24px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
  }

  p {
    font-size: 15px;
    color: #6b7280;
  }
}

.filter-bar {
  margin-bottom: 24px;
}

.qa-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.qa-item {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.qa-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.qa-time {
  font-size: 13px;
  color: #9ca3af;
}

.qa-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question,
.answer {
  .label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 8px;
  }

  .text {
    font-size: 15px;
    color: #374151;
    line-height: 1.6;
    padding: 12px 16px;
    background: #f9fafb;
    border-radius: 8px;
  }
}

.answer {
  .label {
    color: #10b981;
  }

  .text {
    background: #ecfdf5;
  }

  .answer-time {
    margin-left: auto;
    font-size: 12px;
    color: #9ca3af;
  }
}

.message {
  margin-top: 8px;
  font-size: 13px;
  color: #6b7280;
  padding: 8px 12px;
  background: #fef3c7;
  border-radius: 6px;
}

.message-label {
  color: #92400e;
  font-weight: 500;
}

.public-tag {
  margin-top: 8px;
}

.conversation-thread {
  margin: 16px 0;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;

  .reply-bubble {
    max-width: 80%;
    margin-bottom: 12px;
    padding: 12px 16px;
    border-radius: 12px;

    &.own {
      margin-left: auto;
      background: #eff6ff;
      border: 1px solid #bfdbfe;

      .reply-name {
        color: #2563eb;
      }
    }

    &.other {
      margin-right: auto;
      background: white;
      border: 1px solid #e5e7eb;

      .reply-name {
        color: #6b7280;
      }
    }

    .reply-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;

      .reply-name {
        font-size: 12px;
        font-weight: 600;
      }

      .reply-time {
        font-size: 11px;
        color: #9ca3af;
      }
    }

    .reply-content {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
    }
  }
}

.follow-up-input {
  margin-top: 12px;
}

.qa-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
