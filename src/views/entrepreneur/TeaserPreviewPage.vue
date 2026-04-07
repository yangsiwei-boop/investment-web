<template>
  <div class="teaser-preview-page">
    <div class="back-btn" @click="router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回工作台</span>
    </div>

    <div class="preview-header" v-if="teaser">
      <h1>Teaser 预览</h1>
      <p>查看您的项目推介材料</p>
    </div>

    <div class="preview-container" v-if="teaser">
      <div class="preview-card">
        <div class="teaser-header">
          <div class="teaser-icon">{{ teaser.iconEmoji || '📦' }}</div>
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
              <li v-for="(item, index) in parseList(teaser.investmentHighlights)" :key="index">
                {{ item }}
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
        </div>
      </div>

      <div class="preview-actions">
        <el-button type="primary" @click="editProject">编辑项目</el-button>
        <el-button @click="downloadTeaser">下载PDF</el-button>
        <el-button @click="shareTeaser">分享链接</el-button>
      </div>

      <div class="preview-stats">
        <div class="stat-item">
          <div class="stat-icon">👁️</div>
          <div class="stat-content">
            <div class="stat-value">{{ teaser.viewCount }}</div>
            <div class="stat-label">浏览次数</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-value">{{ teaser.favoriteCount }}</div>
            <div class="stat-label">收藏次数</div>
          </div>
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
import { ArrowLeft } from '@element-plus/icons-vue'
import * as entrepreneurApi from '@/api/entrepreneur'
import type { Teaser } from '@/types'

const router = useRouter()
const route = useRoute()

const teaser = ref<Teaser | null>(null)

function parseList(text: string): string[] {
  return text.split('\n').filter(line => line.trim())
}

async function loadTeaser() {
  const id = Number(route.params.id)
  if (!id) return

  try {
    const res = await entrepreneurApi.previewTeaser(id)
    teaser.value = res.data
  } catch (error) {
    ElMessage.error('加载失败')
    router.back()
  }
}

function editProject() {
  if (teaser.value) {
    router.push({ name: 'EditProject', params: { id: teaser.value.projectId } })
  }
}

function downloadTeaser() {
  ElMessage.info('下载功能开发中')
}

function shareTeaser() {
  ElMessage.info('分享功能开发中')
}

onMounted(() => {
  loadTeaser()
})
</script>

<style scoped lang="scss">
.teaser-preview-page {
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

.preview-header {
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

.preview-container {
  max-width: 900px;
}

.preview-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-bottom: 24px;
}

.teaser-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  text-align: center;
}

.teaser-icon {
  font-size: 64px;
  margin-bottom: 16px;
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
  justify-content: center;
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
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 16px;
    padding-left: 16px;
    border-left: 4px solid #667eea;
  }

  p {
    font-size: 15px;
    color: #4b5563;
    line-height: 1.8;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  li {
    font-size: 15px;
    color: #4b5563;
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

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}

.preview-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  font-size: 40px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}
</style>
