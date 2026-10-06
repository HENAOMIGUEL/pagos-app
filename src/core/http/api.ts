import axios from 'axios'
import { Loading, QSpinner } from 'quasar'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
})

let pendingRequests = 0

function showLoading() {
  pendingRequests += 1

  if (pendingRequests === 1) {
    Loading.show({ spinner: QSpinner, spinnerColor: 'primary', spinnerSize: 60 })
  }
}

function hideLoading() {
  pendingRequests = Math.max(0, pendingRequests - 1)

  if (pendingRequests === 0) {
    Loading.hide()
  }
}

api.interceptors.request.use((config) => {
  showLoading()
  return config
})

api.interceptors.response.use(
  (response) => {
    hideLoading()
    return response
  },
  (error) => {
    hideLoading()
    return Promise.reject(error)
  },
)
