import { postAPI } from '@/services'
import { GetPostListParams, PostCategory } from '@/types'
import { useListQuery } from '../common'

interface usePostListProps {
  key: string
  params?: GetPostListParams
}

interface usePostCategoryRes {}

export const usePostCategory = ({ key, params }: usePostListProps): usePostCategoryRes => {
  const { data, mutate, isValidating, getMore, hasMore, isLoadingMore } = useListQuery<
    PostCategory,
    GetPostListParams
  >({
    key,
    fetcher: postAPI.getPostCategoryList,
    initialParams: params,
    config: {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  })

  return {
    data,
    mutate,
    isValidating,
    getMore,
    hasMore,
    isLoadingMore,
  }
}
