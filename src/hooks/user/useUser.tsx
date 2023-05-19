import { SWR_KEY } from '@/constants'
import { cartAPI, userAPI } from '@/services'
import { CheckPasswordRes, UpdateUserParams, UserInfo } from '@/types'
import useSWR from 'swr'
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
}

export const useUser = ({ key, shouldFetch = true }: useUserProps): useUserRes => {
  const { asyncHandler } = useAsync()

  const { data: userInfo, mutate } = useSWR(
    key ? key : SWR_KEY.get_user_information,
    !shouldFetch ? null : () => userAPI.getUserInfo().then((res: any) => res?.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  const getUserInfo = async (onSuccess?: (props: UserInfo) => void) => {
    const res: any = await userAPI.getUserInfo()
    if (res?.success) {
      mutate(res?.data)
      onSuccess?.(res?.data)
    } else {
      mutate(undefined)
    }
  }

  const checkHasPassword = async (onSuccess?: (props: any) => void) => {
    const res: any = await userAPI.checkHasPassword()
    if (res?.success) {
      onSuccess?.(res?.data)
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
    const res: any = await cartAPI.addGuestCartDataIntoShoppingCart(device_code)
    if (res?.success) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  return {
    userInfo,
    getUserInfo,
    checkHasPassword,
    updateUser,
    addGuestCartToShoppingCart,
  }
}
