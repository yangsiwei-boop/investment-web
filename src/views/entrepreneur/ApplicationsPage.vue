<template>
  <div class="applications-page">
    <div class="page-header">
      <h1>申请管理</h1>
      <p>审核投资人获取BP或联系方式的申请</p>
    </div>

    <div class="filter-bar">
      <el-radio-group v-model="typeFilter" @change="loadApplications">
        <el-radio-button value="">全部申请</el-radio-button>
        <el-radio-button value="get_bp">获取BP</el-radio-button>
        <el-radio-button value="contact_company">联系企业</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="statusFilter" @change="loadApplications">
        <el-radio-button value="">全部状态</el-radio-button>
        <el-radio-button value="pending">待审核</el-radio-button>
        <el-radio-button value="approved">已通过</el-radio-button>
        <el-radio-button value="rejected">已拒绝</el-radio-button>
      </el-radio-group>
    </div>

    <div class="application-list" v-if="applications.length > 0">
      <div v-for="app in applications" :key="app.id" class="application-item">
        <div class="application-header">
          <div class="investor-info">
            <el-avatar :size="48">{{ app.investorName?.charAt(0) || '投' }}</el-avatar>
            <div class="investor-details">
              <div class="investor-name">{{ app.investorName || '投资人' }}</div>
              <div class="investor-meta">
                <span class="institution">{{ app.investorInstitution || '独立投资人' }}</span>
                <span class="divider">·</span>
                <span class="position">{{ app.investorPosition || '' }}</span>
              </div>
            </div>
          </div>
          <div class="application-meta">
            <el-tag :type="getTypeTagType(app.applicationType)" size="small">
              {{ getTypeLabel(app.applicationType) }}
            </el-tag>
            <el-tag :type="getStatusType(app.applicationStatus)" size="small" class="ml-2">
              {{ getStatusLabel(app.applicationStatus) }}
            </el-tag>
          </div>
        </div>

        <div class="application-content">
          <div class="application-reason" v-if="app.applicationReason">
            <div class="label">申请理由</div>
            <div class="text">{{ app.applicationReason }}</div>
          </div>

          <div class="contact-info" v-if="app.contactInfo">
            <div class="label">联系方式</div>
            <div class="text">{{ app.contactInfo }}</div>
          </div>

          <div class="rejection-reason" v-if="app.rejectionReason">
            <div class="label">拒绝原因</div>
            <div class="text">{{ app.rejectionReason }}</div>
          </div>
        </div>

        <div class="application-footer">
          <div class="application-time">
            申请时间: {{ formatDate(app.createdAt) }}
          </div>
          <div class="application-actions" v-if="app.applicationStatus === 'pending'">
            <el-button type="primary" @click="approveApplication(app)">通过</el-button>
            <el-button type="danger" @click="showRejectDialog(app)">拒绝</el-button>
          </div>
          <div class="reviewed-info" v-else-if="app.reviewedAt">
            {{ app.applicationStatus === 'approved' ? '审核通过' : '审核拒绝' }}:
            {{ formatDate(app.reviewedAt) }}
          </div>
        </div>
      </div>
    </div>

    <EmptyState
      v-else-if="!loading"
      icon="📋"
      title="暂无申请"
      description="投资人的申请将显示在这里"
    />

    <!-- 拒绝对话框 -->
    <el-dialog v-model="rejectDialogVisible" title="拒绝申请" width="500px">
      <el-form :model="rejectForm" label-position="top">
        <el-form-item label="拒绝原因">
          <el-input
            v-model="rejectForm.rejectionReason"
            type="textarea"
            :rows="4"
            placeholder="请说明拒绝原因（选填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="rejecting" @click="rejectApplication">
          确认拒绝
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import EmptyState from '@/components/common/EmptyState.vue'
import * as entrepreneurApi from '@/api/entrepreneur'
import type { Application } from '@/types'
import dayjs from 'dayjs'

const loading = ref(false)
const applications = ref<Application[]>([])
const typeFilter = ref('')
const statusFilter = ref('')

const rejectDialogVisible = ref(false)
const currentApplication = ref<Application | null>(null)
const rejecting = ref(false)

const rejectForm = ref({
  rejectionReason: ''
})

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'get_bp':
      return '获取BP'
    case 'contact_company':
      return '联系企业'
    case 'view_contact':
      return '查看联系方式'
    default:
      return type
  }
}

function getTypeTagType(type: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  switch (type) {
    case 'get_bp':
      return 'success'
    case 'contact_company':
      return 'warning'
    case 'view_contact':
      return 'info'
    default:
      return ''
  }
}

function getStatusType(status: string) {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'approved':
      return 'success'
    case 'rejected':
      return 'danger'
    case 'cancelled':
      return 'info'
    default:
      return ''
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return '待审核'
    case 'approved':
      return '已通过'
    case 'rejected':
      return '已拒绝'
    case 'cancelled':
      return '已取消'
    default:
      return status
  }
}

async function approveApplication(app: Application) {
  try {
    await entrepreneurApi.reviewApplication(app.id, { status: 'approved' })
    ElMessage.success('已通过申请')
    loadApplications()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

function showRejectDialog(app: Application) {
  currentApplication.value = app
  rejectForm.value.rejectionReason = ''
  rejectDialogVisible.value = true
}

async function rejectApplication() {
  if (!currentApplication.value) return

  rejecting.value = true
  try {
    await entrepreneurApi.reviewApplication(currentApplication.value.id, {
      status: 'rejected',
      rejectionReason: rejectForm.value.rejectionReason
    })
    ElMessage.success('已拒绝申请')
    rejectDialogVisible.value = false
    loadApplications()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    rejecting.value = false
  }
}

async function loadApplications() {
  loading.value = true
  try {
    const res = await entrepreneurApi.getReceivedApplications({
      type: typeFilter.value as any,
      status: statusFilter.value as any
    })
    applications.value = res.data.items || res.data
  } catch (error) {
    console.error('Failed to load applications:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadApplications()
})
</script>

<style scoped lang="scss">
.applications-page {
  padding-bottom: 40px;
}

.page-header {
  margin-bottom: 24px;

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

.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.application-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.application-item {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.investor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.investor-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.investor-meta {
  font-size: 13px;
  color: #6b7280;

  .divider {
    margin: 0 8px;
  }
}

.application-meta {
  display: flex;
  align-items: center;
}

.ml-2 {
  margin-left: 8px;
}

.application-content {
  margin-bottom: 20px;
}

.application-reason,
.contact-info,
.rejection-reason {
  margin-bottom: 16px;

  .label {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 8px;
  }

  .text {
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
    padding: 12px 16px;
    background: #f9fafb;
    border-radius: 8px;
  }
}

.rejection-reason .text {
  background: #fef2f2;
}

.application-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.application-time {
  font-size: 13px;
  color: #9ca3af;
}

.application-actions {
  display: flex;
  gap: 8px;
}

.reviewed-info {
  font-size: 13px;
  color: #6b7280;
}
</style>
