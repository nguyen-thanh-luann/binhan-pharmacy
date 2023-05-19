import type { FirebaseAuthParams, GenerateChatTokenRes, HTTPResponse, LoginPasswordReq, LoginRes, ResetPasswordParams, TokenReq, TokenRes } from '@/types'
import { AxiosPromise } from 'axios'
import axiosClient from '.'
import { axiosInstance } from './axiosInstance'

const authAPI = {
  login: (params: LoginPasswordReq) => {
    return axiosClient.post('/user_information_controller/login_by_password', {
      params,
    })
  },

  loginGuestAccount: () => {
    return axiosInstance.get('/user_information_controller/login_guest_account')
  },

  logoutGuestAccount: () => {
    return axiosClient.get('/user_information_controller/logout_guest_account')
  },

  refreshToken: (params: TokenReq): AxiosPromise<HTTPResponse<TokenRes>> => {
    return axiosInstance.get(
      `/user_information_controller/refresh_token?refresh_token=${params?.refresh_token}`
    )
  },

  getToken: (): Promise<HTTPResponse<TokenRes>> => {
    return axiosClient.get('/get-token')
  },

  getGuestToken: (): Promise<HTTPResponse<LoginRes>> => {
    return axiosClient.get('/get-guest-token')
  },

  setToken: (params: Partial<TokenRes>): AxiosPromise<HTTPResponse<TokenRes>> => {
    return axiosClient.post('/set-token', params)
  },

  setChatToken: (params: GenerateChatTokenRes) => {
    return axiosClient.post('/set-chat-token', params)
  },

  resetPassword: (params: ResetPasswordParams) => {
    return axiosClient.post('/user_information_controller/reset-password', {
      params,
    })
  },

  firebaseAuth: (params: FirebaseAuthParams) => {
    return axiosInstance.post('/user_information_controller/auth', {
      params,
    })
  },

  generateChatToken: (token: string) => {
    return axiosClient.post(`/chatDMS/api/auth/generate_token`, { token })
  },
}

export { authAPI }

