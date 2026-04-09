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
              <el-dropdown-item command="changepassword">
                <el-icon><Key /></el-icon>
                修改密码
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

    <!-- 修改密码对话框 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="460px">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-position="top">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码（6-20位）" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="passwordLoading" @click="handleChangePassword">确认修改</el-button>
      </template>
    </el-dialog>

    <!-- 个人资料对话框 -->
    <el-dialog v-model="profileDialogVisible" title="个人资料" width="560px">
      <el-form ref="profileFormRef" :model="profileForm" label-position="top">
        <el-form-item label="昵称">
          <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="profileForm.bio" type="textarea" :rows="3" placeholder="请输入个人简介" />
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="profileForm.companyName" placeholder="请输入公司名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="profileDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="profileLoading" @click="handleSaveProfile">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Bell, ArrowDown, User, Lock, Key, SwitchButton } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import * as authApi from '@/api/auth'
import * as entrepreneurApi from '@/api/entrepreneur'
import NotificationPanel from '@/components/common/NotificationPanel.vue'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const userName = computed(() => authStore.user?.realName || authStore.user?.nickname || '融资用户')
const userAvatar = computed(() => authStore.entrepreneurProfile?.companyLogoUrl)
const unreadCount = computed(() => notificationStore.unreadCount)

// ====== 修改密码 ======
const passwordDialogVisible = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordLoading = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: (err?: Error) => void) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

async function handleChangePassword() {
  if (!passwordFormRef.value) return
  try {
    await passwordFormRef.value.validate()
    passwordLoading.value = true
    await authApi.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功，请重新登录')
    passwordDialogVisible.value = false
    authStore.logout()
    router.push({ name: 'Login' })
  } catch (error: any) {
    if (error?.message) {
      ElMessage.error(error.message)
    }
  } finally {
    passwordLoading.value = false
  }
}

// ====== 个人资料 ======
const profileDialogVisible = ref(false)
const profileFormRef = ref<FormInstance>()
const profileLoading = ref(false)
const profileForm = reactive({
  nickname: '',
  email: '',
  bio: '',
  companyName: ''
})

function openProfileDialog() {
  profileForm.nickname = authStore.user?.nickname || ''
  profileForm.email = authStore.user?.email || ''
  profileForm.bio = authStore.user?.bio || ''
  profileForm.companyName = authStore.entrepreneurProfile?.companyName || ''
  profileDialogVisible.value = true
}

async function handleSaveProfile() {
  profileLoading.value = true
  try {
    await authApi.updateUserProfile({
      nickname: profileForm.nickname,
      email: profileForm.email,
      bio: profileForm.bio
    })
    await entrepreneurApi.updateEntrepreneurProfile({
      companyName: profileForm.companyName
    })
    await authStore.fetchCurrentUser()
    ElMessage.success('资料更新成功')
    profileDialogVisible.value = false
  } catch (error: any) {
    ElMessage.error(error.message || '更新失败')
  } finally {
    profileLoading.value = false
  }
}

// ====== 菜单命令 ======
async function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      openProfileDialog()
      break
    case 'privacy':
      router.push({ name: 'PrivacySettings' })
      break
    case 'changepassword':
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
      passwordDialogVisible.value = true
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
