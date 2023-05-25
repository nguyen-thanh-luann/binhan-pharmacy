import { setBackdropVisible, store } from '@/store'
import axios from 'axios'
import mem from 'mem'
import { userAPI } from './userAPI'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
  },
})

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  async (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

try {
  axiosInstance.interceptors.response.use(
    async (response) => {
      if (response?.data) {
        const code = response?.data?.code || response?.data?.result?.code

        if (code === 401 || code === 403) {
          const res = await memoizedRefreshToken()
          if (res) {
            axiosInstance(response.config)
          }

          return
        }
        return response.data
      }
      return response
    },
    (err) => {
      throw err
    }
  )
} catch (error) {
  console.log(error)
}

const refreshToken = async () => {
  try {
    const res: any = await userAPI.refreshToken()
    store.dispatch(setBackdropVisible(false))

    if (!res?.result?.success) {
      await logoutHandler()
    }

    return res?.result?.data
  } catch (error) {
    store.dispatch(setBackdropVisible(false))
    await logoutHandler()
  }
}

const logoutHandler = async () => {
  await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/logout`)
}

const memoizedRefreshToken = mem(refreshToken, {
  maxAge: 10000,
})
