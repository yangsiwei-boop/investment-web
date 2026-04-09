<template>
  <div class="view-bp-page">
    <div class="back-btn" @click="router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>

    <div class="page-header">
      <h1>商业计划书</h1>
      <p>您已获得查看商业计划书的权限</p>
    </div>

    <div class="bp-viewer" v-if="bpInfo">
      <div class="bp-header">
        <div class="bp-icon">📄</div>
        <div class="bp-info">
          <div class="bp-name">{{ bpInfo.fileName }}</div>
          <div class="bp-meta">
            <span>文件大小: {{ formatSize(bpInfo.fileSize) }}</span>
            <span v-if="bpInfo.pageCount">· {{ bpInfo.pageCount }} 页</span>
          </div>
        </div>
        <el-button type="primary" @click="downloadBP">
          <el-icon><Download /></el-icon>
          下载文件
        </el-button>
      </div>

      <div class="bp-preview">
        <iframe
          v-if="bpInfo.fileUrl"
          :src="bpInfo.fileUrl"
          class="preview-frame"
        ></iframe>
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

const router = useRouter()
const route = useRoute()

const applicationId = Number(route.params.id)
const bpInfo = ref<any>(null)

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

async function loadBP() {
  try {
    // TODO: getBPContent 接口已移除，暂使用 getApplicationDetail 替代
    const res = await investorApi.getApplicationDetail(applicationId)
    bpInfo.value = res.data
  } catch (error) {
    ElMessage.error('加载失败')
    router.back()
  }
}

function downloadBP() {
  if (bpInfo.value?.fileUrl) {
    window.open(bpInfo.value.fileUrl, '_blank')
  }
}

onMounted(() => {
  loadBP()
})
</script>

<style scoped lang="scss">
.view-bp-page {
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

.bp-viewer {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.bp-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 20px;
}

.bp-icon {
  font-size: 40px;
}

.bp-info {
  flex: 1;
}

.bp-name {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.bp-meta {
  font-size: 13px;
  color: #6b7280;
}

.bp-preview {
  background: #f9fafb;
  border-radius: 12px;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-frame {
  width: 100%;
  height: 600px;
  border: none;
  border-radius: 12px;
}
</style>
