<template>
  <div class="apply-bp-page">
    <div class="page-header">
      <h1>申请获取商业计划书</h1>
      <p>向企业申请获取完整的商业计划书</p>
    </div>

    <div class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item prop="applicationReason" label="申请理由">
          <el-input
            v-model="form.applicationReason"
            type="textarea"
            :rows="6"
            placeholder="请说明您对该项目的兴趣原因，以及您作为投资人的背景..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="附加说明（可选）">
          <el-input
            v-model="form.additionalNote"
            type="textarea"
            :rows="3"
            placeholder="其他需要说明的内容..."
          />
        </el-form-item>
      </el-form>

      <div class="info-card">
        <div class="info-icon">📋</div>
        <div class="info-content">
          <h4>申请须知</h4>
          <ul>
            <li>您的申请将发送给企业进行审核</li>
            <li>企业会在3个工作日内处理您的申请</li>
            <li>审核通过后，您可以查看完整的商业计划书</li>
            <li>请尊重企业隐私，不要泄露BP内容</li>
          </ul>
        </div>
      </div>

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
import * as investorApi from '@/api/investor'

const router = useRouter()
const route = useRoute()

const projectId = Number(route.params.id)
const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive({
  applicationReason: '',
  additionalNote: ''
})

const rules: FormRules = {
  applicationReason: [
    { required: true, message: '请输入申请理由', trigger: 'blur' },
    { min: 20, message: '申请理由不能少于20字', trigger: 'blur' }
  ]
}

async function loadProject() {
  try {
    // TODO: 加载项目信息
  } catch (error) {
    console.error('Failed to load project:', error)
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    await investorApi.createApplication({
      teaserId: projectId,
      applicationType: 'get_bp',
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
.apply-bp-page {
  padding-bottom: 40px;
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

.info-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #f0f9ff;
  border-radius: 12px;
  margin-top: 24px;
}

.info-icon {
  font-size: 32px;
}

.info-content {
  flex: 1;

  h4 {
    font-size: 15px;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 12px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      font-size: 13px;
      color: #3b82f6;
      padding: 6px 0;
      padding-left: 16px;
      position: relative;

      &::before {
        content: "•";
        position: absolute;
        left: 0;
        color: #3b82f6;
      }
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}
</style>
