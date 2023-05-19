import ratingAPI from '@/services/ratingAPI'
import { GetCommentsRatingsParams, Rating } from '@/types'

import { useQueryListV2 } from '../common/useQueryV2'

interface useRatingProps {
  key: string
  shouldFetch?: boolean
  params: GetCommentsRatingsParams
}

interface useRatingRes {
  ratings: Rating[] | undefined
  isValidating: boolean
  hasMore: boolean
  isLoadingMore: boolean
  getMore: () => void
  filter: (params: GetCommentsRatingsParams) => void
}

export const useRating = ({ key, params }: useRatingProps): useRatingRes => {
  const { data, isValidating, getMore, hasMore, isLoadingMore, filter } = useQueryListV2<
    Rating,
    GetCommentsRatingsParams
  >({
    key,
    fetcher: ratingAPI.getRatingsByProduct,
    initialParams: params,
    config: {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  })

  return {
    ratings: data || [],
    isValidating,
    hasMore,
    isLoadingMore,
    getMore,
    filter,
  }
}
