<template>
  <div class="edit-project-page">
    <div class="page-header">
      <h1>{{ isEdit ? '编辑项目' : '创建项目' }}</h1>
      <p>完善项目信息，让投资人更好地了解您的企业</p>
    </div>

    <div class="form-container" v-if="form">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <h3>基本信息</h3>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="projectName" label="项目名称">
                <el-input v-model="form.projectName" placeholder="请输入项目名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="industry" label="所属行业">
                <el-select v-model="form.industry" placeholder="选择行业">
                  <el-option label="企业服务" value="enterprise_service" />
                  <el-option label="人工智能" value="ai" />
                  <el-option label="金融科技" value="fintech" />
                  <el-option label="医疗健康" value="healthcare" />
                  <el-option label="消费零售" value="consumer" />
                  <el-option label="新能源" value="new_energy" />
                  <el-option label="教育" value="education" />
                  <el-option label="娱乐" value="entertainment" />
                  <el-option label="制造" value="manufacturing" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item prop="oneLineDescription" label="一句话描述">
            <el-input
              v-model="form.oneLineDescription"
              placeholder="用一句话描述您的项目（50字以内）"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>

          <el-form-item prop="businessDescription" label="业务描述">
            <el-input
              v-model="form.businessDescription"
              type="textarea"
              :rows="4"
              placeholder="详细描述您的业务模式、产品服务..."
            />
          </el-form-item>
        </div>

        <!-- 公司信息 -->
        <div class="form-section">
          <h3>公司信息</h3>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="location" label="项目所在地">
                <el-input v-model="form.location" placeholder="如：北京" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="companyFoundedDate" label="成立时间">
                <el-date-picker
                  v-model="form.companyFoundedDate"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="teamSize" label="团队规模">
                <el-input v-model.number="form.teamSize" type="number" placeholder="人数" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item prop="officeAddress" label="办公地址">
            <el-input v-model="form.officeAddress" placeholder="详细办公地址" />
          </el-form-item>

          <el-form-item prop="companyWebsite" label="公司官网">
            <el-input v-model="form.companyWebsite" placeholder="https://..." />
          </el-form-item>
        </div>

        <!-- 融资信息 -->
        <div class="form-section">
          <h3>融资信息</h3>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="financingStage" label="融资阶段">
                <el-select v-model="form.financingStage" placeholder="选择阶段">
                  <el-option label="种子轮" value="seed" />
                  <el-option label="天使轮" value="angel" />
                  <el-option label="A轮" value="a" />
                  <el-option label="B轮" value="b" />
                  <el-option label="C轮" value="c" />
                  <el-option label="D轮及以上" value="d" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="financingAmount" label="融资金额（万元）">
                <el-input v-model.number="form.financingAmount" type="number" placeholder="金额" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="equityPercentage" label="出让股权（%）">
                <el-input v-model.number="form.equityPercentage" type="number" placeholder="比例" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item prop="financingHistory" label="融资历史">
            <el-input
              v-model="form.financingHistory"
              type="textarea"
              :rows="3"
              placeholder="描述历史融资情况..."
            />
          </el-form-item>
        </div>

        <!-- 业务详情 -->
        <div class="form-section">
          <h3>业务详情</h3>

          <el-form-item prop="marketSize" label="市场规模">
            <el-input
              v-model="form.marketSize"
              type="textarea"
              :rows="3"
              placeholder="描述目标市场规模、市场增长率等..."
            />
          </el-form-item>

          <el-form-item prop="competitiveAdvantage" label="竞争优势">
            <el-input
              v-model="form.competitiveAdvantage"
              type="textarea"
              :rows="3"
              placeholder="描述您的核心竞争优势..."
            />
          </el-form-item>

          <el-form-item prop="businessModel" label="商业模式">
            <el-input
              v-model="form.businessModel"
              type="textarea"
              :rows="3"
              placeholder="描述您的商业模式、盈利方式..."
            />
          </el-form-item>
        </div>

        <!-- 财务数据 -->
        <div class="form-section">
          <h3>财务数据</h3>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="revenueYtd" label="当年营收（万元）">
                <el-input v-model.number="form.revenueYtd" type="number" placeholder="金额" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="revenueLastYear" label="去年营收（万元）">
                <el-input v-model.number="form.revenueLastYear" type="number" placeholder="金额" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="grossMargin" label="毛利率（%）">
                <el-input v-model.number="form.grossMargin" type="number" placeholder="比例" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 联系方式 -->
        <div class="form-section">
          <h3>联系方式</h3>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="contactPerson" label="联系人">
                <el-input v-model="form.contactPerson" placeholder="联系人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="contactPhone" label="联系电话">
                <el-input v-model="form.contactPhone" placeholder="电话号码" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="contactEmail" label="联系邮箱">
                <el-input v-model="form.contactEmail" placeholder="邮箱地址" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 匿名设置 -->
        <div class="form-section">
          <h3>隐私设置</h3>

          <el-form-item>
            <el-checkbox v-model="form.isAnonymous">
              匿名显示（Teaser中将隐藏公司真实名称）
            </el-checkbox>
          </el-form-item>
        </div>

        <div class="form-actions">
          <el-button size="large" @click="router.back()">取消</el-button>
          <el-button size="large" @click="saveDraft" :loading="savingDraft">保存草稿</el-button>
          <el-button type="primary" size="large" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? '保存修改' : '发布项目' }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import * as entrepreneurApi from '@/api/entrepreneur'
