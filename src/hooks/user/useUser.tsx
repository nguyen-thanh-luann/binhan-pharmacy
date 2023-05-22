import { SWR_KEY } from '@/constants'
import { encodeJWT } from '@/helper'
import { cartAPI, userAPI } from '@/services'
import { CheckPasswordRes, UpdateUserParams, UserInfo } from '@/types'
import useSWR, { useSWRConfig } from 'swr'
import { useAuth } from '../auth'
import { useAsync } from '../common'

interface useUserProps {
  shouldFetch?: boolean
  key?: string
}

interface useUserRes {
  userInfo: UserInfo | undefined
  getUserInfo: (cb?: (props: UserInfo) => void) => void
  checkHasPassword: (cb?: (props: CheckPasswordRes) => void) => void
  updateUser: (props: UpdateUserParams, onSuccess?: () => void, onError?: () => void) => void
  addGuestCartToShoppingCart: (
    device_code: string,
    onSuccess?: () => void,
    onError?: () => void
  ) => void
  mutateAccountData: () => void
  generateChatServiceToken: () => void
}

export const useUser = ({ key, shouldFetch = true }: useUserProps): useUserRes => {
  const { asyncHandler } = useAsync()
  const { mutate: mutateConfig } = useSWRConfig()
  const { generateChatToken } = useAuth()

  const { data: userInfo, mutate } = useSWR(
    key ? key : SWR_KEY.get_user_information,
    !shouldFetch ? null : () => userAPI.getUserInfo().then((res: any) => res?.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  const getUserInfo = async (onSuccess?: (props: UserInfo) => void) => {
    asyncHandler({
      fetcher: userAPI.getUserInfo,
      onSuccess: (res: any) => {
        console.log('on success getUserInfo')
        mutate(res)
        onSuccess?.(res)
      },
      onError: () => {
        mutate(undefined)
      },
      config: {
        errorMsg: 'Get user info fail',
        showBackdrop: false,
        showSuccessMsg: false,
        showErrorMsg: false,
      },
    })
  }

  const checkHasPassword = async (onSuccess?: (props: any) => void) => {
    try {
      const res: any = await userAPI.checkHasPassword()
      if (res?.success) {
        onSuccess?.(res?.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateUser = (props: UpdateUserParams, onSuccess?: () => void, onError?: () => void) => {
    asyncHandler({
      fetcher: userAPI.updateUser(props),
      onSuccess: () => {
        mutate(
          {
            ...userInfo,
          },
          true
        )
        onSuccess?.()
      },
      onError,
      config: {
        showSuccessMsg: false,
      },
    })
  }

  const addGuestCartToShoppingCart = async (
    device_code: string,
    onSuccess?: () => void,
    onError?: () => void
  ) => {
    try {
      const res: any = await cartAPI.addGuestCartDataIntoShoppingCart(device_code)
      if (res?.success) {
        onSuccess?.()
      } else {
        onError?.()
      }
    } catch (err) {
      onError?.()
      console.log(err)
    }
  }

  const mutateAccountData = () => {
    mutateConfig(SWR_KEY.get_guest_information)
    mutateConfig(SWR_KEY.get_cart_length)
    mutateConfig(SWR_KEY.get_user_information)
  }

  const generateChatServiceToken = async () => {
    try {
      const res: any = await userAPI.getUserInfo()
      if (res.success || res?.result?.success) {
        handleGenerateChatToken(res?.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleGenerateChatToken = async (userInfo: UserInfo) => {
    generateChatToken({
      token: encodeJWT({ user_id: userInfo?.account?.partner_id }),
    })
  }

  return {
    userInfo,
    getUserInfo,
    checkHasPassword,
    updateUser,
    addGuestCartToShoppingCart,
    mutateAccountData,
    generateChatServiceToken,
  }
}
