<template>
  <div class="upload-bp-page">
    <div class="page-header">
      <h1>上传商业计划书</h1>
      <p>上传您的BP文件，系统将自动生成投资推介材料（Teaser）</p>
    </div>

    <div class="content-grid">
      <div class="main-content">
        <el-steps :active="currentStep" finish-status="success" simple class="steps">
          <el-step title="上传文件" />
          <el-step title="信息确认" />
          <el-step title="生成Teaser" />
        </el-steps>

        <!-- 步骤1：上传文件 -->
        <div v-if="currentStep === 0" class="step-content">
          <div class="upload-section">
            <FileUpload
              ref="uploadRef"
              title="点击或拖拽上传商业计划书"
              description="支持 PDF、PPT、PPTX 格式"
              hint="文件大小不超过 50MB"
              icon="📄"
              accept=".pdf,.ppt,.pptx"
              :max-size="50"
              @upload="handleFileUpload"
              @remove="uploadedFile = null"
            />
          </div>

          <div class="tips-section">
            <h4>💡 上传提示</h4>
            <ul>
              <li>建议上传完整的商业计划书，包含市场分析、团队介绍、财务数据等内容</li>
              <li>PDF格式的文件处理效果最佳</li>
              <li>确保文件内容清晰可读，避免扫描件</li>
              <li>系统会自动提取关键信息生成Teaser</li>
            </ul>
          </div>
        </div>

        <!-- 步骤2：信息确认 -->
        <div v-else-if="currentStep === 1" class="step-content">
          <div class="confirm-section">
            <h4>文件信息</h4>
            <div class="file-info-card">
              <div class="file-icon">📄</div>
              <div class="file-details">
                <div class="file-name">{{ uploadedFile?.name }}</div>
                <div class="file-size">{{ formatSize(uploadedFile?.size || 0) }}</div>
              </div>
            </div>

            <h4 style="margin-top: 24px;">选择项目</h4>
            <el-select v-model="selectedProjectId" placeholder="选择关联项目" style="width: 100%;">
              <el-option
                v-for="project in projects"
                :key="project.id"
                :label="project.projectName"
                :value="project.id"
              />
            </el-select>
            <div class="create-project-link" @click="createNewProject">
              没有项目？点击创建新项目
            </div>
          </div>
        </div>

        <!-- 步骤3：生成Teaser -->
        <div v-else-if="currentStep === 2" class="step-content">
          <div class="processing-section" v-if="isProcessing">
            <div class="processing-icon">
              <el-icon class="is-loading" :size="48"><Loading /></el-icon>
            </div>
            <h3>正在生成Teaser...</h3>
            <p>系统正在分析您的商业计划书并生成投资推介材料</p>
            <el-progress :percentage="processProgress" :stroke-width="10" />
          </div>

          <div class="success-section" v-else>
            <div class="success-icon">✅</div>
            <h3>上传成功！</h3>
            <p>您的商业计划书已上传，Teaser正在生成中</p>
            <div class="success-actions">
              <el-button type="primary" @click="viewTeaser">查看Teaser</el-button>
              <el-button @click="viewProject">查看项目</el-button>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <el-button v-if="currentStep > 0 && currentStep < 2" @click="prevStep">上一步</el-button>
          <el-button
            v-if="currentStep < 2"
            type="primary"
            :disabled="!canProceed"
            @click="nextStep"
          >
            下一步
          </el-button>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-card">
          <h4>📋 上传须知</h4>
          <ul class="info-list">
            <li>文件格式：PDF、PPT、PPTX</li>
            <li>文件大小：不超过50MB</li>
            <li>处理时间：约5-10分钟</li>
            <li>生成内容：自动提取关键信息</li>
          </ul>
        </div>

        <div class="sidebar-card">
          <h4>🎯 Teaser包含</h4>
          <ul class="info-list">
            <li>公司概述</li>
            <li>核心业务</li>
            <li>市场规模</li>
            <li>投资亮点</li>
            <li>财务数据</li>
            <li>融资计划</li>
          </ul>
        </div>

        <div class="sidebar-card">
          <h4>🔒 隐私保护</h4>
          <p class="privacy-text">
            您的项目信息将经过匿名化处理，真实公司名称和敏感信息将被隐藏，投资人只能查看脱敏后的Teaser内容。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import FileUpload from '@/components/common/FileUpload.vue'
import * as entrepreneurApi from '@/api/entrepreneur'
import type { Project } from '@/types'

const router = useRouter()

const currentStep = ref(0)
const uploadedFile = ref<File | null>(null)
const selectedProjectId = ref<number | null>(null)
const projects = ref<Project[]>([])
const isProcessing = ref(false)
const processProgress = ref(0)
const generatedTeaserId = ref<number | null>(null)

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return uploadedFile.value !== null
  }
  if (currentStep.value === 1) {
    return selectedProjectId.value !== null
  }
  return false
})

function handleFileUpload(file: File) {
  uploadedFile.value = file
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function createNewProject() {
  router.push({ name: 'EditProject' })
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

async function nextStep() {
  if (!canProceed.value) return

  if (currentStep.value === 1) {
    // 开始上传和处理
    currentStep.value = 2
    await uploadAndProcess()
  } else {
    currentStep.value++
  }
}

async function uploadAndProcess() {
  if (!uploadedFile.value || !selectedProjectId.value) return

  isProcessing.value = true
  processProgress.value = 0

  try {
    // 模拟上传进度
    const progressInterval = setInterval(() => {
      if (processProgress.value < 90) {
        processProgress.value += 10
      }
    }, 500)

    const res = await entrepreneurApi.uploadBusinessPlan(uploadedFile.value, (progress) => {
      processProgress.value = Math.min(progress, 90)
    })

    clearInterval(progressInterval)
    processProgress.value = 100
    generatedTeaserId.value = res.data.teaserId || null

    ElMessage.success('上传成功')
  } catch (error: any) {
    ElMessage.error(error.message || '上传失败')
    currentStep.value = 1
  } finally {
    isProcessing.value = false
  }
}

function viewTeaser() {
  if (generatedTeaserId.value) {
    router.push({ name: 'TeaserPreview', params: { id: generatedTeaserId.value } })
  } else {
    router.push({ name: 'EntrepreneurHome' })
  }
}

function viewProject() {
  router.push({ name: 'EntrepreneurHome' })
}

// 加载项目列表
async function loadProjects() {
  try {
    const res = await entrepreneurApi.getProjects()
    projects.value = res.data
  } catch (error) {
    console.error('Failed to load projects:', error)
  }
}

loadProjects()
</script>

<style scoped lang="scss">
.upload-bp-page {
  padding-bottom: 40px;
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

.steps {
  margin-bottom: 32px;
}

.step-content {
  min-height: 400px;
}

.upload-section {
  margin-bottom: 24px;
}

.tips-section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 8px 0;
      font-size: 14px;
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
}

.confirm-section {
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 16px;
  }
}

.file-info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.file-icon {
  font-size: 40px;
}

.file-name {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.file-size {
  font-size: 13px;
  color: #6b7280;
}

.create-project-link {
  margin-top: 12px;
  font-size: 14px;
  color: #667eea;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.processing-section {
  text-align: center;
  padding: 60px 20px;
}

.processing-icon {
  margin-bottom: 24px;
  color: #667eea;
}

.processing-section h3 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
}

.processing-section p {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 24px;
}

.success-section {
  text-align: center;
  padding: 60px 20px;
}

.success-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.success-section h3 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
}

.success-section p {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 32px;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
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

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 8px 0;
    font-size: 14px;
    color: #6b7280;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }
  }
}

.privacy-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}
</style>
