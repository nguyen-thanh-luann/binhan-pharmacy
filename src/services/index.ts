import { setBackdropVisible, store } from '@/store'
import axios from 'axios'
import mem from 'mem'
import { userAPI } from './userAPI'

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
      // console.log('axios client code: ', response.data)

      if (response?.data) {
        const code = response?.data?.code || response?.data?.result?.code
        if (code === 401 || code === 403) {
          const res = await memoizedRefreshToken()
          if (res) {
            axiosClient(response.config)
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
  // console.log('call logoutHandler')

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
export * from './promotionAPI'
export * from './ratingAPI'
export * from './uploadAPI'
export * from './userAPI'
