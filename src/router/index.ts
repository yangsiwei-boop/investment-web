import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  // 认证相关页面
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/verify',
    name: 'Verify',
    component: () => import('@/views/auth/VerifyPage.vue'),
    meta: { requiresAuth: true }
  },

  // 投资人页面
  {
    path: '/investor',
    component: () => import('@/components/layout/InvestorLayout.vue'),
    meta: { requiresAuth: true, userType: 'INVESTOR' },
    children: [
      {
        path: '',
        name: 'InvestorHome',
        component: () => import('@/views/investor/InvestorWorkspace.vue')
      },
      {
        path: 'search',
        name: 'InvestorSearch',
        component: () => import('@/views/investor/SearchTeaserPage.vue')
      },
      {
        path: 'teaser/:id',
        name: 'TeaserDetail',
        component: () => import('@/views/investor/TeaserDetailPage.vue')
      },
      {
        path: 'analysis/:id',
        name: 'AIAnalysis',
        component: () => import('@/views/investor/AIAnalysisPage.vue')
      },
      {
        path: 'analysis/:id/deep',
        name: 'DeepAnalysis',
        component: () => import('@/views/investor/DeepAnalysisPage.vue')
      },
      {
        path: 'bp/:id',
        name: 'ViewBP',
        component: () => import('@/views/investor/ViewBPPage.vue')
      },
      {
        path: 'apply-bp/:id',
        name: 'ApplyBP',
        component: () => import('@/views/investor/ApplyBPPage.vue')
      },
      {
        path: 'apply-contact/:id',
        name: 'ApplyContact',
        component: () => import('@/views/investor/ApplyContactPage.vue')
      },
      {
        path: 'contact/:id',
        name: 'ViewContact',
        component: () => import('@/views/investor/ViewContactPage.vue')
      },
      {
        path: 'qa',
        name: 'InvestorQA',
        component: () => import('@/views/investor/QARecordsPage.vue')
      },
      {
        path: 'questions',
        name: 'QuestionLibrary',
        component: () => import('@/views/investor/QuestionLibraryPage.vue')
      },
      {
        path: 'send-question/:id?',
        name: 'SendQuestion',
        component: () => import('@/views/investor/SendQuestionPage.vue')
      },
      {
        path: 'public-qa/:id',
        name: 'PublicQA',
        component: () => import('@/views/investor/PublicQAPage.vue')
      }
    ]
  },

  // 融资用户页面
  {
    path: '/entrepreneur',
    component: () => import('@/components/layout/EntrepreneurLayout.vue'),
    meta: { requiresAuth: true, userType: 'ENTREPRENEUR' },
    children: [
      {
        path: '',
        name: 'EntrepreneurHome',
        component: () => import('@/views/entrepreneur/EntrepreneurWorkspace.vue')
      },
      {
        path: 'upload-bp',
        name: 'UploadBP',
        component: () => import('@/views/entrepreneur/UploadBPPage.vue')
      },
      {
        path: 'teaser/:id',
        name: 'TeaserPreview',
        component: () => import('@/views/entrepreneur/TeaserPreviewPage.vue')
      },
      {
        path: 'project/:id?',
        name: 'EditProject',
        component: () => import('@/views/entrepreneur/EditProjectPage.vue')
      },
      {
        path: 'questions',
        name: 'ReceivedQuestions',
        component: () => import('@/views/entrepreneur/ReceivedQuestionsPage.vue')
      },
      {
        path: 'reply/:id',
        name: 'ReplyQuestion',
        component: () => import('@/views/entrepreneur/ReplyQuestionPage.vue')
      },
      {
        path: 'question-library',
        name: 'EntrepreneurQuestionLibrary',
        component: () => import('@/views/entrepreneur/QuestionLibraryPage.vue')
      },
      {
        path: 'privacy',
        name: 'PrivacySettings',
        component: () => import('@/views/entrepreneur/PrivacySettingsPage.vue')
      },
      {
        path: 'applications',
        name: 'EntrepreneurApplications',
        component: () => import('@/views/entrepreneur/ApplicationsPage.vue')
      }
    ]
  },

  // 默认重定向
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const isAuth = authStore.isAuthenticated
  const userType = authStore.user?.userType

  // 使用 matched 数组检查父路由的 meta（子路由不自动继承 meta）
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const matchedUserType = to.matched.find(record => record.meta.userType)?.meta.userType as string | undefined
  const isGuestOnly = to.matched.some(record => record.meta.guest)

  if (requiresAuth && !isAuth) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (isGuestOnly && isAuth) {
    if (userType === 'INVESTOR') {
      next({ name: 'InvestorHome' })
    } else if (userType === 'ENTREPRENEUR') {
      next({ name: 'EntrepreneurHome' })
    } else {
      next()
    }
  } else if (matchedUserType && userType !== matchedUserType) {
    if (userType === 'INVESTOR') {
      next({ name: 'InvestorHome' })
    } else if (userType === 'ENTREPRENEUR') {
      next({ name: 'EntrepreneurHome' })
    } else {
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

export default router
