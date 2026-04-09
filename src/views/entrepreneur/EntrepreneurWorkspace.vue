<template>
  <div class="entrepreneur-workspace">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h2>👋 欢迎回来，{{ userName }}</h2>
      <p>开始您的融资之旅，让更多投资人了解您的项目</p>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">已上传BP</div>
          <div class="value">{{ stats.uploadedBPCount }}</div>
        </div>
        <div class="stat-card">
          <div class="label">已生成Teaser</div>
          <div class="value">{{ stats.generatedTeaserCount }}</div>
        </div>
        <div class="stat-card">
          <div class="label">投资人查看</div>
          <div class="value">{{ stats.investorViewCount }}</div>
        </div>
        <div class="stat-card">
          <div class="label">待完善信息</div>
          <div class="value">{{ stats.pendingInfoCount }}</div>
        </div>
      </div>
    </div>

    <!-- 快捷操作卡片 -->
    <div class="action-cards">
      <div class="action-card" @click="router.push({ name: 'UploadBP' })">
        <div class="icon">📄</div>
        <h3>上传商业计划书</h3>
        <p>上传您的BP文件，系统将自动生成专业的投资推介材料</p>
        <div class="btn">立即上传</div>
      </div>
      <div class="action-card" @click="router.push({ name: 'EditProject' })">
        <div class="icon">✨</div>
        <h3>完善项目信息</h3>
        <p>补充和优化项目详情，提升对投资人的吸引力</p>
        <div class="btn">去完善</div>
      </div>
      <div class="action-card" @click="router.push({ name: 'ReceivedQuestions' })">
        <div class="icon">📊</div>
        <h3>查看数据分析</h3>
        <p>了解项目被投资人查看和关注的情况</p>
        <div class="btn">查看数据</div>
      </div>
    </div>

    <!-- 我的商业计划书 -->
    <div class="section">
      <div class="section-header">
        <h3>我的商业计划书</h3>
        <router-link to="/entrepreneur/projects" class="view-all">
          查看全部 →
        </router-link>
      </div>

      <div class="bp-list" v-if="businessPlans.length > 0">
        <div v-for="bp in businessPlans" :key="bp.id" class="bp-item">
          <div class="bp-info">
            <div class="bp-icon">📄</div>
            <div class="bp-details">
              <div class="bp-title">{{ bp.fileName }}</div>
              <div class="bp-meta">
                上传于 {{ formatDate(bp.createdAt) }} ·
                {{ bp.teaserGenerationStatus === 'completed' ? '已生成Teaser' : '正在生成Teaser' }}
              </div>
            </div>
          </div>
          <div class="bp-status" :class="bp.teaserGenerationStatus">
            {{ getStatusLabel(bp.teaserGenerationStatus || '') }}
          </div>
          <div class="bp-actions">
            <el-button size="small" @click="viewTeaser(bp)" v-if="bp.teaserId">
              <el-icon><View /></el-icon>
            </el-button>
            <el-button size="small" @click="editProject(bp.projectId)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button size="small" @click="downloadBP(bp)">
              <el-icon><Download /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <EmptyState
        v-else
        icon="📄"
        title="暂无商业计划书"
        description="上传您的第一份商业计划书"
        action-text="立即上传"
        @action="router.push({ name: 'UploadBP' })"
      />
    </div>

    <!-- 待处理事项 -->
    <div class="section" v-if="pendingItems.length > 0">
      <div class="section-header">
        <h3>待处理事项</h3>
      </div>
      <div class="pending-list">
        <div v-for="item in pendingItems" :key="item.id" class="pending-item">
          <div class="pending-icon">{{ item.icon }}</div>
          <div class="pending-content">
            <div class="pending-title">{{ item.title }}</div>
            <div class="pending-desc">{{ item.description }}</div>
          </div>
          <el-button size="small" type="primary" @click="handlePendingItem(item)">
            {{ item.actionText }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { View, Edit, Download } from '@element-plus/icons-vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useAuthStore } from '@/stores/auth'
import * as entrepreneurApi from '@/api/entrepreneur'
import type { BusinessPlan } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.realName || '融资用户')

const stats = ref({
  uploadedBPCount: 0,
  generatedTeaserCount: 0,
  investorViewCount: 0,
  pendingInfoCount: 0
})

const businessPlans = ref<BusinessPlan[]>([])

const pendingItems = ref([
  { id: 1, icon: '❓', title: '3个待回复问题', description: '投资人向您发送了问题', actionText: '去回复', route: 'ReceivedQuestions' },
  { id: 2, icon: '📋', title: '2个待审核申请', description: '投资人申请获取BP或联系方式', actionText: '去审核', route: 'EntrepreneurApplications' }
])

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN')
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'completed':
      return '已完成'
    case 'processing':
      return '生成中'
    case 'pending':
      return '待处理'
    case 'failed':
      return '失败'
    default:
      return status
  }
}

function viewTeaser(bp: BusinessPlan) {
  if (bp.teaserId) {
    router.push({ name: 'TeaserPreview', params: { id: bp.teaserId } })
  }
}

function editProject(projectId: number) {
  router.push({ name: 'EditProject', params: { id: projectId } })
}

function downloadBP(bp: BusinessPlan) {
  window.open(bp.fileUrl, '_blank')
}

function handlePendingItem(item: any) {
  router.push({ name: item.route })
}

async function loadData() {
  try {
    const statsRes = await entrepreneurApi.getEntrepreneurDashboard()
    stats.value = statsRes.data

    // 加载项目列表，取第一个项目的BP展示
    const projectsRes = await entrepreneurApi.getProjects({ page: 0, size: 1 })
    const projects = projectsRes.data.content
    if (projects.length > 0) {
      const bpRes = await entrepreneurApi.getBusinessPlans(projects[0].id)
      businessPlans.value = bpRes.data.slice(0, 5) // 只显示前5个
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.entrepreneur-workspace {
  padding-bottom: 40px;
}

.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  color: white;
  margin-bottom: 32px;

  h2 {
    font-size: 28px;
    margin-bottom: 12px;
  }

  p {
    font-size: 15px;
    opacity: 0.9;
    margin-bottom: 20px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;

  .label {
    font-size: 13px;
    opacity: 0.9;
    margin-bottom: 8px;
  }

  .value {
    font-size: 32px;
    font-weight: 700;
  }
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  h3 {
    color: #374151;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  p {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .btn {
    display: inline-block;
    padding: 10px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s;
  }

  &:hover .btn {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
  }
}

.section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  h3 {
    color: #374151;
    font-size: 20px;
    font-weight: 600;
  }

  .view-all {
    color: #667eea;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.bp-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bp-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    background: #f5f3ff;
  }
}

.bp-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.bp-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.bp-details {
  flex: 1;
}

.bp-title {
  font-size: 16px;
  color: #374151;
  font-weight: 600;
  margin-bottom: 4px;
}

.bp-meta {
  font-size: 13px;
  color: #9ca3af;
}

.bp-status {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin: 0 16px;

  &.completed {
    background: #ecfdf5;
    color: #10b981;
  }

  &.processing {
    background: #fef3c7;
    color: #f59e0b;
  }

  &.pending {
    background: #f3f4f6;
    color: #6b7280;
  }

  &.failed {
    background: #fef2f2;
    color: #ef4444;
  }
}

.bp-actions {
  display: flex;
  gap: 8px;
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pending-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.pending-icon {
  font-size: 28px;
}

.pending-content {
  flex: 1;
}

.pending-title {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.pending-desc {
  font-size: 13px;
  color: #6b7280;
}
</style>
