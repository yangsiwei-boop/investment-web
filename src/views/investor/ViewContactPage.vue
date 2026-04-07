<template>
  <div class="view-contact-page">
    <div class="page-header">
      <h1>联系方式</h1>
      <p>您已获得查看联系方式的权限</p>
    </div>

    <div class="contact-card" v-if="contactInfo">
      <div class="contact-item">
        <div class="contact-icon">👤</div>
        <div class="contact-content">
          <div class="contact-label">联系人</div>
          <div class="contact-value">{{ contactInfo.contactPerson }}</div>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-icon">📞</div>
        <div class="contact-content">
          <div class="contact-label">联系电话</div>
          <div class="contact-value">{{ contactInfo.contactPhone }}</div>
        </div>
      </div>

      <div class="contact-item">
        <div class="contact-icon">📧</div>
        <div class="contact-content">
          <div class="contact-label">联系邮箱</div>
          <div class="contact-value">{{ contactInfo.contactEmail }}</div>
        </div>
      </div>
    </div>

    <el-skeleton v-else :rows="10" animated />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as investorApi from '@/api/investor'

const router = useRouter()
const route = useRoute()

const applicationId = Number(route.params.id)
const contactInfo = ref<any>(null)

async function loadContactInfo() {
  try {
    const res = await investorApi.getContactInfo(applicationId)
    contactInfo.value = res.data
  } catch (error) {
    ElMessage.error('加载失败')
    router.back()
  }
}

onMounted(() => {
  loadContactInfo()
})
</script>

<style scoped lang="scss">
.view-contact-page {
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

.contact-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  max-width: 600px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

.contact-icon {
  font-size: 32px;
}

.contact-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

.contact-value {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}
</style>
