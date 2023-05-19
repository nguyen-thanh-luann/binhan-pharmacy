import { SWR_KEY } from '@/constants'
import { userAPI } from '@/services'
import { LoginRes } from '@/types'
import useSWR from 'swr'

interface useGuestRes {
  guestInfo: LoginRes
  loginGuest: (onSuccess?: (data: LoginRes) => void) => void
  getGuestInfo: (onSuccess?: (data: LoginRes) => void) => void
}

export const useGuest = (): useGuestRes => {
  const { data: guestInfo, mutate } = useSWR(
    SWR_KEY.get_guest_information,
    () => userAPI.getGuestInfo().then((res: any) => res?.result?.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  const loginGuest = async (handleSuccess?: (data: LoginRes) => void) => {
    const res: any = await userAPI.loginGuest()

    if (res?.result?.success) {
      mutate(res?.result?.data)
      handleSuccess?.(res?.result?.data)
    }
  }

  const getGuestInfo = async (handleSuccess?: (props: LoginRes) => void) => {
    const res: any = await userAPI.getGuestInfo()

    if (res?.result?.success) {
      mutate(res?.result?.data)
      handleSuccess?.(res?.result?.data)
    }
  }

  return {
    guestInfo,
    loginGuest,
    getGuestInfo,
  }
}
