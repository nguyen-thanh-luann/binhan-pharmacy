import { postAPI } from '@/services'
import { GetPostListParams, PostCategory } from '@/types'
import { useListQuery } from '../common'

interface usePrimaryPostListProps {
  key: string
  params?: GetPostListParams
}

interface usePrimaryPostCategoryRes {
  data: PostCategory[] | undefined
  isValidating: boolean
  hasMore: boolean
  isLoadingMore: boolean
  getMore: () => void
  filter: (props: GetPostListParams) => void
}

export const usePrimaryPostCategory = ({
  key,
  params,
}: usePrimaryPostListProps): usePrimaryPostCategoryRes => {
  const { data, isValidating, getMore, hasMore, isLoadingMore, filter } = useListQuery<
    PostCategory,
    GetPostListParams
  >({
    key,
    fetcher: postAPI.getPrimaryPostCategoryList,
    initialParams: params,
    config: {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  })

  return {
    data,
    isValidating,
    getMore,
    hasMore,
    isLoadingMore,
    filter,
  }
}
