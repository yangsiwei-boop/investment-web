<template>
  <div class="public-qa-page">
    <div class="back-btn" @click="router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>

    <div class="page-header">
      <h1>公开问答</h1>
      <p>查看企业与投资人的问答交流</p>
    </div>

    <div class="qa-list" v-if="qaRecords.length > 0">
      <div v-for="record in qaRecords" :key="record.id" class="qa-item">
        <div class="question">
          <div class="qa-header">
            <span class="qa-label">Q</span>
            <span class="qa-user">投资人 · {{ formatDate(record.sentAt) }}</span>
          </div>
          <div class="qa-content">{{ record.question }}</div>
        </div>

        <div class="answer" v-if="record.answer">
          <div class="qa-header">
            <span class="qa-label answer-label">A</span>
            <span class="qa-user">企业回复 · {{ formatDate(record.answeredAt!) }}</span>
          </div>
          <div class="qa-content">{{ record.answer }}</div>
        </div>
      </div>
    </div>

    <EmptyState
      v-else-if="!loading"
      icon="💬"
      title="暂无公开问答"
      description="该企业暂未公开任何问答"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import EmptyState from '@/components/common/EmptyState.vue'
import * as investorApi from '@/api/investor'
import type { QARecord } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const teaserId = Number(route.params.id)
const loading = ref(false)
const qaRecords = ref<QARecord[]>([])

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD')
}

async function loadQA() {
  loading.value = true
  try {
    const res = await investorApi.getPublicQA(teaserId)
    qaRecords.value = res.data
  } catch (error) {
    console.error('Failed to load QA:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadQA()
})
</script>

<style scoped lang="scss">
.public-qa-page {
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

.qa-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.qa-item {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.question,
.answer {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.qa-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.qa-label {
  width: 28px;
  height: 28px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

.answer-label {
  background: #10b981;
}

.qa-user {
  font-size: 13px;
  color: #6b7280;
}

.qa-content {
  font-size: 15px;
  color: #374151;
  line-height: 1.8;
  padding-left: 40px;
}
</style>
