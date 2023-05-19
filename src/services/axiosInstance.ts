import { setBackdropVisible, store } from '@/store'
import { TokenReq } from '@/types'
import axios from 'axios'
import mem from 'mem'
import { authAPI } from './authAPI'

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
        if (response?.data?.code === 401 || response?.data?.code === 403) {
          await memoizedRefreshToken()
          return
          // return axiosInstance(response.config)
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
    const tokenData: TokenReq = {}

    const tokenRes = await authAPI.getToken()
    const data = tokenRes?.result?.data
    if (data?.token) {
      ;(tokenData.token = data.token), (tokenData.refresh_token = data.refresh_token)
    } else {
      const guestTokenRes = await authAPI.getGuestToken()
      const data = guestTokenRes?.result?.data
      if (data?.token) {
        ;(tokenData.token = data.token), (tokenData.refresh_token = data.refresh_token)
      }
    }

    const res: any = await authAPI.refreshToken(tokenData)
    store.dispatch(setBackdropVisible(false))
    if (!res?.success) {
      await logoutHandler()
    }
  } catch (error) {
    store.dispatch(setBackdropVisible(false))
    await logoutHandler()
  }
}

const logoutHandler = async () => {
  await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/logout`)
  // Router.push('/' , {})
  // window.location.reload();
}

const memoizedRefreshToken = mem(refreshToken, {
  maxAge: 10000,
})
