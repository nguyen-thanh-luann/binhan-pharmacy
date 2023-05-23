export interface PayloadType<T> {
  payload: T
}

export interface AttachmentId {
  attachment_id: string
  url: string
}

export interface IconType {
  id: number
  url: string
  name?: string
  data_type?: string
}

export interface ImageId {
  image_id: number
  image_url: string
}

export interface UseParams<T, U> {
  params: T
  onSuccess: (params: U) => void
  onError?: (data?: any) => void
  config?: FetcherConfig
}

export interface FetcherConfig {
  showScreenLoading?: boolean
  errorMsg?: string
  successMsg?: string
  showErrorMsg?: boolean
  toggleOverFlow?: boolean
}

export interface ImageRes {
  image_id: number
  image_url: string
}

export interface URLRes {
  id: number
  url: string
  image_url?: string
  name: string
  data_type: string
}

export interface LoginFormParams {
  phone: string
  password: string
}

export interface ReactSelectType {
  value: number
  label: string
}

export interface OptionType<T extends string | number> {
  label: string
  value: T
}

export interface BreadcrumbItem {
  name: string
  path: string
}

export type AUTH_OPTION = 'loginPassword' | 'loginOTP' | 'resetPassword' | 'signup' | undefined
export type VERIFY_OTP_TYPE = 'login' | 'resetPassword'

export interface AddressPickerRes {
  state: OptionType<number>
  district: OptionType<number>
  ward: OptionType<number>
}

export interface uploadImageRes {
  id: string
  thumbnail_url: string
  url: string
  type: string
}