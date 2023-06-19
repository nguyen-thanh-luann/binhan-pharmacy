import { postAPI } from '@/services'
import { setBackdropVisible } from '@/store'
import { CreatePost, GetPostListParams, Post, UpdatePost } from '@/types'
import { useDispatch } from 'react-redux'
import { useListQuery } from '../common'

interface usePostListProps {
  key: string
  params?: GetPostListParams
}

interface usePostListRes {
  data: Post[] | undefined
  isValidating: boolean
  hasMore: boolean
  isLoadingMore: boolean
  getMore: () => void
  createPost: (params: CreatePost, handleSuccess?: () => void, handleError?: () => void) => void
  updatePost: (params: UpdatePost, handleSuccess?: () => void, handleError?: () => void) => void
  deletePost: (id: string, handleSuccess?: () => void, handleError?: () => void) => void
  filter: (props: GetPostListParams) => void
  paginate: (props: GetPostListParams) => void
  offset: number,
  limit: number
  total: number
}

export const usePostList = ({ key, params }: usePostListProps): usePostListRes => {
  const dispatch = useDispatch()

  const { data, isValidating, getMore, hasMore, isLoadingMore, mutate, filter, paginate, offset, limit, total } =
    useListQuery<Post, GetPostListParams>({
      key,
      fetcher: postAPI.getPostList,
      initialParams: params,
      config: {
        revalidateOnFocus: false,
        dedupingInterval: 60000,
      },
    })

  const createPost = async (
    params: CreatePost,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => {
    try {
      dispatch(setBackdropVisible(true))
      const res: any = await postAPI.createPost(params)
      // console.log({ res })

      if (res?.success) {
        handleSuccess?.()

        mutate([res?.data, ...data], false)
      } else {
        handleError?.()
      }

      dispatch(setBackdropVisible(false))
    } catch (err) {
      handleError?.()
      dispatch(setBackdropVisible(false))
      console.log(err)
    }
  }

  const deletePost = async (id: string, handleSuccess?: () => void, handleError?: () => void) => {
    try {
      dispatch(setBackdropVisible(true))
      const res: any = await postAPI.deletePost(id)

      dispatch(setBackdropVisible(false))

      if (res?.success) {
        handleSuccess?.()

        mutate([...data.filter((post) => post.id !== id)], false)
      } else {
        handleError?.()
      }
      dispatch(setBackdropVisible(false))
    } catch (err) {
      dispatch(setBackdropVisible(false))
      handleError?.()
      console.log(err)
    }
  }

  const updatePost = async (
    params: UpdatePost,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => {
    try {
      dispatch(setBackdropVisible(true))
      const res: any = await postAPI.updatePost(params)

      if (res?.success) {
        handleSuccess?.()
        mutate(data, true)
      } else {
        handleError?.()
      }

      dispatch(setBackdropVisible(false))
    } catch (err) {
      handleError?.()
      dispatch(setBackdropVisible(false))
      console.log(err)
    }
  }

  return {
    data,
    isValidating,
    getMore,
    hasMore,
    isLoadingMore,
    createPost,
    deletePost,
    updatePost,
    filter,
    paginate,
    offset,
    limit,
    total
  }
}
