
import { SWR_KEY } from '@/constants'
import { bannerAPI } from '@/services'
import { Banner, GetBannerParams, HTTPListRes } from '@/types'
import useSWR from 'swr'

interface useBannerProps {
  key?: string
  shouldFetch?: boolean
  params?: GetBannerParams
}

interface useBannerRes {
  data: HTTPListRes<Banner[]>
  isValidating: boolean
}

export const useBanner = ({ shouldFetch = true, key, params }: useBannerProps): useBannerRes => {
  const { data, isValidating } = useSWR(
    key ? key : SWR_KEY.get_banner_list,
    !shouldFetch ? null : () => bannerAPI.getBanners(params).then((res: any) => res?.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    data,
    isValidating,
  }
}
