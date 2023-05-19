import { SWR_KEY } from '@/constants'
import { postAPI } from '@/services'
import { GetPostListParams, ListRes, Post } from '@/types'
import useSWR from 'swr'

interface usePostListProps {
  key?: string
  shouldFetch?: boolean
  params?: GetPostListParams
}

interface usePostListRes {
  data: ListRes<Post[]> | undefined
  isValidating: boolean
}

export const usePostList = ({
  shouldFetch = true,
  key,
  params
}: usePostListProps): usePostListRes => {
  const { data, isValidating } = useSWR(
    key ? key : SWR_KEY.get_post_list,
    !shouldFetch
      ? null
      : () => postAPI.getPostList({...params}).then((res) => res?.data),
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
