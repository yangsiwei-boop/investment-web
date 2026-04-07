<template>
  <div class="deep-analysis-page">
    <div class="back-btn" @click="router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回基础分析</span>
    </div>

    <div class="analysis-header" v-if="teaser">
      <h1>AI深度投资分析</h1>
      <div class="project-info">
        <span class="project-name">{{ teaser.title }}</span>
        <span class="analysis-type">深度分析</span>
      </div>
    </div>

    <div class="content-grid" v-if="analysis">
      <!-- 主内容 -->
      <div class="main-content">
        <DeepAnalysisContent :analysis="analysis" />
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-card">
          <h4>📊 分析信息</h4>
          <div class="info-list">
            <div class="info-item">
              <span class="label">分析类型</span>
              <span class="value">深度分析</span>
            </div>
            <div class="info-item">
              <span class="label">生成时间</span>
              <span class="value">{{ formatDate(analysis.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h4>📥 导出报告</h4>
          <el-button class="full-width-btn" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出PDF报告
          </el-button>
        </div>
      </div>
    </div>

    <el-skeleton v-else :rows="20" animated />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Download } from '@element-plus/icons-vue'
import * as investorApi from '@/api/investor'
import type { Teaser, InvestmentAnalysis } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const teaser = ref<Teaser | null>(null)
const analysis = ref<InvestmentAnalysis | null>(null)
const loading = ref(false)

function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

async function loadData() {
  const teaserId = Number(route.params.id)
  if (!teaserId) return

  loading.value = true
  try {
    const teaserRes = await investorApi.getTeaserDetail(teaserId)
    teaser.value = teaserRes.data

    try {
      const analysisRes = await investorApi.getAnalysisResult(teaserId)
      analysis.value = analysisRes.data
    } catch {
      await generateAnalysis()
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
    router.back()
  } finally {
    loading.value = false
  }
}

async function generateAnalysis() {
  if (!teaser.value) return

  loading.value = true
  try {
    const res = await investorApi.deepAnalyzeTeaser(teaser.value.id)
    analysis.value = res.data
    ElMessage.success('深度分析报告生成成功')
  } catch (error) {
    ElMessage.error('生成分析失败')
  } finally {
    loading.value = false
  }
}

function handleExport() {
  ElMessage.info('导出功能开发中')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.deep-analysis-page {
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

.analysis-header {
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 12px;
  }

  .project-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .project-name {
    font-size: 16px;
    color: #6b7280;
  }

  .analysis-type {
    padding: 4px 12px;
    background: #fef3c7;
    color: #f59e0b;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;

  .label {
    color: #6b7280;
  }

  .value {
    color: #111827;
    font-weight: 500;
  }
}

.full-width-btn {
  width: 100%;
  height: 44px;
}
</style>
