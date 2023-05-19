import { bannerAPI } from '@/services'
import { Banner, GetBannerParams } from '@/types'
import { useQueryListV2 } from '../common/useQueryV2'

interface useBannerProps {
  key: string
  shouldFetch?: boolean
  params?: GetBannerParams
}

interface useBannerRes {
  data: Banner[]
  isValidating: boolean
  isLoadingMore: boolean
  hasMore: boolean
  getMore: () => void
}

export const useBanner = ({ key, params }: useBannerProps): useBannerRes => {
  const { data, isValidating, getMore, hasMore, isLoadingMore } = useQueryListV2<
    Banner,
    GetBannerParams
  >({
    key,
    fetcher: bannerAPI.getBanners,
    initialParams: params,
    config: {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  })

  return {
    data,
    isValidating,
    isLoadingMore,
    hasMore,
    getMore,
  }
}
