<template>
  <div class="apply-contact-page">
    <div class="back-btn" @click="router.back()">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>

    <div class="page-header">
      <h1>申请联系企业</h1>
      <p>向企业申请获取联系方式</p>
    </div>

    <div class="form-container">
      <div class="teaser-card" v-if="teaser">
        <div class="teaser-icon">{{ teaser.iconEmoji || '📋' }}</div>
        <div class="teaser-info">
          <div class="teaser-title">{{ teaser.title }}</div>
          <div class="teaser-meta">
            <span v-if="teaser.industry">{{ teaser.industry }}</span>
            <span v-if="teaser.financingStage">{{ teaser.financingStage }}</span>
          </div>
        </div>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item prop="contactInfo" label="您的联系方式">
          <el-input
            v-model="form.contactInfo"
            type="textarea"
            :rows="3"
            placeholder="请留下您的联系方式（手机/微信/邮箱）..."
          />
        </el-form-item>

        <el-form-item prop="applicationReason" label="申请理由">
          <el-input
            v-model="form.applicationReason"
            type="textarea"
            :rows="6"
            placeholder="请说明您希望联系企业洽谈的原因..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <div class="form-actions">
        <el-button size="large" @click="router.back()">取消</el-button>
        <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
          提交申请
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import * as investorApi from '@/api/investor'
import type { Teaser } from '@/types'

const router = useRouter()
const route = useRoute()

const projectId = Number(route.params.id)
const formRef = ref<FormInstance>()
const submitting = ref(false)
const teaser = ref<Teaser | null>(null)

const form = reactive({
  contactInfo: '',
  applicationReason: ''
})

const rules: FormRules = {
  contactInfo: [
    { required: true, message: '请输入您的联系方式', trigger: 'blur' }
  ],
  applicationReason: [
    { required: true, message: '请输入申请理由', trigger: 'blur' },
    { min: 20, message: '申请理由不能少于20字', trigger: 'blur' }
  ]
}

async function loadProject() {
  try {
    const res = await investorApi.getTeaserDetail(projectId)
    teaser.value = res.data
  } catch (error) {
    console.error('Failed to load teaser:', error)
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    await investorApi.createApplication({
      teaserId: projectId,
      applicationType: 'contact_company',
      reason: form.applicationReason
    })

    ElMessage.success('申请已提交')
    router.back()
  } catch (error: any) {
    ElMessage.error(error.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadProject()
})
</script>

<style scoped lang="scss">
.apply-contact-page {
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

.form-container {
  max-width: 700px;
}

.teaser-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.teaser-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.teaser-info {
  flex: 1;
}

.teaser-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
}

.teaser-meta {
  display: flex;
  gap: 8px;

  span {
    padding: 2px 8px;
    background: #f3f4f6;
    color: #6b7280;
    border-radius: 4px;
    font-size: 12px;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}
</style>
