import { SWR_KEY } from '@/constants'
import footerAPI from '@/services/footerAPI'
import { FooterDescription } from '@/types'
import useSWR from 'swr'

interface useFooterDescriptionProps {
  id: number
  key?: string
  shouldFetch?: boolean
}

interface useFooterDescriptionRes {
  footerData: FooterDescription
  isValidating: boolean
}

export const useFooterDescription = ({
  shouldFetch = true,
  key,
  id,
}: useFooterDescriptionProps): useFooterDescriptionRes => {
  const { data, isValidating } = useSWR(
    key ? key : `${SWR_KEY.get_footer_description}_${id}`,
    !shouldFetch
      ? null
      : () =>
          footerAPI
            .getFooterDescription({ footer_line_id: id })
            .then((res: any) => res?.data || []),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  )

  return {
    footerData: data || [],
    isValidating,
  }
}
