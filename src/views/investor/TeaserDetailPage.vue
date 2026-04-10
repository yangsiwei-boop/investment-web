<template>
  <div class="teaser-detail-page">
    <div class="back-btn" @click="router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回搜索</span>
    </div>

    <div class="content-grid" v-if="teaser">
      <!-- 主内容区 -->
      <div class="main-content">
        <div class="teaser-card">
          <div class="teaser-header">
            <div class="teaser-title">{{ teaser.title }}</div>
            <div class="teaser-subtitle" v-if="teaser.subtitle">{{ teaser.subtitle }}</div>
            <div class="teaser-tags">
              <span v-for="tag in teaser.tags" :key="tag" class="teaser-tag">{{ tag }}</span>
            </div>
          </div>

          <div class="teaser-body">
            <div class="teaser-section" v-if="teaser.companyOverview">
              <h3>公司概述</h3>
              <p>{{ teaser.companyOverview }}</p>
            </div>

            <div class="teaser-section" v-if="teaser.coreBusiness">
              <h3>核心业务</h3>
              <p>{{ teaser.coreBusiness }}</p>
            </div>

            <div class="teaser-section" v-if="teaser.investmentHighlights">
              <h3>投资亮点</h3>
              <ul>
                <li v-for="(highlight, index) in parseList(teaser.investmentHighlights)" :key="index">
                  {{ highlight }}
                </li>
              </ul>
            </div>

            <div class="teaser-section" v-if="teaser.marketSize">
              <h3>市场规模</h3>
              <p>{{ teaser.marketSize }}</p>
            </div>

            <div class="teaser-section" v-if="teaser.competitiveAdvantage">
              <h3>竞争优势</h3>
              <p>{{ teaser.competitiveAdvantage }}</p>
            </div>

            <div class="teaser-section" v-if="teaser.financialData">
              <h3>财务数据与融资计划</h3>
              <div class="data-grid">
                <div class="data-card" v-if="teaser.financialData.revenue">
                  <div class="data-label">年度营收</div>
                  <div class="data-value">{{ teaser.financialData.revenue }}</div>
                </div>
                <div class="data-card" v-if="teaser.financialData.growth">
                  <div class="data-label">同比增长</div>
                  <div class="data-value">{{ teaser.financialData.growth }}</div>
                </div>
                <div class="data-card" v-if="teaser.financialData.grossMargin">
                  <div class="data-label">毛利率</div>
                  <div class="data-value">{{ teaser.financialData.grossMargin }}</div>
                </div>
                <div class="data-card" v-if="teaser.financialData.customers">
                  <div class="data-label">付费客户</div>
                  <div class="data-value">{{ teaser.financialData.customers }}</div>
                </div>
              </div>
              <div class="financing-info" v-if="teaser.financingPlan">
                <p>{{ teaser.financingPlan }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-card">
          <h4>📊 投资匹配度</h4>
          <div class="match-score">
            <div class="score">{{ teaser.matchScore || 0 }}%</div>
            <div class="label">高度匹配您的投资偏好</div>
          </div>
        </div>

        <div class="sidebar-card">
          <h4>🎯 快速操作</h4>
          <div class="action-buttons">
            <el-button type="primary" class="action-btn" @click="handleAIAnalysis">
              <el-icon><DataAnalysis /></el-icon>
              <span>AI智能分析</span>
            </el-button>
            <el-button class="action-btn" @click="toggleFavorite">
              <el-icon><Star /></el-icon>
              <span>{{ isFavorite ? '取消收藏' : '收藏项目' }}</span>
            </el-button>
            <el-button class="action-btn" @click="handleShare">
              <el-icon><Share /></el-icon>
              <span>分享给同事</span>
            </el-button>
            <el-button class="action-btn" @click="handleDownload">
              <el-icon><Download /></el-icon>
              <span>下载Teaser</span>
            </el-button>
          </div>
        </div>

        <div class="sidebar-card">
          <div class="hidden-notice">
            <div class="title">
              <el-icon><Lock /></el-icon>
              <span>隐私保护</span>
            </div>
            <div class="desc">
              为保护企业隐私，Teaser中已隐去真实公司名称，使用"公司"代称。如有投资意向，可申请获取完整信息。
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h4>📋 项目信息</h4>
          <div class="info-list">
            <div class="info-item">
              <el-icon><Calendar /></el-icon>
              <div class="content">
                <div class="label">发布时间</div>
                <div class="value">{{ formatDate(teaser.createdAt) }}</div>
              </div>
            </div>
            <div class="info-item">
              <el-icon><View /></el-icon>
              <div class="content">
                <div class="label">浏览次数</div>
                <div class="value">{{ teaser.viewCount }}次</div>
              </div>
            </div>
            <div class="info-item">
              <el-icon><Star /></el-icon>
              <div class="content">
                <div class="label">收藏数</div>
                <div class="value">{{ teaser.favoriteCount }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h4>💬 向企业提问</h4>
          <el-button type="primary" class="full-width-btn" @click="handleSendQuestion">
            发送问题
          </el-button>
        </div>

        <div class="sidebar-card">
          <h4>📄 申请完整资料</h4>
          <el-button type="primary" class="full-width-btn" @click="handleApplyBP">
            申请获取BP
          </el-button>
          <el-button type="default" class="full-width-btn mt-2" @click="handleApplyContact">
            申请联系企业
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
import {
  ArrowLeft,
  DataAnalysis,
  Star,
  Share,
  Download,
  Lock,
  Calendar,
  View
} from '@element-plus/icons-vue'
import * as investorApi from '@/api/investor'
import type { Teaser } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const teaser = ref<Teaser | null>(null)
const isFavorite = ref(false)

function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD')
}

function parseList(text: string): string[] {
  return text.split('\n').filter(line => line.trim())
}

async function loadTeaser() {
  const id = Number(route.params.id)
  if (!id) return

  try {
    const res = await investorApi.getTeaserDetail(id)
    teaser.value = res.data
  } catch (error) {
    ElMessage.error('加载项目详情失败')
    router.back()
  }
}

function handleAIAnalysis() {
  if (teaser.value) {
    router.push({ name: 'AIAnalysis', params: { id: teaser.value.id } })
  }
}

async function toggleFavorite() {
  if (!teaser.value) return

  try {
    if (isFavorite.value) {
      await investorApi.removeFavorite(teaser.value.id)
      ElMessage.success('已取消收藏')
    } else {
      await investorApi.addFavorite({ teaserId: teaser.value.id })
      ElMessage.success('已收藏')
    }
    isFavorite.value = !isFavorite.value
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

function handleShare() {
  if (teaser.value) {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    ElMessage.success('链接已复制到剪贴板')
  }
}

function handleDownload() {
  if (teaser.value) {
    // TODO: 实现下载功能
    ElMessage.info('下载功能开发中')
  }
}

function handleSendQuestion() {
  if (teaser.value) {
    router.push({
      name: 'SendQuestion',
      params: { id: teaser.value.id }
    })
  }
}

function handleApplyBP() {
  if (teaser.value) {
    router.push({
      name: 'ApplyBP',
      params: { id: teaser.value.id }
    })
  }
}

function handleApplyContact() {
  if (teaser.value) {
    router.push({
      name: 'ApplyContact',
      params: { id: teaser.value.id }
    })
  }
}

onMounted(() => {
  loadTeaser()
})
</script>

<style scoped lang="scss">
.teaser-detail-page {
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
}

.teaser-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.teaser-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
}

.teaser-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}

.teaser-subtitle {
  font-size: 15px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.teaser-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.teaser-tag {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.teaser-body {
  padding: 32px;
}

.teaser-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  h3 {
    color: #111827;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 16px;
    padding-left: 16px;
    border-left: 4px solid #667eea;
  }

  p {
    color: #4b5563;
    font-size: 15px;
    line-height: 1.8;
    margin-bottom: 16px;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  li {
    color: #4b5563;
    font-size: 15px;
    line-height: 1.8;
    padding-left: 24px;
    position: relative;
    margin-bottom: 10px;

    &::before {
      content: "•";
      color: #667eea;
      position: absolute;
      left: 0;
      font-weight: bold;
      font-size: 20px;
    }
  }
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 16px;
}

.data-card {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
}

.data-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.data-value {
  font-size: 24px;
  color: #111827;
  font-weight: 700;
}

.financing-info {
  margin-top: 24px;

  p {
    margin-bottom: 8px;
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
    color: #111827;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.match-score {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 12px;
  margin-bottom: 20px;

  .score {
    font-size: 48px;
    font-weight: 700;
    color: #10b981;
    margin-bottom: 8px;
  }

  .label {
    font-size: 14px;
    color: #059669;
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.full-width-btn {
  width: 100%;
  height: 44px;
}

.mt-2 {
  margin-top: 8px;
}

.hidden-notice {
  background: #fef3c7;
  border-radius: 10px;
  padding: 16px;

  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #92400e;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .desc {
    color: #78716c;
    font-size: 13px;
    line-height: 1.5;
  }
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .el-icon {
    color: #6b7280;
    margin-top: 2px;
  }

  .content {
    flex: 1;
  }

  .label {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .value {
    font-size: 15px;
    color: #111827;
    font-weight: 500;
  }
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: -1;
  }
}
</style>
