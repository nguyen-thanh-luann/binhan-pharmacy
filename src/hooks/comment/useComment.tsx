import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import ratingAPI from '@/services/ratingAPI'
import { Comment, CreateCommentParams, GetCommentsRatingsParams, QueryList } from '@/types'
import useSWR from 'swr'
import { useAsync } from '../common'
import { useState } from 'react'

interface useCommentProps {
  key?: string
  shouldFetch?: boolean
  params: GetCommentsRatingsParams
}

interface useCommentRes {
  comments: Comment[] | undefined
  isValidating: boolean
  isCreateComment: boolean
  hasMore: boolean
  isLoadingMore: boolean
  createComment: (props: CreateCommentParams) => void
  hanldeLoadMore: (_: QueryList) => void
  deleteComment: (comment_id: number, cb?: () => void) => void
}

export const useComment = ({ shouldFetch = true, key, params }: useCommentProps): useCommentRes => {
  const { asyncHandler, isLoading: isCreateComment } = useAsync()

  const [isLoadingMore, setLoadingMore] = useState<boolean>(false)
  const [hasMore, setHasmore] = useState<boolean>(false)
  const [offset, setOffset] = useState<number>(0)

  const { data, isValidating, mutate } = useSWR(
    key ? key : SWR_KEY.get_product_comment,
    !shouldFetch
      ? null
      : () =>
          ratingAPI.getRatingsByProduct(params).then((res) => {
            setHasmore(res?.data?.comment?.paginate?.total > res?.data?.comment?.paginate?.limit)
            return res?.data?.comment
          }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  const createComment = async ({ content, product_id, onSuccess }: CreateCommentParams) => {
    asyncHandler({
      fetcher: ratingAPI.createComment({ content, product_id }),
      onSuccess: (res: Comment) => {
        console.log({ res })

        mutate(
          {
            ...data,
            result: [res, ...data?.result],
          },
          false
        )

        onSuccess?.()
      },
      config: {
        errorMsg: 'Thêm bình luận không thành công!',
        showBackdrop: false,
        showSuccessMsg: false,
        setLoadingState: true,
      },
    })
  }

  const deleteComment = async (comment_id: number, cb?: () => void) => {
    const res: any = await ratingAPI.deleteComment(comment_id)

    if (res?.success) {
      mutate(
        {
          ...data,
          result: [
            ...data?.result?.filter((comment: Comment) => comment?.comment_id !== comment_id),
          ],
        },
        false
      )
      cb?.()
    }
  }

  const hanldeLoadMore = async (_: QueryList) => {
    if (!hasMore || isValidating) return

    const { limit = DEFAULT_LIMIT } = _

    try {
      setLoadingMore(true)
      const newOffset = offset + limit

      const res: any = await ratingAPI.getRatingsByProduct({
        ...params,
        offset: newOffset,
        limit,
      })

      setLoadingMore(false)
      setHasmore(res?.data?.comment?.paginate?.total >= limit)
      setOffset(newOffset)

      mutate([...data, res?.data?.comment], false)
    } catch (error) {
      setLoadingMore(false)
    }
  }

  return {
    comments: data?.result || [],
    isValidating,
    hasMore,
    isLoadingMore,
    isCreateComment,
    createComment,
    hanldeLoadMore,
    deleteComment,
  }
}
