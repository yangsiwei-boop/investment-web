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
        <div class="analysis-sections">
          <!-- 总体评估 -->
          <div class="score-overview">
            <div class="overall-score">
              <div class="score-ring" :style="{ '--score': analysis.overallScore || 0 }">
                <span class="score-num">{{ analysis.overallScore || '-' }}</span>
              </div>
              <div class="score-text">
                <h3>总体评估</h3>
                <p>{{ analysis.overallVerdict || '暂无评价' }}</p>
              </div>
            </div>
          </div>

          <!-- 分项评分 -->
          <div class="detail-card" v-if="analysis.industryAnalysisText">
            <div class="card-header">
              <h4>行业分析</h4>
              <el-tag v-if="analysis.industryAnalysisScore" type="primary" size="small">
                {{ analysis.industryAnalysisScore }}分
              </el-tag>
            </div>
            <p>{{ analysis.industryAnalysisText }}</p>
          </div>

          <div class="detail-card" v-if="analysis.teamAnalysisText">
            <div class="card-header">
              <h4>团队分析</h4>
              <el-tag v-if="analysis.teamAnalysisScore" type="primary" size="small">
                {{ analysis.teamAnalysisScore }}分
              </el-tag>
            </div>
            <p>{{ analysis.teamAnalysisText }}</p>
          </div>

          <div class="detail-card" v-if="analysis.technologyAnalysisText">
            <div class="card-header">
              <h4>技术分析</h4>
              <el-tag v-if="analysis.technologyAnalysisScore" type="primary" size="small">
                {{ analysis.technologyAnalysisScore }}分
              </el-tag>
            </div>
            <p>{{ analysis.technologyAnalysisText }}</p>
          </div>

          <div class="detail-card" v-if="analysis.competitivenessAnalysisText">
            <div class="card-header">
              <h4>竞争力分析</h4>
              <el-tag v-if="analysis.competitivenessAnalysisScore" type="primary" size="small">
                {{ analysis.competitivenessAnalysisScore }}分
              </el-tag>
            </div>
            <p>{{ analysis.competitivenessAnalysisText }}</p>
          </div>

          <div class="detail-card" v-if="analysis.financialHealthText">
            <div class="card-header">
              <h4>财务健康</h4>
              <el-tag v-if="analysis.financialHealthScore" type="primary" size="small">
                {{ analysis.financialHealthScore }}分
              </el-tag>
            </div>
            <p>{{ analysis.financialHealthText }}</p>
          </div>

          <div class="detail-card" v-if="analysis.investmentValueText">
            <div class="card-header">
              <h4>投资价值</h4>
              <el-tag v-if="analysis.investmentValueScore" type="primary" size="small">
                {{ analysis.investmentValueScore }}分
              </el-tag>
            </div>
            <p>{{ analysis.investmentValueText }}</p>
          </div>

          <!-- 投资亮点 -->
          <div class="detail-card highlight" v-if="analysis.investmentHighlights">
            <h4>投资亮点</h4>
            <p>{{ analysis.investmentHighlights }}</p>
          </div>

          <!-- 风险提示 -->
          <div class="detail-card risk" v-if="analysis.riskWarnings">
            <h4>风险提示</h4>
            <p>{{ analysis.riskWarnings }}</p>
          </div>

          <!-- 投资建议 -->
          <div class="detail-card suggestion" v-if="analysis.investmentSuggestion">
            <h4>投资建议</h4>
            <p>{{ analysis.investmentSuggestion }}</p>
          </div>
        </div>
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
      const analysisRes = await investorApi.getTeaserAnalysis(teaserId)
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
    const res = await investorApi.createAnalysis({ teaserId: teaser.value.id, deepAnalysis: true })
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

.analysis-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.score-overview {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.overall-score {
  display: flex;
  align-items: center;
  gap: 24px;
}

.score-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(#667eea calc(var(--score) * 1%), #e5e7eb calc(var(--score) * 1%));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .score-num {
    width: 64px;
    height: 64px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    color: #667eea;
  }
}

.score-text {
  flex: 1;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
  }
}

.detail-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 12px;
  }

  p {
    font-size: 14px;
    color: #374151;
    line-height: 1.8;
    white-space: pre-line;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h4 {
      margin-bottom: 0;
    }
  }
}

.detail-card.highlight {
  border-left: 4px solid #10b981;
}

.detail-card.risk {
  border-left: 4px solid #f59e0b;
}

.detail-card.suggestion {
  border-left: 4px solid #667eea;
}
</style>
