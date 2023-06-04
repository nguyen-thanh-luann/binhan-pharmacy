import { Country, District, Province, ShippingAddress, Ward } from './address'
import { AccountType } from './auth'
import { ImageRes, URLRes } from './common'
import { QueryList } from './http'

export type UserGenderType = 'male' | 'female' | 'other'
export type UserMedicineAccountType = 'drugstore_account' | 'patient_account'
export type UserBusinessType =
  | 'drugstore'
  | 'clinic'
  | 'store'
  | 'pharmacy'
  | 'health_store'
  | 'other'

export interface UserInfo {
  account: UserAccount
  user: {
    user_id: number
    user_name: string
    avatar_url: ImageRes
    gender: UserGenderType
    account_type: string
  }
}

export interface UserAccount {
  partner_id: number
  partner_name: string
  company_id: number
  phone: string
  gender: UserGenderType
  avatar_url: URLRes
  account_type: AccountType
  medicine_account_type: UserMedicineAccountType
  business_type: UserBusinessType
  gpp_certification_image_url: URLRes
  business_registration_certification_image_url: URLRes
  business_operation_name: string
  business_operation_owner: string
  business_phone: string
  establish_date: Date
  country_id: Country
  province_id: Province
  district_id: District
  ward_id: Ward
  street: string
  full_address: string
  email: string
  date_of_birth: Date
}

export interface UserDetail {
  id: number
  name: string
  birthday: Date
  phone: string
  email: string
  sex: string
  street: string
  partner_id: number
  company_id: number
  image_url: string
  account_type: string
  customer_type: string
  address: string
  shipping_adress: ShippingAddress[]
}

export interface CheckPasswordRes {
  has_password: boolean
}

export interface UpdateUserParams {
  avatar_url?: number
  partner_name?: string
  email?: string
  date_of_birth?: Date //YYYY-MM-DD
  gender?: UserGenderType
  country_id?: number
  province_id?: number
  district_id?: number
  ward_id?: number
  street?: string
  medicine_account_type?: UserMedicineAccountType
  business_type?: UserBusinessType
  gpp_certification_image_url?: number
  business_registration_certification_image_url?: number
  business_operation_name?: string
  business_operation_owner?: string
  business_phone?: string
  establish_date?: Date
}

export interface GetDrugStoreParams extends QueryList {
  drugstore_name?: string
  province_id?: number
  district_id?: number
  ward_id?: number
}
