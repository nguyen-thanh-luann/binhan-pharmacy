export interface LoginPasswordReq {
  phone: string
  password: string
}

export interface RegisterReq {
  name: string
  type: string
  email: string
  phone: string
  password: string
}

export interface TokenReq {
  token?: string
  refresh_token?: string
}

export type TokenRes = TokenReq & {
  expires_in?: number
}

export interface LoginRes {
  token: string
  refresh_token: string
  device_code?: string
}

export interface ChangePasswordParams {
  old_password: string
  password: string
  re_password: string
}

export interface CreatePasswordParams {
  password: string
  re_password: string
}

export interface ResetPasswordParams {
  firebase_access_token: string
  stringee_access_token?: string
  password: string
  re_password: string
}

export interface FirebaseAuthParams {
  type: 'firebase'
  name_user?: string
  firebase_access_token: string
}

export interface otpProps {
  otpInput: string
  handleSuccess: (token: string) => void
  handleError?: Function
}

export interface UseAuthResetPasswordParams {
  otpInput: string
  password: string
  re_password: string
  handleSuccess?: () => void
  handleError?: Function
}

export interface GenerateChatTokenRes {
  id: string
  phone: string
  user_name: string
  avatar: string
  role: string
  socket_id: string
  offline_at: Date
  is_yourself: boolean
  message_unread_count: number
  access_token: {
    token: string
    expires_in: number
  }
  refresh_token: {
    token: string
    expires_in: 7776000000
  }
}

export interface GenerateChatTokenParams {
  token: string
  onSuccess?: (_: GenerateChatTokenRes) => void
  onError?: () => void
}