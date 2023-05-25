import { DEFAULT_LIMIT } from '@/constants'
import type {
  AddressAdd,
  AddressDelete,
  ChangePasswordParams,
  CreatePasswordParams,
  DistrictId,
  FirebaseAuthParams,
  GenerateChatTokenParams,
  GetDrugStoreParams,
  HTTPResponse,
  HTTPResponseV2,
  ResetPasswordParams,
  ShippingAddressV2,
  StateId,
  UpdateUserParams,
  UserAccount
} from '@/types'
import { LoginFormParams } from '@/types'
import axiosClient, { axiosInstance } from '.'

const userAPI = {
  login: (data: LoginFormParams) => {
    return axiosClient.post('/login', { params: data })
  },

  loginPhoneNumber: (data: FirebaseAuthParams) => {
    return axiosClient.post('/login-phone-number', { params: data })
  },

  resetPassword: (data: ResetPasswordParams) => {
    return axiosClient.post('/reset-password', { params: data })
  },

  loginGuest: () => {
    return axiosClient.post('/login-guest')
  },

  getGuestInfo: () => {
    return axiosClient.post('/get-guest-token')
  },

  logoutGuest: () => {
    return axiosClient.post('/logout-guest')
  },

  logout: () => {
    return axiosClient.post('/logout', {})
  },

  refreshToken: () => {
    return axiosClient.post('/refresh-token')
  },

  getUserInfo: () => {
    return axiosClient.get('/user_information_controller/get_account_information')
  },

  getAddress: (params: StateId | DistrictId | {}) => {
    return axiosInstance.post('/api/v2.0/user/adress', {
      params,
    })
  },

  checkHasPassword: () => {
    return axiosClient.post(`/user_information_controller/check_has_password`, {})
  },

  changePassword: (params: ChangePasswordParams) => {
    return axiosClient.post('/user_information_controller/change-password', {
      params: {
        ...params,
      },
    })
  },

  createPassword: (params: CreatePasswordParams) => {
    return axiosClient.post('/user_information_controller/create_new_password', {
      params: {
        ...params,
      },
    })
  },

  checkUserAccountExist: (phone: string) => {
    return axiosClient.post('/user_information_controller/check_user_account', {
      params: {
        phone,
      },
    })
  },

  // handle generateToken in local
  generateChatToken: (params: GenerateChatTokenParams) => {
    return axiosClient.post(`/chatDMS/generate-token`, { params })
  },

  getDetailUser: () => {
    return axiosClient.post('/api/v2.0/information_customers/get_info_customer', { params: {} })
  },

  addAddress: (address: AddressAdd) => {
    return axiosClient.post('/api/v2.0/user/adress_add', { params: address })
  },

  deleteAddress: (params: AddressDelete) => {
    return axiosClient.post('/api/v2.0/user/adress_delete', {
      params,
    })
  },

  updateUser: (props: UpdateUserParams) => {
    return axiosClient.post('/user_information_controller/update_account_information', {
      params: props,
    })
  },

  likeProduct: (product_id: number) => {
    return axiosClient.get(`/wishlist_controller/like?product_id=${product_id}`)
  },

  unLikeProduct: (product_id: number) => {
    return axiosClient.get(`/wishlist_controller/unlike?product_id=${product_id}`)
  },

  getDrugStoreList: ({
    limit = DEFAULT_LIMIT,
    offset = 0,
    ...params
  }: GetDrugStoreParams): Promise<HTTPResponseV2<UserAccount[]>> => {
    return axiosClient.get(`/user_information_controller/list_drugstore`, { params: params })
  },

  getShippingAddressList: (): Promise<HTTPResponse<ShippingAddressV2[]>> => {
    return axiosClient.post('/api/v2.0/user/get_adress_by_partner', {})
  },
}

export { userAPI }
