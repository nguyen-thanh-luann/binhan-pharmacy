import { StarRating } from '@/types'
import ratingAPI from '@/services/ratingAPI'
import useSWR from 'swr'
import { SWR_KEY } from '@/constants'

interface useStatisticalRatingProps {
  id: number
  key?: string
  shouldFetch?: boolean
}

interface UseStatisticalRatingRes {
  data: {
    star_avg: number
    rating_total: number
    detail_star_rating: StarRating[]
  }
  isValidating: boolean
}

export const useStatisticalRating = ({
  id,
  key,
  shouldFetch = true,
}: useStatisticalRatingProps): UseStatisticalRatingRes => {
  const { data, isValidating } = useSWR(
    key ? key : SWR_KEY.get_star_rating_count,
    !shouldFetch
      ? null
      : () => ratingAPI.groupRatingStarCount(id).then((res: any) => res?.data || []),
    {
      dedupingInterval: 600000,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    isValidating,
  }
}
