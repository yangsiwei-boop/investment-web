<template>
  <div class="question-library-page">
    <div class="page-header">
      <h1>问题库</h1>
      <p>管理常用回复，快速回答投资人问题</p>
    </div>

    <div class="action-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索问题..."
        style="width: 300px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        添加回复
      </el-button>
    </div>

    <div class="category-tabs">
      <span
        v-for="category in categories"
        :key="category.value"
        class="category-tab"
        :class="{ active: selectedCategory === category.value }"
        @click="selectedCategory = category.value"
      >
        {{ category.label }}
      </span>
    </div>

    <div class="question-list" v-if="filteredQuestions.length > 0">
      <div v-for="question in filteredQuestions" :key="question.id" class="question-item">
        <div class="question-content">
          <div class="question-header">
            <el-tag size="small" :type="getCategoryType(question.category)">
              {{ getCategoryLabel(question.category) }}
            </el-tag>
            <span class="frequent-badge" v-if="question.isFrequent">常用</span>
          </div>
          <div class="question-title">{{ question.questionTitle }}</div>
          <div class="question-answer" v-if="question.questionDescription">
            {{ question.questionDescription }}
          </div>
          <div class="question-meta">
            <span>使用次数: {{ question.usageCount }}</span>
          </div>
        </div>
        <div class="question-actions">
          <el-button size="small" @click="editQuestion(question)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteQuestion(question)">删除</el-button>
        </div>
      </div>
    </div>

    <EmptyState
      v-else
      icon="📝"
      title="暂无回复模板"
      description="添加您的第一个回复模板"
      action-text="添加回复"
      @action="showAddDialog"
    />

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingQuestion ? '编辑回复' : '添加回复'"
      width="600px"
    >
      <el-form :model="questionForm" :rules="rules" ref="formRef" label-position="top">
        <el-form-item prop="category" label="问题分类">
          <el-select v-model="questionForm.category" placeholder="选择分类" style="width: 100%;">
            <el-option
              v-for="category in categories.filter(c => c.value)"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="questionTitle" label="问题标题">
          <el-input v-model="questionForm.questionTitle" placeholder="问题简述" />
        </el-form-item>
        <el-form-item prop="questionDescription" label="回复内容">
          <el-input
            v-model="questionForm.questionDescription"
            type="textarea"
            :rows="6"
            placeholder="输入完整的回复内容..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveQuestion">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import EmptyState from '@/components/common/EmptyState.vue'
import * as questionApi from '@/api/question'
import type { QuestionLibraryItem } from '@/api/question'

const searchKeyword = ref('')
const selectedCategory = ref('')
const dialogVisible = ref(false)
const editingQuestion = ref<QuestionLibraryItem | null>(null)
const saving = ref(false)
const formRef = ref<FormInstance>()

const questions = ref<QuestionLibraryItem[]>([])

const questionForm = ref({
  category: '' as 'business_model' | 'product_technology' | 'market_expansion' | 'financial_data' | 'team' | 'other' | '',
  questionTitle: '',
  questionDescription: ''
})

const rules: FormRules = {
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  questionTitle: [{ required: true, message: '请输入问题标题', trigger: 'blur' }],
  questionDescription: [{ required: true, message: '请输入回复内容', trigger: 'blur' }]
}

const categories = [
  { label: '全部', value: '' },
  { label: '商业模式', value: 'business_model' },
  { label: '产品技术', value: 'product_technology' },
  { label: '市场扩张', value: 'market_expansion' },
  { label: '财务数据', value: 'financial_data' },
  { label: '团队', value: 'team' },
  { label: '其他', value: 'other' }
]

const filteredQuestions = computed(() => {
  let result = questions.value

  if (selectedCategory.value) {
    result = result.filter(q => q.category === selectedCategory.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(q =>
      q.questionTitle.toLowerCase().includes(keyword) ||
      q.questionDescription?.toLowerCase().includes(keyword)
    )
  }

  return result
})

function getCategoryLabel(category: string): string {
  return categories.find(c => c.value === category)?.label || category
}

function getCategoryType(category: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    business_model: 'success',
    product_technology: 'warning',
    market_expansion: 'info',
    financial_data: 'danger',
    team: '',
    other: 'info'
  }
  return types[category] || ''
}

function showAddDialog() {
  editingQuestion.value = null
  questionForm.value = {
    category: '',
    questionTitle: '',
    questionDescription: ''
  }
  dialogVisible.value = true
}

function editQuestion(question: QuestionLibraryItem) {
  editingQuestion.value = question
  questionForm.value = {
    category: question.category,
    questionTitle: question.questionTitle,
    questionDescription: question.questionDescription || ''
  }
  dialogVisible.value = true
}

async function saveQuestion() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    saving.value = true

    const data = {
      category: questionForm.value.category as 'business_model' | 'product_technology' | 'market_expansion' | 'financial_data' | 'team' | 'other',
      questionTitle: questionForm.value.questionTitle,
      questionDescription: questionForm.value.questionDescription
    }

    if (editingQuestion.value) {
      await questionApi.updateQuestion(editingQuestion.value.id, data)
      ElMessage.success('更新成功')
    } else {
      await questionApi.addCustomQuestion(data)
      ElMessage.success('添加成功')
    }

    dialogVisible.value = false
    loadQuestions()
  } catch (error) {
    console.error('Failed to save:', error)
  } finally {
    saving.value = false
  }
}

async function deleteQuestion(question: QuestionLibraryItem) {
  try {
    await ElMessageBox.confirm('确定要删除吗？', '提示', { type: 'warning' })
    await questionApi.deleteQuestion(question.id)
    ElMessage.success('删除成功')
    loadQuestions()
  } catch {
    // 用户取消
  }
}

async function loadQuestions() {
  try {
    const res = await questionApi.getQuestionLibrary()
    questions.value = res.data
  } catch (error) {
    console.error('Failed to load:', error)
  }
}

loadQuestions()
</script>

<style scoped lang="scss">
.question-library-page {
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

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.category-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  overflow-x: auto;
}

.category-tab {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;

  &:hover {
    border-color: #667eea;
    color: #667eea;
  }

  &.active {
    background: #f5f3ff;
    border-color: #667eea;
    color: #667eea;
    font-weight: 600;
  }
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.question-content {
  flex: 1;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.frequent-badge {
  padding: 2px 8px;
  background: #fef3c7;
  color: #f59e0b;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.question-answer {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 12px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.question-meta {
  font-size: 12px;
  color: #9ca3af;
}

.question-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
</style>
