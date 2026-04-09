<template>
  <div class="verify-page">
    <div class="verify-container">
      <div class="header">
        <h1>身份验证</h1>
        <p>上传相关资料，完成身份认证</p>
        <div class="role-badge">{{ userTypeLabel }}</div>
      </div>

      <div class="progress">
        <div class="progress-step" :class="{ completed: true }"></div>
        <div class="progress-step" :class="{ completed: true }"></div>
        <div class="progress-step active"></div>
      </div>

      <div class="verification-info">
        <div class="info-title">
          <span>ℹ️</span>
          <span>身份验证说明</span>
        </div>
        <div class="info-content">
          为确保平台安全和信息真实性，请上传以下资料：
          <ul>
            <li>名片：用于确认您的职业身份</li>
            <li>企业营业执照：用于验证企业真实性</li>
            <li>实名认证：通过身份证完成个人实名验证</li>
          </ul>
        </div>
      </div>

      <!-- 步骤1：上传名片 -->
      <div class="upload-section">
        <div class="section-title">
          <div class="step">1</div>
          <span>上传名片</span>
        </div>
        <FileUpload
          ref="cardUploadRef"
          title="点击或拖拽上传名片"
          description="支持 JPG、PNG、PDF 格式"
          hint="文件大小不超过 5MB"
          icon="📇"
          accept=".jpg,.jpeg,.png,.pdf"
          :max-size="5"
          @upload="handleCardUpload"
          @remove="cardFile = null"
        />
      </div>

      <!-- 步骤2：上传企业营业执照 -->
      <div class="upload-section">
        <div class="section-title">
          <div class="step">2</div>
          <span>上传企业营业执照</span>
        </div>
        <FileUpload
          ref="licenseUploadRef"
          title="点击或拖拽上传营业执照"
          description="支持 JPG、PNG、PDF 格式"
          hint="文件大小不超过 5MB"
          icon="📄"
          accept=".jpg,.jpeg,.png,.pdf"
          :max-size="5"
          @upload="handleLicenseUpload"
          @remove="licenseFile = null"
        />
      </div>

      <!-- 步骤3：实名认证 -->
      <div class="upload-section">
        <div class="section-title">
          <div class="step">3</div>
          <span>实名认证</span>
        </div>
        <div class="id-card-upload">
          <FileUpload
            ref="idFrontUploadRef"
            title="身份证正面"
            description="点击上传"
            accept=".jpg,.jpeg,.png"
            :max-size="5"
            icon="🪪"
            @upload="handleIdFrontUpload"
            @remove="idFrontFile = null"
          />
          <FileUpload
            ref="idBackUploadRef"
            title="身份证背面"
            description="点击上传"
            accept=".jpg,.jpeg,.png"
            :max-size="5"
            icon="🪪"
            @upload="handleIdBackUpload"
            @remove="idBackFile = null"
          />
        </div>
      </div>

      <div class="form-section">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="realName" label="真实姓名">
                <el-input v-model="form.realName" placeholder="请输入真实姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="idCardNumber" label="身份证号">
                <el-input v-model="form.idCardNumber" placeholder="请输入身份证号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="companyName" label="公司名称">
                <el-input v-model="form.companyName" placeholder="请输入公司名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="position" label="职位">
                <el-input v-model="form.position" placeholder="请输入职位" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="btn-group">
        <el-button size="large" @click="router.back()">上一步</el-button>
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="handleSubmit"
        >
          提交审核
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import FileUpload from '@/components/common/FileUpload.vue'
import * as authApi from '@/api/auth'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const cardFile = ref<File | null>(null)
const licenseFile = ref<File | null>(null)
const idFrontFile = ref<File | null>(null)
const idBackFile = ref<File | null>(null)

const userTypeLabel = computed(() => {
  return authStore.user?.userType === 'INVESTOR' ? '投资人' : '融资用户'
})

const form = reactive({
  realName: '',
  idCardNumber: '',
  companyName: '',
  position: ''
})

const rules: FormRules = {
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  idCardNumber: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' }
  ],
  companyName: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请输入职位', trigger: 'blur' }
  ]
}

function handleCardUpload(file: File) {
  cardFile.value = file
}

function handleLicenseUpload(file: File) {
  licenseFile.value = file
}

function handleIdFrontUpload(file: File) {
  idFrontFile.value = file
}

function handleIdBackUpload(file: File) {
  idBackFile.value = file
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 检查文件是否上传
    if (!licenseFile.value) {
      ElMessage.warning('请上传企业营业执照')
      return
    }
    if (!idFrontFile.value || !idBackFile.value) {
      ElMessage.warning('请上传身份证正反面')
      return
    }

    loading.value = true

    // 上传文件
    const [licenseRes, idFrontRes, idBackRes] = await Promise.all([
      authApi.uploadImage(licenseFile.value, 'verification'),
      authApi.uploadImage(idFrontFile.value, 'verification'),
      authApi.uploadImage(idBackFile.value, 'verification')
    ])

    // 提交验证
    await authApi.submitVerification({
      realName: form.realName,
      idCardNumber: form.idCardNumber,
      idCardFrontUrl: idFrontRes.data.fileUrl,
      idCardBackUrl: idBackRes.data.fileUrl,
      businessLicenseUrl: licenseRes.data.fileUrl,
      verificationType: authStore.user?.userType === 'INVESTOR' ? 'investor' : 'entrepreneur',
      companyName: form.companyName
    })

    ElMessage.success('提交成功，请等待审核')

    // 跳转到工作台
    if (authStore.user?.userType === 'INVESTOR') {
      router.push({ name: 'InvestorHome' })
    } else {
      router.push({ name: 'EntrepreneurHome' })
    }
  } catch (error: any) {
    ElMessage.error(error.message || '提交失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.verify-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.verify-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 640px;
  padding: 40px;
}

.header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    color: #667eea;
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    color: #6b7280;
    font-size: 14px;
  }
}

.role-badge {
  display: inline-block;
  padding: 6px 16px;
  background: #f5f3ff;
  color: #667eea;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-top: 8px;
}

.progress {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
}

.progress-step {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;

  &.active {
    background: #667eea;
  }

  &.completed {
    background: #10b981;
  }
}

.verification-info {
  background: #eff6ff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 24px;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e40af;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.info-content {
  color: #3b82f6;
  font-size: 13px;
  line-height: 1.6;

  ul {
    margin-left: 20px;
    margin-top: 8px;
  }
}

.upload-section {
  margin-bottom: 28px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #374151;
  font-size: 16px;
  font-weight: 600;

  .step {
    width: 28px;
    height: 28px;
    background: #667eea;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
  }
}

.id-card-upload {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 32px;

  .el-button {
    flex: 1;
    height: 48px;
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
