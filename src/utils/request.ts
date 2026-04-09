import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 标准化分页格式：后端Teaser接口返回items/total/page/pageSize，统一转为content/totalElements
function normalizePagination(res: any): any {
  if (res?.data && res.data.items && !res.data.content) {
    res.data.content = res.data.items
    res.data.totalElements = res.data.total
    res.data.totalPages = res.data.totalPages
    res.data.number = (res.data.page || 1) - 1
    res.data.size = res.data.pageSize
  }
  return res
}

const service: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 是否正在刷新token
let isRefreshing = false
// 重试请求队列
let retryQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void; config: InternalAxiosRequestConfig }> = []

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 刷新Token
async function refreshToken(): Promise<string | null> {
  const rt = localStorage.getItem('refreshToken')
  if (!rt) {
    return null
  }
  try {
    const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken: rt })
    if (data.code === 200 && data.data) {
      localStorage.setItem('token', data.data.token)
      return data.data.token
    }
    return null
  } catch {
    return null
  }
}

// 清除登录状态并跳转
function clearAuthAndRedirect() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  router.push({ name: 'Login' })
}

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 如果是文件下载，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }

    // 业务状态码判断
    if (res.code !== 200) {
      // 20002: Token已过期，尝试刷新
      if (res.code === 20002) {
        const config = response.config as InternalAxiosRequestConfig

        if (!isRefreshing) {
          isRefreshing = true
          refreshToken().then((newToken) => {
            isRefreshing = false
            if (newToken) {
              // 重试队列中的请求
              retryQueue.forEach(({ resolve, config: retryConfig }) => {
                retryConfig.headers.Authorization = `Bearer ${newToken}`
                resolve(service(retryConfig))
              })
              retryQueue = []
            } else {
              retryQueue.forEach(({ reject }) => reject(new Error('Token refresh failed')))
              retryQueue = []
              clearAuthAndRedirect()
            }
          }).catch(() => {
            isRefreshing = false
            retryQueue.forEach(({ reject }) => reject(new Error('Token refresh failed')))
            retryQueue = []
            clearAuthAndRedirect()
          })
        }

        return new Promise((resolve, reject) => {
          retryQueue.push({ resolve, reject, config })
        })
      }

      // 20003/20005: Token无效/Refresh Token无效
      if (res.code === 20003 || res.code === 20005) {
        clearAuthAndRedirect()
        return Promise.reject(new Error(res.message || '认证失败'))
      }

      // 其他业务错误
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return normalizePagination(res)
  },
  (error) => {
    console.error('Response error:', error)

    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          clearAuthAndRedirect()
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(error.message || '请求失败')
      }
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }

    return Promise.reject(error)
  }
)

// 封装请求方法
export const request = {
  get<T = any>(url: string, config?: any): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: any): Promise<T> {
    return service.delete(url, config)
  },

  upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      }
    })
  }
}

export default service
