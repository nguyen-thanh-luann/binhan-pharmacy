import { SWR_KEY } from '@/constants'
import footerAPI from '@/services/footerAPI'
import { FooterColumn } from '@/types'
import useSWR from 'swr'

interface useFooterProps {
  key?: string
  shouldFetch?: boolean
}

interface useFooterRes {
  footerData: FooterColumn[]
  isValidating: boolean
}

export const useFooter = ({ shouldFetch = true, key }: useFooterProps): useFooterRes => {
  const { data, isValidating } = useSWR(
    key ? key : SWR_KEY.get_footer,
    !shouldFetch ? null : () => footerAPI.getFooterData().then((res: any) => res?.data || []),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  return {
    footerData: data?.result || [],
    isValidating,
  }
}
