import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Account API
export const accountsAPI = {
  create: (data) => api.post('/accounts/create', data),
  getAll: () => api.get('/accounts/'),
  getById: (id) => api.get(`/accounts/${id}`),
  login: (id) => api.post(`/accounts/${id}/login`),
  getStrategy: (id) => api.get(`/accounts/${id}/strategy`),
  regenerateStrategy: (id) => api.post(`/accounts/${id}/regenerate-strategy`),
}

// Content API
export const contentAPI = {
  generate: (data) => api.post('/content/generate', data),
  generateBatch: (data) => api.post('/content/generate-batch', data),
  createCustom: (data) => api.post('/content/create-custom', data),
  getPosts: (accountId, status) => api.get(`/content/posts/${accountId}${status ? `?status=${status}` : ''}`),
  getPost: (postId) => api.get(`/content/post/${postId}`),
  updateStatus: (postId, status) => api.put(`/content/post/${postId}/status?status=${status}`),
  deletePost: (postId) => api.delete(`/content/post/${postId}`),
}

// Scheduler API
export const schedulerAPI = {
  schedulePost: (data) => api.post('/scheduler/schedule-post', data),
  scheduleOptimal: (data) => api.post('/scheduler/schedule-optimal', data),
  publishScheduled: () => api.post('/scheduler/publish-scheduled'),
  getScheduled: (accountId) => api.get(`/scheduler/scheduled/${accountId}`),
  cancelPost: (postId) => api.delete(`/scheduler/cancel/${postId}`),
  getAnalytics: (accountId, days = 30) => api.get(`/scheduler/analytics/${accountId}?days=${days}`),
}

// Engagement API
export const engagementAPI = {
  monitorComments: (accountId) => api.post(`/engagement/monitor-comments/${accountId}`),
  autoReply: (data) => api.post('/engagement/auto-reply', data),
  getComments: (accountId, limit = 50) => api.get(`/engagement/comments/${accountId}?limit=${limit}`),
  getAnalytics: (accountId, days = 30) => api.get(`/engagement/analytics/${accountId}?days=${days}`),
  bulkAction: (data) => api.post('/engagement/bulk-action', data),
}

// General API
export const generalAPI = {
  getAIStatus: () => api.get('/ai-status'),
  getHealth: () => api.get('/health'),
}

export default api