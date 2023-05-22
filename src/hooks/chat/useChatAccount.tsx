import { GenerateChatTokenRes, GetChatTokenRes, SingupNewChatAccountParams } from '@/types'
import { useAsync } from '../common'
import { authAPI } from '@/services'
import useSWR from 'swr'
import { SWR_KEY } from '@/constants'

interface useChatAccountRes {
  data: GetChatTokenRes
  signupNewChatAccount: (
    params: SingupNewChatAccountParams,
    onSuccess?: (res: GenerateChatTokenRes) => void,
    onError?: () => void
  ) => void
  isValidating: boolean
  setChatToken: (params: GenerateChatTokenRes, onSuccess?: () => void, onError?: () => void) => void
}

export const useChatAccount = (): useChatAccountRes => {
  const { asyncHandler } = useAsync()

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

  return {
    signupNewChatAccount,
    data,
    isValidating,
    setChatToken,
  }
}
