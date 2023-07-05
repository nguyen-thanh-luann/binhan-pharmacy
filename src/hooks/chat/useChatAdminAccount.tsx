import { SWR_KEY } from '@/constants'
import { userAPI } from '@/services'
import { ChatAccount, UpdateChatAccountRoleParams } from '@/types'
import useSWR from 'swr'
import { useAsync } from '../common'

interface useChatAdminAccountRes {
  data: ChatAccount
  isValidating: boolean
  getChatAccount: (hanldeSuccess?: (data: ChatAccount) => void, handleError?: () => void) => void
  updateChatAccountRole: (params: UpdateChatAccountRoleParams, hanldeSuccess?: () => void) => void
}

export const useChatAdminAccount = (): useChatAdminAccountRes => {
  const { asyncHandler } = useAsync()

  const { data, isValidating, mutate } = useSWR(
    SWR_KEY.chat_account_info,
    () => userAPI.getChatAccountInfo().then((res: any) => res?.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  const getChatAccount = async (
    hanldeSuccess?: (data: ChatAccount) => void,
    handleError?: () => void
  ) => {
    asyncHandler({
      fetcher: userAPI.getChatAccountInfo(),
      onSuccess: (res: ChatAccount) => {
        mutate(res, false)
        hanldeSuccess?.(res)
      },
      onError: () => {
        handleError?.()
      },
      config: {
        showSuccessMsg: false,
      },
    })
  }

  const updateChatAccountRole = async (
    params: UpdateChatAccountRoleParams,
    hanldeSuccess?: () => void
  ) => {
    asyncHandler({
      fetcher: userAPI.updateChatAccountRole(params),

      onSuccess: (res: ChatAccount) => {
        hanldeSuccess?.()
        setChatAccessToken(res?.token)
        mutate(res, false)
      },
      config: {
        showSuccessMsg: false,
      },
    })
  }

  const setChatAccessToken = async (token: string, handleSuccess?: () => void) => {
    try {
      const res: any = await userAPI.setChatAccessToken(token)

      if (res?.result?.success) {
        handleSuccess?.()
      }
    } catch (err) {
      console.log(err)
    }
  }

  return {
    data,
    isValidating,
    getChatAccount,
    updateChatAccountRole,
  }
}
