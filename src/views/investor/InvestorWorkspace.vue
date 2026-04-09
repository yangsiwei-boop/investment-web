<template>
  <div class="investor-workspace">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h2>👋 欢迎回来，{{ userName }}</h2>
      <p>发现优质项目，把握投资机遇</p>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">已浏览Teaser</div>
          <div class="value">{{ stats.viewedCount }}</div>
        </div>
        <div class="stat-card">
          <div class="label">收藏项目</div>
          <div class="value">{{ stats.favoriteCount }}</div>
        </div>
        <div class="stat-card">
          <div class="label">已分析项目</div>
          <div class="value">{{ stats.analyzedCount }}</div>
        </div>
        <div class="stat-card">
          <div class="label">待处理</div>
          <div class="value">{{ stats.pendingCount }}</div>
        </div>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-header">
        <h3>🔍 搜索投资机会</h3>
      </div>
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="输入关键词搜索，如：人工智能、SaaS、A轮..."
          size="large"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" size="large" @click="handleSearch">
          搜索
        </el-button>
      </div>
      <div class="filter-tags">
        <span
          v-for="tag in filterTags"
          :key="tag.value"
          class="filter-tag"
          :class="{ active: selectedTags.includes(tag.value) }"
          @click="toggleTag(tag.value)"
        >
          {{ tag.label }}
        </span>
      </div>
    </div>

    <!-- 推荐项目 -->
    <div class="section">
      <div class="section-header">
        <h3>📊 推荐项目</h3>
        <router-link to="/investor/search" class="view-all">
          查看全部 →
        </router-link>
      </div>
      <div class="teaser-grid" v-if="recommendedTeasers.length > 0">
        <TeaserCard
          v-for="teaser in recommendedTeasers"
          :key="teaser.id"
          :teaser="teaser"
          :match-score="teaser.matchScore"
          @favorite="handleFavorite"
          @unfavorite="handleUnfavorite"
        />
      </div>
      <EmptyState
        v-else
        icon="📭"
        title="暂无推荐项目"
        description="完善您的投资偏好，获取更精准的推荐"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import TeaserCard from '@/components/common/TeaserCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import * as investorApi from '@/api/investor'
import type { DashboardStats } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.realName || '投资人')

const stats = ref<DashboardStats>({
  viewedCount: 0,
  favoriteCount: 0,
  analyzedCount: 0,
  pendingCount: 0
})

const searchKeyword = ref('')
const selectedTags = ref<string[]>(['all'])
const recommendedTeasers = ref<any[]>([])

const filterTags = [
  { label: '全部', value: 'all' },
  { label: '企业服务', value: 'enterprise_service' },
  { label: '人工智能', value: 'ai' },
  { label: '金融科技', value: 'fintech' },
  { label: '医疗健康', value: 'healthcare' },
  { label: '消费零售', value: 'consumer' },
  { label: 'A轮', value: 'a' },
  { label: '天使轮', value: 'angel' },
  { label: 'B轮', value: 'b' }
]

function toggleTag(tagValue: string) {
  if (tagValue === 'all') {
    selectedTags.value = ['all']
  } else {
    const index = selectedTags.value.indexOf('all')
    if (index > -1) {
      selectedTags.value.splice(index, 1)
    }

    const tagIndex = selectedTags.value.indexOf(tagValue)
    if (tagIndex > -1) {
      selectedTags.value.splice(tagIndex, 1)
      if (selectedTags.value.length === 0) {
        selectedTags.value = ['all']
      }
    } else {
      selectedTags.value.push(tagValue)
    }
  }
}

function handleSearch() {
  router.push({
    path: '/investor/search',
    query: {
      keyword: searchKeyword.value,
      tags: selectedTags.value.filter(t => t !== 'all').join(',')
    }
  })
}

async function handleFavorite(teaserId: number) {
  try {
    await investorApi.addFavorite({ teaserId })
    ElMessage.success('已收藏')
  } catch (error) {
    ElMessage.error('收藏失败')
  }
}

async function handleUnfavorite(teaserId: number) {
  try {
    await investorApi.removeFavorite(teaserId)
    ElMessage.success('已取消收藏')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

async function loadData() {
  try {
    // 加载统计数据
    const statsRes = await investorApi.getInvestorStats()
    stats.value = statsRes.data

    // 加载推荐项目
    const teasersRes = await investorApi.getRecommendedProjects(6)
    recommendedTeasers.value = teasersRes.data || []
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.investor-workspace {
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

.search-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
}

.search-header {
  margin-bottom: 20px;

  h3 {
    color: #374151;
    font-size: 20px;
    font-weight: 600;
  }
}

.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  .el-input {
    flex: 1;
  }

  .el-button {
    width: 100px;
  }
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-tag {
  padding: 8px 16px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e5e7eb;
  }

  &.active {
    background: #f5f3ff;
    color: #667eea;
    font-weight: 600;
  }
}

.section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

.teaser-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}
</style>
