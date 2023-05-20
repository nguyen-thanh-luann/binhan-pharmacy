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
    try {
      const res: any = await userAPI.loginGuest()

      if (res?.result?.success) {
        mutate(res?.result?.data)
        handleSuccess?.(res?.result?.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getGuestInfo = async (handleSuccess?: (props: LoginRes) => void) => {
    try {
      const res: any = await userAPI.getGuestInfo()

      if (res?.result?.success) {
        mutate(res?.result?.data)
        handleSuccess?.(res?.result?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    guestInfo,
    loginGuest,
    getGuestInfo,
  }
}
