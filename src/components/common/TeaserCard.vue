<template>
  <div class="teaser-card" @click="handleClick">
    <div class="card-header">
      <div class="card-icon">{{ teaser.iconEmoji || '📦' }}</div>
      <div class="card-actions">
        <el-tooltip :content="isFavorite ? '取消收藏' : '收藏'" placement="top">
          <div
            class="action-icon"
            :class="{ active: isFavorite }"
            @click.stop="toggleFavorite"
          >
            <el-icon><Star /></el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="分享" placement="top">
          <div class="action-icon" @click.stop="handleShare">
            <el-icon><Share /></el-icon>
          </div>
        </el-tooltip>
      </div>
    </div>

    <div class="card-title">{{ teaser.title }}</div>
    <div class="card-desc">{{ teaser.summary }}</div>

    <div class="card-tags">
      <span v-for="tag in displayTags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <div class="card-meta">
      <div class="meta-item">
        <el-icon><Calendar /></el-icon>
        <span>{{ formatTime(teaser.createdAt) }}</span>
      </div>
      <div class="meta-item">
        <el-icon><View /></el-icon>
        <span>{{ teaser.viewCount }}次</span>
      </div>
      <div
        class="match-score"
        :class="matchScoreClass"
        v-if="matchScore !== undefined"
      >
        匹配度 {{ matchScore }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Star, Share, Calendar, View } from '@element-plus/icons-vue'
import type { Teaser } from '@/types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Props {
  teaser: Teaser
  matchScore?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  favorite: [teaserId: number]
  unfavorite: [teaserId: number]
  share: [teaser: Teaser]
}>()

const router = useRouter()
const isFavorite = ref(false)

const displayTags = computed(() => {
  if (!props.teaser.tags) return []
  return props.teaser.tags.slice(0, 4)
})

const matchScoreClass = computed(() => {
  if (!props.matchScore) return 'low'
  if (props.matchScore >= 80) return 'high'
  if (props.matchScore >= 60) return 'medium'
  return 'low'
})

function formatTime(time: string): string {
  return dayjs(time).fromNow()
}

function handleClick() {
  router.push({ name: 'TeaserDetail', params: { id: props.teaser.id } })
}

function toggleFavorite() {
  if (isFavorite.value) {
    emit('unfavorite', props.teaser.id)
  } else {
    emit('favorite', props.teaser.id)
  }
  isFavorite.value = !isFavorite.value
}

function handleShare() {
  emit('share', props.teaser)
}
</script>

<style scoped lang="scss">
.teaser-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    border-color: #667eea;
  }
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.action-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f3f4f6;
  }

  &.active {
    background: #fef3c7;
    color: #f59e0b;
  }
}

.card-title {
  color: #111827;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.card-desc {
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  padding: 4px 10px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.match-score {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;

  &.high {
    background: #ecfdf5;
    color: #10b981;
  }

  &.medium {
    background: #fef3c7;
    color: #f59e0b;
  }

  &.low {
    background: #fef2f2;
    color: #ef4444;
  }
}
</style>
