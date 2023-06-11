import { postAPI } from '@/services'
import { setBackdropVisible } from '@/store'
import { CreatePostTagReq, GetPostListParams, PostTag, QueryList, UpdatePostTagReq } from '@/types'
import { useDispatch } from 'react-redux'
import { useListQuery } from '../common'

interface usePostTagProps {
  key: string
  params?: QueryList
}

interface usePostTagRes {
  data: PostTag[] | undefined
  isValidating: boolean
  hasMore: boolean
  isLoadingMore: boolean
  getMore: () => void
  createPostTag: (
    params: CreatePostTagReq,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => void

  updatePostTag: (
    params: UpdatePostTagReq,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => void

  deletePostTag: (props: PostTag, handleSuccess?: () => void, handleError?: () => void) => void
  reStorePostTag: (props: PostTag, handleSuccess?: () => void, handleError?: () => void) => void

  filter: (props: GetPostListParams) => void
}

export const usePostTag = ({ key, params }: usePostTagProps): usePostTagRes => {
  const dispatch = useDispatch()

  const { data, isValidating, getMore, hasMore, isLoadingMore, mutate, filter } = useListQuery<
    PostTag,
    QueryList
  >({
    key,
    fetcher: postAPI.getPostTagList,
    initialParams: params,
    config: {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  })

  const createPostTag = async (
    params: CreatePostTagReq,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => {
    try {
      dispatch(setBackdropVisible(true))
      const res: any = await postAPI.createPostTag(params)

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

  const deletePostTag = async (
    props: PostTag,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => {
    try {
      dispatch(setBackdropVisible(true))
      const res: any = await postAPI.deletePostTag(props?.id)

      dispatch(setBackdropVisible(false))

      if (res?.success) {
        handleSuccess?.()
        mutate(
          [...data?.map((tag) => (tag.id === props.id ? { ...tag, active: !tag.active } : tag))],
          false
        )
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

  const reStorePostTag = async (
    props: PostTag,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => {
    try {
      dispatch(setBackdropVisible(true))
      const res: any = await postAPI.restorePostTag(props?.id)

      dispatch(setBackdropVisible(false))

      if (res?.success) {
        handleSuccess?.()
        mutate(
          [...data?.map((tag) => (tag.id === props.id ? { ...tag, active: !tag.active } : tag))],
          false
        )
        // mutate([...data.filter((post) => post.id !== id)], false)
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

  const updatePostTag = async (
    params: UpdatePostTagReq,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => {
    try {
      dispatch(setBackdropVisible(true))
      const res: any = await postAPI.updatePostTag(params)

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
    createPostTag,
    deletePostTag,
    updatePostTag,
    reStorePostTag,
    filter,
  }
}
