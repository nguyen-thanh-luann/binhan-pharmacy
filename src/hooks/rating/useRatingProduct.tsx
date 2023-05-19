import ratingAPI from '@/services/ratingAPI'
import {
  CreateRatingReq,
  DeleteRatingProps,
  HTTPListResponse,
  QueryList,
  Rating,
  RatingRes,
} from '@/types'
import { useAsync } from '../common'
import { useQueryListV2 } from '../common/useQueryV2'

interface useRatingProps {
  key: string
  shouldFetch?: boolean
  params: QueryList
}

interface useRatingRes {
  productHistory: RatingRes[] | undefined
  isValidating: boolean
  isCreateRating: boolean
  hasMore: boolean
  isLoadingMore: boolean
  createRating: (params: CreateRatingReq, onSuccess?: () => void, onError?: () => void) => void
  deleteRating: (params: DeleteRatingProps, onSuccess?: () => void, onError?: () => void) => void
  getMore: () => void
}

export const useRatingProduct = ({ key, params }: useRatingProps): useRatingRes => {
  const { asyncHandler, isLoading: isCreateRating } = useAsync()

  const { data, mutate, isValidating, getMore, hasMore, isLoadingMore } = useQueryListV2<
    RatingRes,
    QueryList
  >({
    key,
    fetcher: ratingAPI.getProductsPurchased,
    initialParams: params,
    config: {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  })

  const createRating = async (
    params: CreateRatingReq,
    onSuccess?: () => void,
    onError?: () => void
  ) => {
    asyncHandler({
      fetcher: ratingAPI.updateRatingProduct(params),
      onSuccess: (res: HTTPListResponse<Rating[]>) => {
        console.log({ res })

        mutate([...data], true)

        onSuccess?.()
      },
      onError: () => {
        onError?.()
      },
      config: {
        showSuccessMsg: false,
        setLoadingState: true,
      },
    })
  }

  const deleteRating = async (
    params: DeleteRatingProps,
    onSuccess?: () => void,
    onError?: () => void
  ) => {
    asyncHandler({
      fetcher: ratingAPI.deleteRating(params),
      onSuccess: (res) => {
        console.log({ res })

        mutate([...data], true)

        onSuccess?.()
      },
      onError: () => {
        onError?.()
      },
      config: {
        errorMsg: 'Xóa đánh giá không thành công!',
        showSuccessMsg: false,
        setLoadingState: true,
        showBackdrop: false,
      },
    })
  }

  return {
    productHistory: data || [],
    isValidating,
    hasMore,
    isLoadingMore,
    isCreateRating,
    createRating,
    deleteRating,
    getMore,
  }
}
