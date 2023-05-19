import { postAPI } from '@/services'
import { GetPostDetailParams, PostDetail } from '@/types'
import useSWR from 'swr'

interface usePostDetailProps {
  key: string
  shouldFetch?: boolean
  params: GetPostDetailParams
}

interface usePostDetailRes {
  data: PostDetail
  isValidating: boolean
}

export const usePostDetail = ({
  shouldFetch = true,
  key,
  params,
}: usePostDetailProps): usePostDetailRes => {
  const { data, isValidating } = useSWR(
    key,
    !shouldFetch ? null : () => postAPI.getPostDetail(params).then((res: any) => res?.data),
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
