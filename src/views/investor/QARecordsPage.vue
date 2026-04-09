<template>
  <div class="qa-records-page">
    <div class="page-header">
      <h1>问答记录</h1>
      <p>查看您发送的问题和收到的回复</p>
    </div>

    <div class="filter-bar">
      <el-radio-group v-model="statusFilter" @change="loadQARecords">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="pending">待回复</el-radio-button>
        <el-radio-button value="answered">已回复</el-radio-button>
        <el-radio-button value="ignored">已忽略</el-radio-button>
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

        <div class="qa-actions">
          <el-button size="small" @click="viewProject(record.projectId || record.teaserId)">查看项目</el-button>
          <el-button size="small" v-if="record.answer && record.isPublic" @click="viewPublicQA(record)">
            查看公开问答
          </el-button>
          <el-button size="small" v-if="!record.answer" @click="sendFollowUp(record)">
            追问
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
import { QuestionFilled, ChatDotRound } from '@element-plus/icons-vue'
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

const projectNames: Record<number, string> = {}

function formatDate(date: string | undefined) {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''
}

function getStatusType(status: string | undefined): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'answered':
      return 'success'
    case 'ignored':
      return 'info'
    default:
      return 'info'
  }
}

function getStatusLabel(status: string | undefined) {
  switch (status) {
    case 'pending':
      return '待回复'
    case 'answered':
      return '已回复'
    case 'ignored':
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

function sendFollowUp(record: QARecord) {
  router.push({
    name: 'SendQuestion',
    params: { id: record.projectId || record.teaserId }
  })
}

async function loadQARecords() {
  loading.value = true
  try {
    const res = await investorApi.getQAList({
      page: currentPage.value,
      size: pageSize
    })
    qaRecords.value = res.data.content
    total.value = res.data.totalElements
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
