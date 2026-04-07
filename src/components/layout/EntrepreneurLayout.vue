<template>
  <div class="entrepreneur-layout">
    <header class="header">
      <div class="logo" @click="router.push({ name: 'EntrepreneurHome' })">
        <h1>投融资对接平台</h1>
        <span class="badge">融资用户</span>
      </div>
      <div class="user-nav">
        <el-popover
          placement="bottom-end"
          :width="320"
          trigger="click"
        >
          <template #reference>
            <div class="notification">
              <el-badge :value="unreadCount" :hidden="unreadCount === 0">
                <el-icon :size="20"><Bell /></el-icon>
              </el-badge>
            </div>
          </template>
          <NotificationPanel />
        </el-popover>

        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user-menu">
            <el-avatar :size="36" :src="userAvatar">
              {{ userName?.charAt(0) }}
            </el-avatar>
            <span class="user-name">{{ userName }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人资料
              </el-dropdown-item>
              <el-dropdown-item command="privacy">
                <el-icon><Lock /></el-icon>
                隐私设置
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                账号设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { Bell, ArrowDown, User, Setting, SwitchButton, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import NotificationPanel from '@/components/common/NotificationPanel.vue'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const userName = computed(() => authStore.user?.realName || '融资用户')
const userAvatar = computed(() => authStore.entrepreneurProfile?.companyLogoUrl)
const unreadCount = computed(() => notificationStore.unreadCount)

async function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      // TODO: 跳转到个人资料页面
      break
    case 'privacy':
      router.push({ name: 'PrivacySettings' })
      break
    case 'settings':
      // TODO: 跳转到账号设置页面
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        authStore.logout()
        router.push({ name: 'Login' })
      } catch {
        // 用户取消
      }
      break
  }
}
</script>

<style scoped lang="scss">
.entrepreneur-layout {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  h1 {
    color: #667eea;
    font-size: 22px;
    font-weight: 700;
    margin: 0;
  }

  .badge {
    background: #f5f3ff;
    color: #667eea;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
}

.user-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification {
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s;

  &:hover {
    background: #f3f4f6;
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.3s;

  &:hover {
    background: #f3f4f6;
  }

  .user-name {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
  }
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}
</style>
