<template>
  <div class="received-questions-page">
    <div class="back-btn" @click="router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>

    <div class="page-header">
      <h1>收到的提问</h1>
      <p>回复投资人问题，展示项目价值</p>
    </div>

    <div class="filter-bar">
      <el-radio-group v-model="statusFilter" @change="loadQuestions">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="PENDING">待回复</el-radio-button>
        <el-radio-button value="ANSWERED">已回复</el-radio-button>
        <el-radio-button value="IGNORED">已忽略</el-radio-button>
      </el-radio-group>
    </div>

    <div class="question-list" v-if="questions.length > 0">
      <div v-for="question in questions" :key="question.id" class="question-item">
        <div class="question-header">
          <div class="investor-info">
            <el-avatar :size="40">{{ (question.questionerName || question.investorName)?.charAt(0) || '投' }}</el-avatar>
            <div class="investor-details">
              <div class="investor-name">{{ question.questionerName || question.investorName || '投资人' }}</div>
              <div class="question-time">{{ formatDate(question.questionedAt || question.sentAt || '') }}</div>
            </div>
          </div>
          <el-tag :type="getStatusType(question.status || question.questionStatus)" size="small">
            {{ getStatusLabel(question.status || question.questionStatus) }}
          </el-tag>
        </div>

        <div class="question-content">
          <div class="question-text">
            <div class="label">问题内容</div>
            <div class="text">{{ question.question }}</div>
            <div class="message" v-if="question.investorMessage">
              <span class="message-label">投资人留言：</span>{{ question.investorMessage }}
            </div>
          </div>

          <div class="answer-text" v-if="question.answer">
            <div class="label">我的回复</div>
            <div class="text">{{ question.answer }}</div>
            <div class="public-badge" v-if="question.isPublic">
              <el-tag type="success" size="small">公开问答</el-tag>
            </div>
          </div>
        </div>

        <div class="question-actions">
          <el-button
            v-if="(question.status || question.questionStatus) === 'PENDING'"
            type="primary"
            @click="replyQuestion(question)"
          >
            回复
          </el-button>
          <el-button
            v-if="(question.status || question.questionStatus) === 'ANSWERED'"
            @click="editReply(question)"
          >
            编辑回复
          </el-button>
        </div>
      </div>
    </div>

    <EmptyState
      v-else-if="!loading"
      icon="❓"
      title="暂无提问"
      description="投资人发送的问题将显示在这里"
    />

    <div class="pagination" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="loadQuestions"
      />
    </div>

    <!-- 回复对话框 -->
    <el-dialog v-model="replyDialogVisible" title="回复问题" width="600px">
      <div class="reply-dialog-content">
        <div class="original-question">
          <div class="label">原问题</div>
          <div class="text">{{ currentQuestion?.question }}</div>
        </div>

        <el-form :model="replyForm" label-position="top">
          <el-form-item label="回复内容">
            <el-input
              v-model="replyForm.answer"
              type="textarea"
              :rows="6"
              placeholder="请输入您的回复..."
            />
          </el-form-item>

          <el-form-item label="隐私设置">
            <div class="privacy-options">
              <el-radio-group v-model="replyForm.isPublic">
                <el-radio :value="true">
                  <div class="radio-content">
                    <div class="radio-title">公开回复</div>
                    <div class="radio-desc">其他投资人也能看到此问答</div>
                  </div>
                </el-radio>
                <el-radio :value="false">
                  <div class="radio-content">
                    <div class="radio-title">私密回复</div>
                    <div class="radio-desc">仅提问的投资人可见</div>
                  </div>
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submitReply">提交回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import EmptyState from '@/components/common/EmptyState.vue'
import * as entrepreneurApi from '@/api/entrepreneur'
import type { QARecord } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()

const loading = ref(false)
const questions = ref<QARecord[]>([])
const currentPage = ref(1)
const pageSize = 10
const total = ref(0)
const statusFilter = ref('')

const replyDialogVisible = ref(false)
const currentQuestion = ref<QARecord | null>(null)
const saving = ref(false)

const replyForm = ref({
  answer: '',
  isPublic: true
})

function formatDate(date: string): string {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD HH:mm')
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

function getStatusLabel(status: string | undefined): string {
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

function replyQuestion(question: QARecord) {
  currentQuestion.value = question
  replyForm.value = {
    answer: '',
    isPublic: true
  }
  replyDialogVisible.value = true
}

function editReply(question: QARecord) {
  currentQuestion.value = question
  replyForm.value = {
    answer: question.answer || '',
    isPublic: question.isPublic
  }
  replyDialogVisible.value = true
}

async function submitReply() {
  if (!currentQuestion.value || !replyForm.value.answer.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }

  saving.value = true
  try {
    await entrepreneurApi.answerQuestion(currentQuestion.value.id, replyForm.value)
    ElMessage.success('回复成功')
    replyDialogVisible.value = false
    // 回复后重置筛选以显示最新状态
    statusFilter.value = ''
    loadQuestions()
  } catch (error: any) {
    ElMessage.error(error.message || '回复失败')
  } finally {
    saving.value = false
  }
}

async function loadQuestions() {
  loading.value = true
  try {
    const res = await entrepreneurApi.getReceivedQuestions({
      status: statusFilter.value as any,
      page: currentPage.value,
      size: pageSize
    })
    questions.value = res.data.content ?? []
    total.value = res.data.totalElements ?? 0
  } catch (error) {
    console.error('Failed to load questions:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadQuestions()
})
</script>

<style scoped lang="scss">
.received-questions-page {
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

.question-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-item {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.investor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.investor-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.question-time {
  font-size: 13px;
  color: #9ca3af;
}

.question-content {
  margin-bottom: 20px;
}

.question-text,
.answer-text {
  margin-bottom: 16px;

  .label {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 8px;
  }

  .text {
    font-size: 15px;
    color: #374151;
    line-height: 1.6;
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
  }
}

.answer-text .text {
  background: #ecfdf5;
}

.message {
  margin-top: 12px;
  font-size: 13px;
  color: #6b7280;
  padding: 12px;
  background: #fef3c7;
  border-radius: 6px;
}

.message-label {
  color: #92400e;
  font-weight: 500;
}

.public-badge {
  margin-top: 8px;
}

.question-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.reply-dialog-content {
  .original-question {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f3f4f6;

    .label {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .text {
      font-size: 15px;
      color: #374151;
      line-height: 1.6;
    }
  }
}

.privacy-options {
  .el-radio {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    height: auto;
  }
}

.radio-content {
  .radio-title {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
  }

  .radio-desc {
    font-size: 13px;
    color: #6b7280;
  }
}
</style>
