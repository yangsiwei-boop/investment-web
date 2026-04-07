<template>
  <div class="privacy-settings-page">
    <div class="page-header">
      <h1>隐私设置</h1>
      <p>控制项目信息的公开程度，保护企业隐私</p>
    </div>

    <div class="settings-content" v-if="settings">
      <!-- 项目信息展示设置 -->
      <div class="settings-section">
        <h3>项目信息展示</h3>
        <p class="section-desc">设置哪些项目信息对投资人可见</p>

        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">公司名称</div>
              <div class="setting-desc">在Teaser中显示公司真实名称</div>
            </div>
            <el-switch v-model="settings.allowShowCompanyName" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">成立时间</div>
              <div class="setting-desc">显示公司成立时间</div>
            </div>
            <el-switch v-model="settings.allowShowFoundedTime" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">公司规模</div>
              <div class="setting-desc">显示团队人数</div>
            </div>
            <el-switch v-model="settings.allowShowCompanyScale" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">办公地址</div>
              <div class="setting-desc">显示公司办公地址</div>
            </div>
            <el-switch v-model="settings.allowShowOfficeAddress" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">联系方式</div>
              <div class="setting-desc">显示联系人、电话、邮箱</div>
            </div>
            <el-switch v-model="settings.allowShowContactInfo" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">财务数据</div>
              <div class="setting-desc">显示详细财务数据（营收、利润等）</div>
            </div>
            <el-switch v-model="settings.allowShowFinancialData" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">融资历史</div>
              <div class="setting-desc">显示历史融资信息</div>
            </div>
            <el-switch v-model="settings.allowShowFinancingHistory" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">创始人详情</div>
              <div class="setting-desc">显示创始人背景信息</div>
            </div>
            <el-switch v-model="settings.allowShowFounderDetails" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">团队信息</div>
              <div class="setting-desc">显示核心团队成员</div>
            </div>
            <el-switch v-model="settings.allowShowTeamInfo" />
          </div>
        </div>
      </div>

      <!-- 问答设置 -->
      <div class="settings-section">
        <h3>问答设置</h3>
        <p class="section-desc">管理投资人提问和回复的可见性</p>

        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">允许公开问答</div>
              <div class="setting-desc">投资人可以发起公开问答</div>
            </div>
            <el-switch v-model="settings.allowPublicQa" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">新回复默认公开</div>
              <div class="setting-desc">回复新问题时默认设为公开</div>
            </div>
            <el-switch v-model="settings.defaultQaPublic" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">问题库回复默认公开</div>
              <div class="setting-desc">使用问题库回复时默认公开</div>
            </div>
            <el-switch v-model="settings.questionLibraryQaPublic" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">允许查看问答记录</div>
              <div class="setting-desc">投资人可以查看历史问答</div>
            </div>
            <el-switch v-model="settings.allowViewQaRecords" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">允许接收问题</div>
              <div class="setting-desc">投资人可以向您发送问题</div>
            </div>
            <el-switch v-model="settings.allowReceiveQuestions" />
          </div>
        </div>
      </div>

      <!-- 申请审核设置 -->
      <div class="settings-section">
        <h3>申请审核</h3>
        <p class="section-desc">设置投资人申请获取资料的审核方式</p>

        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">BP申请需审核</div>
              <div class="setting-desc">投资人申请获取BP时需要您的审批</div>
            </div>
            <el-switch v-model="settings.requireBpApproval" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">联系方式申请需审核</div>
              <div class="setting-desc">投资人申请获取联系方式时需要您的审批</div>
            </div>
            <el-switch v-model="settings.requireContactApproval" />
          </div>
        </div>
      </div>

      <!-- 自动回复设置 -->
      <div class="settings-section">
        <h3>自动回复</h3>
        <p class="section-desc">设置收到问题时的自动回复内容</p>

        <el-form-item label="自动回复模板">
          <el-input
            v-model="settings.autoReplyTemplate"
            type="textarea"
            :rows="4"
            placeholder="设置自动回复内容，例如：感谢您的关注，我们会尽快回复您的问题..."
          />
        </el-form-item>
      </div>

      <div class="save-section">
        <el-button type="primary" size="large" :loading="saving" @click="saveSettings">
          保存设置
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as entrepreneurApi from '@/api/entrepreneur'
import type { PrivacySettings } from '@/types'

const settings = ref<PrivacySettings | null>(null)
const saving = ref(false)

async function loadSettings() {
  try {
    const res = await entrepreneurApi.getPrivacySettings()
    settings.value = res.data
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

async function saveSettings() {
  if (!settings.value) return

  saving.value = true
  try {
    await entrepreneurApi.updatePrivacySettings(settings.value)
    ElMessage.success('设置已保存')
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped lang="scss">
.privacy-settings-page {
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

.settings-content {
  max-width: 800px;
}

.settings-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  .section-desc {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 20px;
  }
}

.settings-list {
  display: flex;
  flex-direction: column;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

.setting-info {
  flex: 1;
  margin-right: 20px;
}

.setting-title {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.setting-desc {
  font-size: 13px;
  color: #6b7280;
}

.save-section {
  display: flex;
  justify-content: flex-end;
}
</style>
