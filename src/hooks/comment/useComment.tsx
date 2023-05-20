import ratingAPI from '@/services/ratingAPI'
import { Comment, CreateCommentParams, GetCommentsRatingsParams } from '@/types'
import { useAsync } from '../common'
import { useQueryListV2 } from '../common/useQueryV2'

interface useCommentProps {
  key: string
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
  deleteComment: (comment_id: number, cb?: () => void) => void
  getMore: () => void
}

export const useComment = ({ key, params }: useCommentProps): useCommentRes => {
  const { asyncHandler, isLoading: isCreateComment } = useAsync()

  const { data, mutate, isValidating, getMore, hasMore, isLoadingMore } = useQueryListV2<
    Comment,
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

  const createComment = async ({ content, product_id, onSuccess }: CreateCommentParams) => {
    asyncHandler({
      fetcher: ratingAPI.createComment({ content, product_id }),
      onSuccess: (res: Comment) => {
        // console.log({ res })

        mutate([res, ...data], false)

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
    try {
      const res: any = await ratingAPI.deleteComment(comment_id)

      if (res?.success) {
        mutate([...data.filter((comment) => comment.comment_id !== comment_id)], false)
        cb?.()
      }
    } catch (err) {
      console.log(err)
    }
  }

  return {
    comments: data || [],
    isValidating,
    hasMore,
    isLoadingMore,
    isCreateComment,
    createComment,
    deleteComment,
    getMore,
  }
}
