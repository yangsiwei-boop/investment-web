<template>
  <div class="search-teaser-page">
    <div class="search-header">
      <el-input
        v-model="keyword"
        placeholder="搜索项目名称、行业、关键词..."
        size="large"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" size="large" @click="handleSearch">搜索</el-button>
    </div>

    <div class="filter-section">
      <div class="filter-group">
        <span class="filter-label">行业：</span>
        <div class="filter-options">
          <span
            v-for="industry in industries"
            :key="industry.value"
            class="filter-option"
            :class="{ active: filters.industry === industry.value }"
            @click="filters.industry = industry.value"
          >
            {{ industry.label }}
          </span>
        </div>
      </div>

      <div class="filter-group">
        <span class="filter-label">阶段：</span>
        <div class="filter-options">
          <span
            v-for="stage in stages"
            :key="stage.value"
            class="filter-option"
            :class="{ active: filters.stage === stage.value }"
            @click="filters.stage = stage.value"
          >
            {{ stage.label }}
          </span>
        </div>
      </div>
    </div>

    <div class="results-section">
      <div class="results-header">
        <span class="results-count">共找到 {{ total }} 个项目</span>
        <el-select v-model="sortBy" placeholder="排序方式" size="small">
          <el-option label="最新发布" value="latest" />
          <el-option label="匹配度最高" value="match" />
          <el-option label="浏览量最高" value="views" />
        </el-select>
      </div>

      <div class="teaser-grid" v-if="teasers.length > 0">
        <TeaserCard
          v-for="teaser in teasers"
          :key="teaser.id"
          :teaser="teaser"
          :match-score="teaser.matchScore"
          @favorite="handleFavorite"
          @unfavorite="handleUnfavorite"
        />
      </div>

      <EmptyState
        v-else-if="!loading"
        icon="🔍"
        title="未找到相关项目"
        description="尝试调整搜索条件或筛选器"
      />

      <div class="pagination" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import TeaserCard from '@/components/common/TeaserCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import * as investorApi from '@/api/investor'
import type { Teaser } from '@/types'

const route = useRoute()

const keyword = ref('')
const loading = ref(false)
const teasers = ref<Teaser[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 12
const sortBy = ref('latest')

const filters = reactive({
  industry: '',
  stage: ''
})

const industries = [
  { label: '全部', value: '' },
  { label: '企业服务', value: 'enterprise_service' },
  { label: '人工智能', value: 'ai' },
  { label: '金融科技', value: 'fintech' },
  { label: '医疗健康', value: 'healthcare' },
  { label: '消费零售', value: 'consumer' },
  { label: '新能源', value: 'new_energy' },
  { label: '教育', value: 'education' },
  { label: '娱乐', value: 'entertainment' },
  { label: '制造', value: 'manufacturing' }
]

const stages = [
  { label: '全部', value: '' },
  { label: '种子轮', value: 'seed' },
  { label: '天使轮', value: 'angel' },
  { label: 'A轮', value: 'a' },
  { label: 'B轮', value: 'b' },
  { label: 'C轮', value: 'c' },
  { label: 'D轮及以上', value: 'd' }
]

async function handleSearch() {
  currentPage.value = 1
  await loadTeasers()
}

async function loadTeasers() {
  loading.value = true
  try {
    const res = await investorApi.searchTeasers({
      keyword: keyword.value,
      industries: filters.industry ? [filters.industry] : undefined,
      financingStages: filters.stage ? [filters.stage] : undefined,
      page: currentPage.value,
      pageSize
    })
    teasers.value = res.data.content ?? []
    total.value = res.data.totalElements ?? 0
  } catch (error) {
    console.error('Failed to load teasers:', error)
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  currentPage.value = page
  loadTeasers()
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

// 监听筛选条件变化
watch([() => filters.industry, () => filters.stage], () => {
  currentPage.value = 1
  loadTeasers()
})

onMounted(() => {
  // 从URL参数读取搜索条件
  if (route.query.keyword) {
    keyword.value = route.query.keyword as string
  }
  if (route.query.tags) {
    const tags = (route.query.tags as string).split(',')
    if (tags.length > 0 && tags[0]) {
      // 尝试匹配行业或阶段
      const industry = industries.find(i => i.value === tags[0])
      if (industry) {
        filters.industry = tags[0]
      } else {
        const stage = stages.find(s => s.value === tags[0])
        if (stage) {
          filters.stage = tags[0]
        }
      }
    }
  }

  loadTeasers()
})
</script>

<style scoped lang="scss">
.search-teaser-page {
  padding-bottom: 40px;
}

.search-header {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;

  .el-input {
    flex: 1;
  }

  .el-button {
    width: 100px;
  }
}

.filter-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-group {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter-label {
  font-size: 14px;
  color: #6b7280;
  min-width: 60px;
  padding-top: 6px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-option {
  padding: 6px 14px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 16px;
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

.results-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.results-count {
  font-size: 14px;
  color: #6b7280;
}

.teaser-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
