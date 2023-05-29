import { SWR_KEY } from '@/constants'
import { productAPI } from '@/services'
import { VisceraAttributeRes } from '@/types'
import useSWR from 'swr'

interface useViceraAttributeProps {
  key: string
  shouldFetch?: boolean
}

interface useAttributeMinorRes {
  data: VisceraAttributeRes[]
  isValidating: boolean
}

export const useViceraAttribute = ({
  key,
  shouldFetch = true,
}: useViceraAttributeProps): useAttributeMinorRes => {
  const { data, isValidating } = useSWR(
    key ? key : SWR_KEY.get_viscera_attribute,
    !shouldFetch
      ? null
      : () => productAPI.getListVisceraAttribute().then((res: any) => res?.data || []),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  return {
    data: data || [],
    isValidating,
  }
}
