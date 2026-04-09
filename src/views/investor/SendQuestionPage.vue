<template>
  <div class="send-question-page">
    <div class="back-btn" @click="router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>

    <div class="page-header">
      <h1>向企业发送问题</h1>
      <p>选择或自定义问题，获取您关心的项目信息</p>
    </div>

    <div class="content-grid">
      <div class="main-content">
        <!-- 项目信息 -->
        <div class="project-card" v-if="project">
          <div class="project-header">
            <div class="project-icon">{{ project.iconEmoji || '📦' }}</div>
            <div class="project-info">
              <div class="project-name">{{ project.projectName }}</div>
              <div class="project-tags">
                <span v-for="tag in project.tags?.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 问题选择 -->
        <div class="question-section">
          <h3>选择问题</h3>

          <div class="question-tabs">
            <el-radio-group v-model="questionType">
              <el-radio-button value="template">常用问题</el-radio-button>
              <el-radio-button value="custom">自定义问题</el-radio-button>
              <el-radio-button value="library">我的问题库</el-radio-button>
            </el-radio-group>
          </div>

          <!-- 常用问题 -->
          <div v-if="questionType === 'template'" class="question-list">
            <div
              v-for="question in templateQuestions"
              :key="question.id"
              class="question-item"
              :class="{ selected: selectedQuestion?.id === question.id }"
              @click="selectQuestion(question)"
            >
              <div class="question-category">{{ getCategoryLabel(question.category) }}</div>
              <div class="question-title">{{ question.questionTitle }}</div>
              <div class="question-desc" v-if="question.questionDescription">
                {{ question.questionDescription }}
              </div>
            </div>
          </div>

          <!-- 自定义问题 -->
          <div v-else-if="questionType === 'custom'" class="custom-question">
            <el-form :model="customQuestion" label-position="top">
              <el-form-item label="问题分类">
                <el-select v-model="customQuestion.category" placeholder="选择问题分类">
                  <el-option label="商业模式" value="business_model" />
                  <el-option label="产品技术" value="product_technology" />
                  <el-option label="市场扩张" value="market_expansion" />
                  <el-option label="财务数据" value="financial_data" />
                  <el-option label="团队" value="team" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
              <el-form-item label="问题标题">
                <el-input v-model="customQuestion.title" placeholder="请输入问题标题" />
              </el-form-item>
              <el-form-item label="问题描述">
                <el-input
                  v-model="customQuestion.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请详细描述您想了解的内容"
                />
              </el-form-item>
            </el-form>
          </div>

          <!-- 问题库 -->
          <div v-else class="question-list">
            <div
              v-for="question in libraryQuestions"
              :key="question.id"
              class="question-item"
              :class="{ selected: selectedQuestion?.id === question.id }"
              @click="selectQuestion(question)"
            >
              <div class="question-category">{{ getCategoryLabel(question.category) }}</div>
              <div class="question-title">{{ question.questionTitle }}</div>
              <div class="question-desc" v-if="question.questionDescription">
                {{ question.questionDescription }}
              </div>
            </div>
            <el-empty v-if="libraryQuestions.length === 0" description="问题库为空">
              <el-button type="primary" @click="questionType = 'custom'">创建问题</el-button>
            </el-empty>
          </div>
        </div>

        <!-- 附加留言 -->
        <div class="message-section">
          <h3>附加留言（可选）</h3>
          <el-input
            v-model="investorMessage"
            type="textarea"
            :rows="4"
            placeholder="您可以添加一些个人介绍或特别想说明的内容..."
          />
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-card">
          <h4>📝 问题预览</h4>
          <div class="preview-content">
            <div class="preview-label">问题分类</div>
            <div class="preview-value">{{ getCategoryLabel(currentQuestion?.category || '') }}</div>

            <div class="preview-label" style="margin-top: 16px;">问题内容</div>
            <div class="preview-value">{{ currentQuestion?.questionTitle || '请选择或输入问题' }}</div>

            <div class="preview-label" style="margin-top: 16px;" v-if="currentQuestion?.questionDescription">
              问题描述
            </div>
            <div class="preview-value" v-if="currentQuestion?.questionDescription">
              {{ currentQuestion?.questionDescription }}
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h4>💡 提问建议</h4>
          <ul class="tips-list">
            <li>问题要具体，避免过于宽泛</li>
            <li>关注核心业务指标和增长数据</li>
            <li>了解市场竞争格局和差异化优势</li>
            <li>询问团队背景和执行能力</li>
          </ul>
        </div>

        <div class="sidebar-card">
          <el-button type="primary" class="full-width-btn" :loading="sending" @click="handleSend">
            发送问题
          </el-button>
          <el-button class="full-width-btn mt-2" @click="router.back()">
            取消
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import * as investorApi from '@/api/investor'
import * as questionApi from '@/api/question'
import type { Teaser } from '@/types'
import type { QuestionLibraryItem } from '@/api/question'

