import { SWR_KEY } from '@/constants'
import { encodeJWT } from '@/helper'
import { authAPI, userAPI } from '@/services'
import {
  AccountType,
  GenerateChatTokenRes,
  GetChatTokenRes,
  SingupNewChatAccountParams,
  UserInfo,
} from '@/types'
import useSWR from 'swr'
import { useAuth } from '../auth'
import { useAsync } from '../common'

interface useChatAccountRes {
  data: GetChatTokenRes
  signupNewChatAccount: (
    params: SingupNewChatAccountParams,
    onSuccess?: (res: GenerateChatTokenRes) => void,
    onError?: () => void
  ) => void
  isValidating: boolean
  setChatToken: (params: GenerateChatTokenRes, onSuccess?: () => void, onError?: () => void) => void
  generateChatServiceToken: () => void
  autoSignupChatServer: (role?: AccountType) => void
}

export const useChatAccount = (): useChatAccountRes => {
  const { asyncHandler } = useAsync()
  const { generateChatToken } = useAuth()

  const { data, isValidating, mutate } = useSWR(
    SWR_KEY.get_chat_token,
    () => authAPI.getChatToken().then((res: any) => res?.result?.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  const signupNewChatAccount = async (
    params: SingupNewChatAccountParams,
    onSuccess?: (res: GenerateChatTokenRes) => void,
    onError?: () => void
  ) => {
    asyncHandler({
      fetcher: authAPI.signupChatServiceAccount(params),
      onSuccess: (res: GenerateChatTokenRes) => {
        onSuccess?.(res)
      },
      onError: () => {
        onError?.()
      },
      config: {
        errorMsg: 'Signup new account failed',
        showSuccessMsg: false,
      },
    })
  }

  const setChatToken = async (
    params: GenerateChatTokenRes,
    onSuccess?: () => void,
    onError?: () => void
  ) => {
    try {
      const res: any = await authAPI.setChatToken(params)
      if (res?.result?.success) {
        mutate(data, true)
        onSuccess?.()
      }
    } catch (err) {
      console.log(err)
      onError?.()
    }
  }

  const generateChatServiceToken = async () => {
    try {
      const res: any = await userAPI.getUserInfo()
      if (res.success || res?.result?.success) {
        generateChatToken({
          token: encodeJWT({ user_id: res?.data?.account?.partner_id }),
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const autoSignupChatServer = async (role?: AccountType) => {
    // use this function when user login to signup an account

    try {
      const res: any = await userAPI.getUserInfo()

      if (res?.success || res?.result?.success) {
        const user: UserInfo = res?.data || res?.result?.data

        signupNewChatAccount(
          {
            user_id: user?.account?.partner_id || 0,
            password: user?.account?.phone,
            phone: user?.account?.phone || '',
            role: role
              ? role
              : user?.account?.account_type === 'npp'
              ? 'admin'
              : user?.account?.account_type,
            user_name: user.account?.partner_name,
            avatar: user?.account?.avatar_url?.url,
          },
          (res) => {
            setChatToken(res)
          }
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  return {
    signupNewChatAccount,
    data,
    isValidating,
    setChatToken,
    generateChatServiceToken,
    autoSignupChatServer,
  }
}
