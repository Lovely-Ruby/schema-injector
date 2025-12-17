import axios from 'axios'

export const http = axios.create({
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const token = process.env.CRM_TOKEN

  if (!token) {
    throw new Error('❌ CRM_TOKEN not found')
  }

  // console.log('➡️ Request with token')

  config.headers.Authorization = `Bearer ${token}`
  return config
})
