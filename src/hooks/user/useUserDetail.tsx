import { SWR_KEY } from '@/constants'
import { userAPI } from '@/services'
import { UserDetail } from '@/types'
import useSWR from 'swr'

interface useUserDetailProps {
  key?: string
  shouldFetch?: boolean
}

interface UseUserDetailRes {
  data: UserDetail
  isValidating: boolean
}

export const useUserDetail = ({
  key,
  shouldFetch = true,
}: useUserDetailProps): UseUserDetailRes => {
  const { data, isValidating } = useSWR(
    key ? key : SWR_KEY.get_user_detail,
    !shouldFetch
      ? null
      : () => userAPI.getDetailUser().then((res: any) => res?.result?.data?.info_customer),
    {
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    isValidating
  }
}