const router = useRouter()
const route = useRoute()

const projectId = Number(route.params.id)

const project = ref<Teaser | null>(null)
const questionType = ref('template')
const selectedQuestion = ref<QuestionLibraryItem | null>(null)
const investorMessage = ref('')
const sending = ref(false)

const templateQuestions = ref<QuestionLibraryItem[]>([])
const libraryQuestions = ref<QuestionLibraryItem[]>([])

const customQuestion = ref({
  category: '' as 'business_model' | 'product_technology' | 'market_expansion' | 'financial_data' | 'team' | 'other' | '',
  title: '',
  description: ''
})

const currentQuestion = computed(() => {
  if (questionType.value === 'custom') {
    return {
      category: customQuestion.value.category,
      questionTitle: customQuestion.value.title,
      questionDescription: customQuestion.value.description
    }
  }
  if (selectedQuestion.value) {
    return {
      category: selectedQuestion.value.category,
      questionTitle: selectedQuestion.value.questionTitle,
      questionDescription: selectedQuestion.value.questionDescription
    }
  }
  return null
})

const categoryLabels: Record<string, string> = {
  business_model: '商业模式',
  product_technology: '产品技术',
  market_expansion: '市场扩张',
  financial_data: '财务数据',
  team: '团队',
  other: '其他'
}

function getCategoryLabel(category: string): string {
  return categoryLabels[category] || category
}

function selectQuestion(question: QuestionLibraryItem) {
  selectedQuestion.value = question
}

async function loadProject() {
  try {
    const res = await investorApi.getTeaserDetail(projectId)
    project.value = res.data
  } catch (error) {
    console.error('Failed to load project:', error)
  }
}

async function loadQuestions() {
  try {
    const [templates, library] = await Promise.all([
      questionApi.getTemplateQuestions().catch(() => ({ data: [] as any[] })),
      questionApi.getQuestionLibrary().catch(() => ({ data: [] as any[] }))
    ])
    templateQuestions.value = templates.data || []
    libraryQuestions.value = library.data || []
  } catch (error) {
    console.error('Failed to load questions:', error)
  }
}

async function handleSend() {
  if (!currentQuestion.value?.questionTitle) {
    ElMessage.warning('请选择或输入问题')
    return
  }

  sending.value = true
  try {
    await investorApi.sendQuestion({
      teaserId: projectId,
      question: currentQuestion.value.questionTitle,
      isPublic: false,
      category: currentQuestion.value.category || undefined
    })

    ElMessage.success('问题已发送')
    router.back()
  } catch (error: any) {
    ElMessage.error(error.message || '发送失败')
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  loadProject()
  loadQuestions()
})
</script>

<style scoped lang="scss">
.send-question-page {
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
}

.project-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.project-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.project-name {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.project-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.question-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
  }
}

.question-tabs {
  margin-bottom: 20px;
}

.question-list {
  display: grid;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.question-item {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #667eea;
    background: #f5f3ff;
  }

  &.selected {
    border-color: #667eea;
    background: #f5f3ff;
  }
}

.question-category {
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 8px;
}

.question-title {
  font-size: 15px;
  color: #111827;
  font-weight: 500;
  margin-bottom: 6px;
}

.question-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.custom-question {
  .el-select {
    width: 100%;
  }
}

.message-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
  }
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
  }
}

.preview-content {
  .preview-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .preview-value {
    font-size: 14px;
    color: #111827;
    line-height: 1.6;
  }
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 8px 0;
    font-size: 13px;
    color: #6b7280;
    padding-left: 20px;
    position: relative;

    &::before {
      content: "•";
      color: #667eea;
      position: absolute;
      left: 0;
      font-weight: bold;
    }
  }
}

.full-width-btn {
  width: 100%;
  height: 44px;
}

.mt-2 {
  margin-top: 8px;
}
</style>
