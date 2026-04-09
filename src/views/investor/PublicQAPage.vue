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
      <div v-for="record in qaRecords" :key="record.id" class="qa-conversation">
        <div class="conv-header">
          <span class="conv-project">{{ record.teaserTitle || record.projectName }}</span>
          <span class="conv-time">{{ formatDate(record.questionedAt || record.createdAt) }}</span>
        </div>

        <div class="conv-thread" v-if="record.replies && record.replies.length > 0">
          <div
            v-for="reply in record.replies"
            :key="reply.id"
            class="chat-bubble"
            :class="reply.userType === 'INVESTOR' ? 'left' : 'right'"
          >
            <div class="bubble-meta">
              <span class="bubble-name">{{ reply.userName }}</span>
              <span class="bubble-time">{{ formatDate(reply.createdAt) }}</span>
            </div>
            <div class="bubble-text">{{ reply.content }}</div>
          </div>
        </div>

        <!-- Fallback: if no replies but has question/answer -->
        <div v-else class="simple-qa">
          <div class="qa-q">
            <strong>问：</strong>{{ record.question }}
          </div>
          <div class="qa-a" v-if="record.answer">
            <strong>答：</strong>{{ record.answer }}
          </div>
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

function formatDate(date: string | undefined): string {
  return date ? dayjs(date).format('YYYY-MM-DD') : ''
}

async function loadQA() {
  loading.value = true
  try {
    const res = await investorApi.getQAList({ page: 1, size: 50 })
    let records = (res.data.content || []).filter((item: any) => item.isPublic)
    if (teaserId) {
      records = records.filter((item: any) => item.teaserId === teaserId)
    }
    qaRecords.value = records
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
  gap: 16px;
}

.qa-conversation {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;

  .conv-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f3f4f6;

    .conv-project {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .conv-time {
      font-size: 13px;
      color: #9ca3af;
    }
  }
}

.conv-thread {
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;

  .chat-bubble {
    max-width: 75%;
    margin-bottom: 16px;
    padding: 12px 16px;
    border-radius: 12px;

    &.left {
      margin-right: auto;
      background: white;
      border: 1px solid #e5e7eb;

      .bubble-name {
        color: #6b7280;
      }
    }

    &.right {
      margin-left: auto;
      background: #eff6ff;
      border: 1px solid #bfdbfe;

      .bubble-name {
        color: #2563eb;
      }
    }

    .bubble-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;

      .bubble-name {
        font-size: 12px;
        font-weight: 600;
      }

      .bubble-time {
        font-size: 11px;
        color: #9ca3af;
      }
    }

    .bubble-text {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
    }
  }
}

.simple-qa {
  .qa-q,
  .qa-a {
    font-size: 14px;
    line-height: 1.6;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .qa-q {
    background: #f9fafb;
    color: #374151;
  }

  .qa-a {
    background: #ecfdf5;
    color: #374151;
  }
}
</style>
