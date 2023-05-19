import { setBackdropVisible, store } from '@/store'
import { TokenReq } from '@/types'
import axios from 'axios'
import mem from 'mem'
import { authAPI } from './authAPI'

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(
  async (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

try {
  axiosClient.interceptors.response.use(
    async (response) => {
      // console.log('axios client res: ', response);

      if (response?.data) {
        if (response?.data?.code === 401 || response?.data?.code === 403) {
          await memoizedRefreshToken()
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
    const tokenRes: any = await authAPI.getToken()
    const guestTokenRes: any = await authAPI.getGuestToken()

    const tokenData: TokenReq = {
      token: tokenRes?.result?.data?.token || guestTokenRes?.result?.data?.guest_token,
      refresh_token:
        tokenRes?.result?.data?.refresh_token || guestTokenRes?.result?.data?.guest_refresh_token,
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
}

const memoizedRefreshToken = mem(refreshToken, {
  maxAge: 10000,
})

export default axiosClient
export * from './authAPI'
export * from './axiosInstance'
export * from './bannerAPI'
export * from './cartAPI'
export * from './chatAPI'
export * from './orderAPI'
export * from './postAPI'
export * from './productAPI'
export * from './ratingAPI'
export * from './uploadAPI'
export * from './userAPI'
export * from './promotionAPI'

