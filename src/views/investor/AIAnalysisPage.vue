<template>
  <div class="ai-analysis-page">
    <div class="back-btn" @click="router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回详情</span>
    </div>

    <div class="analysis-header" v-if="teaser">
      <h1>AI投资分析报告</h1>
      <div class="project-info">
        <span class="project-name">{{ teaser.title }}</span>
        <span class="analysis-type">基础分析</span>
      </div>
    </div>

    <div class="content-grid" v-if="analysis">
      <!-- 主内容 -->
      <div class="main-content">
        <!-- 综合评分 -->
        <div class="score-card">
          <div class="overall-score">
            <div class="score-circle">
              <div class="score-value">{{ analysis.overallScore || 0 }}</div>
              <div class="score-label">综合评分</div>
            </div>
            <div class="verdict" :class="verdictClass">
              {{ verdictText }}
            </div>
          </div>
          <div class="score-breakdown">
            <div class="score-item">
              <span class="label">行业分析</span>
              <el-progress :percentage="analysis.industryAnalysisScore || 0" :stroke-width="8" />
            </div>
            <div class="score-item">
              <span class="label">团队分析</span>
              <el-progress :percentage="analysis.teamAnalysisScore || 0" :stroke-width="8" />
            </div>
            <div class="score-item">
              <span class="label">技术分析</span>
              <el-progress :percentage="analysis.technologyAnalysisScore || 0" :stroke-width="8" />
            </div>
            <div class="score-item">
              <span class="label">竞争力</span>
              <el-progress :percentage="analysis.competitivenessAnalysisScore || 0" :stroke-width="8" />
            </div>
            <div class="score-item">
              <span class="label">财务健康</span>
              <el-progress :percentage="analysis.financialHealthScore || 0" :stroke-width="8" />
            </div>
            <div class="score-item">
              <span class="label">投资价值</span>
              <el-progress :percentage="analysis.investmentValueScore || 0" :stroke-width="8" />
            </div>
          </div>
        </div>

        <!-- 详细分析 -->
        <div class="analysis-sections">
          <div class="analysis-section" v-if="analysis.industryAnalysisText">
            <h3>
              <el-icon><TrendCharts /></el-icon>
              行业分析
            </h3>
            <p>{{ analysis.industryAnalysisText }}</p>
          </div>

          <div class="analysis-section" v-if="analysis.teamAnalysisText">
            <h3>
              <el-icon><User /></el-icon>
              团队分析
            </h3>
            <p>{{ analysis.teamAnalysisText }}</p>
          </div>

          <div class="analysis-section" v-if="analysis.technologyAnalysisText">
            <h3>
              <el-icon><Cpu /></el-icon>
              技术分析
            </h3>
            <p>{{ analysis.technologyAnalysisText }}</p>
          </div>

          <div class="analysis-section" v-if="analysis.competitivenessAnalysisText">
            <h3>
              <el-icon><Trophy /></el-icon>
              竞争力分析
            </h3>
            <p>{{ analysis.competitivenessAnalysisText }}</p>
          </div>

          <div class="analysis-section" v-if="analysis.financialHealthText">
            <h3>
              <el-icon><Money /></el-icon>
              财务健康度
            </h3>
            <p>{{ analysis.financialHealthText }}</p>
          </div>

          <div class="analysis-section" v-if="analysis.investmentValueText">
            <h3>
              <el-icon><Coin /></el-icon>
              投资价值分析
            </h3>
            <p>{{ analysis.investmentValueText }}</p>
          </div>
        </div>

        <!-- 投资亮点和风险 -->
        <div class="highlights-risks">
          <div class="highlights" v-if="analysis.investmentHighlights">
            <h3>
              <el-icon><Star /></el-icon>
              投资亮点
            </h3>
            <ul>
              <li v-for="(item, index) in parseList(analysis.investmentHighlights)" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="risks" v-if="analysis.riskWarnings">
            <h3>
              <el-icon><Warning /></el-icon>
              风险提示
            </h3>
            <ul>
              <li v-for="(item, index) in parseList(analysis.riskWarnings)" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 投资建议 -->
        <div class="suggestion-card" v-if="analysis.investmentSuggestion">
          <h3>
            <el-icon><Document /></el-icon>
            投资建议
          </h3>
          <p>{{ analysis.investmentSuggestion }}</p>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-card">
          <h4>📊 分析信息</h4>
          <div class="info-list">
            <div class="info-item">
              <span class="label">分析类型</span>
              <span class="value">{{ analysis.analysisType === 'deep' ? '深度分析' : '基础分析' }}</span>
            </div>
            <div class="info-item">
              <span class="label">生成时间</span>
              <span class="value">{{ formatDate(analysis.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="label">数据来源</span>
              <span class="value">{{ analysis.dataSource || 'AI生成' }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h4>🔍 深度分析</h4>
          <p class="desc">获取更详细的市场分析、财务预测和投资风险评估</p>
          <el-button type="primary" class="full-width-btn" @click="handleDeepAnalysis">
            生成深度分析报告
          </el-button>
        </div>

        <div class="sidebar-card">
          <h4>📥 导出报告</h4>
          <el-button class="full-width-btn" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出PDF报告
          </el-button>
        </div>

        <div class="sidebar-card">
          <h4>🎯 下一步操作</h4>
          <el-button type="primary" class="full-width-btn" @click="handleApplyBP">
            申请获取完整BP
          </el-button>
          <el-button class="full-width-btn mt-2" @click="handleSendQuestion">
            向企业提问
          </el-button>
        </div>
      </div>
    </div>

    <el-empty v-else-if="!loading" description="暂无分析数据">
      <el-button type="primary" @click="generateAnalysis">生成分析报告</el-button>
    </el-empty>

    <el-skeleton v-if="loading" :rows="20" animated />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  TrendCharts,
  User,
  Cpu,
  Trophy,
  Money,
  Coin,
  Star,
  Warning,
  Document,
  Download
} from '@element-plus/icons-vue'
import * as investorApi from '@/api/investor'
import type { Teaser, InvestmentAnalysis } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const teaser = ref<Teaser | null>(null)
const analysis = ref<InvestmentAnalysis | null>(null)
const loading = ref(false)

const verdictClass = computed(() => {
  switch (analysis.value?.overallVerdict) {
    case 'highly_recommend':
      return 'highly-recommend'
    case 'recommend':
      return 'recommend'
    case 'consider':
      return 'consider'
    case 'pass':
      return 'pass'
    default:
      return ''
  }
})

const verdictText = computed(() => {
  switch (analysis.value?.overallVerdict) {
    case 'highly_recommend':
      return '强烈推荐'
    case 'recommend':
      return '推荐投资'
    case 'consider':
      return '谨慎考虑'
    case 'pass':
      return '建议放弃'
    default:
      return '待评估'
  }
})

function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function parseList(text: string): string[] {
  return text.split('\n').filter(line => line.trim())
}

async function loadData() {
  const teaserId = Number(route.params.id)
  if (!teaserId) return

  loading.value = true
  try {
    // 加载Teaser信息
    const teaserRes = await investorApi.getTeaserDetail(teaserId)
    teaser.value = teaserRes.data

    // 尝试加载已有的分析
    try {
      const analysisRes = await investorApi.getTeaserAnalysis(teaserId)
      analysis.value = analysisRes.data
    } catch {
      // 没有分析数据，自动生成
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
    const res = await investorApi.createAnalysis({ teaserId: teaser.value.id })
    analysis.value = res.data
    ElMessage.success('分析报告生成成功')
  } catch (error) {
    ElMessage.error('生成分析失败')
  } finally {
    loading.value = false
  }
}

function handleDeepAnalysis() {
  if (teaser.value) {
    router.push({ name: 'DeepAnalysis', params: { id: teaser.value.id } })
  }
}

function handleExport() {
  ElMessage.info('导出功能开发中')
}

function handleApplyBP() {
  if (teaser.value) {
    router.push({ name: 'ApplyBP', params: { id: teaser.value.projectId } })
  }
}

function handleSendQuestion() {
  if (teaser.value) {
    router.push({ name: 'SendQuestion', params: { id: teaser.value.projectId } })
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.ai-analysis-page {
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
    background: #f5f3ff;
    color: #667eea;
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

.score-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.overall-score {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 32px;
}

.score-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;

  .score-value {
    font-size: 48px;
    font-weight: 700;
  }

  .score-label {
    font-size: 14px;
    opacity: 0.9;
  }
}

.verdict {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;

  &.highly-recommend {
    background: #ecfdf5;
    color: #10b981;
  }

  &.recommend {
    background: #eff6ff;
    color: #3b82f6;
  }

  &.consider {
    background: #fef3c7;
    color: #f59e0b;
  }

  &.pass {
    background: #fef2f2;
    color: #ef4444;
  }
}

.score-breakdown {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.score-item {
  .label {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
    display: block;
  }
}

.analysis-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

.analysis-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
  }

  p {
    color: #4b5563;
    font-size: 15px;
    line-height: 1.8;
  }
}

.highlights-risks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.highlights,
.risks {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
    color: #4b5563;

    &:last-child {
      border-bottom: none;
    }
  }
}

.highlights h3 {
  color: #10b981;
}

.risks h3 {
  color: #f59e0b;
}

.suggestion-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  color: white;

  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  p {
    font-size: 16px;
    line-height: 1.8;
    opacity: 0.95;
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

  .desc {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 16px;
    line-height: 1.6;
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

.mt-2 {
  margin-top: 8px;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .highlights-risks {
    grid-template-columns: 1fr;
  }
}
</style>