import type { Project } from '@/types'

const router = useRouter()
const route = useRoute()

const projectId = computed(() => Number(route.params.id) || null)
const isEdit = computed(() => !!projectId.value)

const formRef = ref<FormInstance>()
const savingDraft = ref(false)
const submitting = ref(false)

const form = ref<Partial<Project>>({
  projectName: '',
  industry: '',
  oneLineDescription: '',
  businessDescription: '',
  location: '',
  companyFoundedDate: '',
  teamSize: undefined,
  officeAddress: '',
  companyWebsite: '',
  financingStage: undefined,
  financingAmount: undefined,
  equityPercentage: undefined,
  financingHistory: '',
  marketSize: '',
  competitiveAdvantage: '',
  businessModel: '',
  revenueYtd: undefined,
  revenueLastYear: undefined,
  grossMargin: undefined,
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  isAnonymous: true
})

const rules: FormRules = {
  projectName: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  industry: [
    { required: true, message: '请选择所属行业', trigger: 'change' }
  ],
  oneLineDescription: [
    { required: true, message: '请输入一句话描述', trigger: 'blur' },
    { max: 50, message: '描述不能超过50字', trigger: 'blur' }
  ],
  businessDescription: [
    { required: true, message: '请输入业务描述', trigger: 'blur' }
  ],
  financingStage: [
    { required: true, message: '请选择融资阶段', trigger: 'change' }
  ]
}

async function loadProject() {
  if (!projectId.value) return

  try {
    const res = await entrepreneurApi.getProjectDetail(projectId.value)
    form.value = res.data
  } catch (error) {
    ElMessage.error('加载项目信息失败')
    router.back()
  }
}

async function saveDraft() {
  savingDraft.value = true
  try {
    if (isEdit.value) {
      await entrepreneurApi.updateProject(projectId.value!, form.value)
    } else {
      const res = await entrepreneurApi.createProject(form.value)
      router.replace({ name: 'EditProject', params: { id: res.data.id } })
    }
    ElMessage.success('草稿已保存')
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    savingDraft.value = false
  }
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    if (isEdit.value) {
      await entrepreneurApi.updateProject(projectId.value!, form.value)
      ElMessage.success('修改已保存')
    } else {
      const res = await entrepreneurApi.createProject(form.value)
      // 自动生成Teaser并发布
      const teaserRes = await entrepreneurApi.autoGenerateTeaser(res.data.id)
      await entrepreneurApi.publishTeaser(teaserRes.data.id)
      ElMessage.success('项目已发布')
    }

    router.push({ name: 'EntrepreneurHome' })
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (isEdit.value) {
    loadProject()
  }
})
</script>

<style scoped lang="scss">
.edit-project-page {
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
  max-width: 900px;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f3f4f6;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
}
</style>
