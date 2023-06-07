import type {
  FirebaseAuthParams,
  GenerateChatTokenRes,
  GetChatTokenRes,
  HTTPResponse,
  LoginPasswordReq,
  LoginRes,
  ResetPasswordParams,
  SingupNewChatAccountParams,
  TokenRes,
} from '@/types'
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

  refreshToken: (refresh_token: string): AxiosPromise<HTTPResponse<TokenRes>> => {
    return axiosInstance.get(
      `/user_information_controller/refresh_token?refresh_token=${refresh_token}`
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

  getChatToken: (): Promise<HTTPResponse<GetChatTokenRes>> => {
    return axiosClient.post('/get-chat-token')
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

  // generate token from api
  generateChatToken: (token: string) => {
    return axiosClient.post(`/chatDMS/api/auth/generate_token`, { token })
  },

  signupChatServiceAccount: (params: SingupNewChatAccountParams) => {
    return axiosClient.post('/chatDMS/api/auth/register', params)
  },
}

export { authAPI }
