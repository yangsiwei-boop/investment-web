<template>
  <div class="reply-question-page">
    <div class="back-btn" @click="router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>

    <div class="page-header">
      <h1>回复问题</h1>
      <p>回复投资人的提问</p>
    </div>

    <div class="question-card" v-if="question">
      <div class="question-header">
        <div class="investor-info">
          <el-avatar :size="40">{{ (question.questionerName || question.investorName)?.charAt(0) || '投' }}</el-avatar>
          <div class="investor-detail">
            <div class="investor-name">{{ question.questionerName || question.investorName || '投资人' }}</div>
            <div class="question-time">{{ formatDate(question.questionedAt || question.sentAt || '') }}</div>
          </div>
        </div>
        <el-tag :type="question.status === 'PENDING' ? 'warning' : 'success'">
          {{ question.status === 'PENDING' ? '待回复' : '已回复' }}
        </el-tag>
      </div>

      <div class="question-content">
        <div class="question-title">{{ question.questionTitle || question.question }}</div>
        <div class="question-text">{{ question.question }}</div>
      </div>
    </div>

    <div class="reply-form" v-if="question">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item prop="answer" label="您的回复">
          <el-input
            v-model="form.answer"
            type="textarea"
            :rows="8"
            placeholder="请输入您的回复内容..."
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="隐私设置">
          <el-radio-group v-model="form.isPublic">
            <el-radio :value="false">
              <div class="radio-option">
                <div class="radio-label">仅提问者可见</div>
                <div class="radio-desc">只有提问的投资人可以看到您的回复</div>
              </div>
            </el-radio>
            <el-radio :value="true">
              <div class="radio-option">
                <div class="radio-label">公开回复</div>
                <div class="radio-desc">所有投资人都可以看到此问答</div>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div class="form-actions">
        <el-button size="large" @click="router.back()">取消</el-button>
        <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
          发送回复
        </el-button>
      </div>
    </div>

    <el-skeleton v-else :rows="10" animated />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import * as entrepreneurApi from '@/api/entrepreneur'
import type { QARecord } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const questionId = Number(route.params.id)
const formRef = ref<FormInstance>()
const submitting = ref(false)
const question = ref<QARecord | null>(null)

const form = reactive({
  answer: '',
  isPublic: false
})

const rules: FormRules = {
  answer: [
    { required: true, message: '请输入回复内容', trigger: 'blur' },
    { min: 10, message: '回复内容不能少于10字', trigger: 'blur' }
  ]
}

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

async function loadQuestion() {
  try {
    // 使用列表接口获取问题详情
    const res = await entrepreneurApi.getReceivedQuestions({})
    const found = (res.data.content ?? []).find(q => q.id === questionId)
    if (found) {
      question.value = found
      // 如果已有回复，填充表单
      if (found.answer) {
        form.answer = found.answer
      }
    } else {
      ElMessage.error('问题不存在')
      router.back()
    }
  } catch (error) {
    ElMessage.error('加载问题失败')
    router.back()
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    await entrepreneurApi.answerQuestion(questionId, {
      answer: form.answer,
      isPublic: form.isPublic
    })

    ElMessage.success('回复成功')
    router.back()
  } catch (error: any) {
    ElMessage.error(error.message || '回复失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadQuestion()
})
</script>

<style scoped lang="scss">
.reply-question-page {
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
  margin-bottom: 32px;

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

.question-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
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

.investor-detail {
  .investor-name {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
  }

  .question-time {
    font-size: 13px;
    color: #6b7280;
  }
}

.question-content {
  .question-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 12px;
  }

  .question-text {
    font-size: 15px;
    color: #374151;
    line-height: 1.8;
    background: #f9fafb;
    padding: 16px;
    border-radius: 12px;
  }
}

.reply-form {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.radio-option {
  .radio-label {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
  }

  .radio-desc {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
