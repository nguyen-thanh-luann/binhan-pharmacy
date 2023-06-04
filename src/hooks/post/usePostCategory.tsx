import { postAPI } from '@/services'
import { setBackdropVisible } from '@/store'
import { CreatePostCategory, GetPostListParams, PostCategory, UpdateCategory } from '@/types'
import { useDispatch } from 'react-redux'
import { useListQuery } from '../common'

interface usePostListProps {
  key: string
  params?: GetPostListParams
}

interface usePostCategoryRes {
  data: PostCategory[] | undefined
  isValidating: boolean
  hasMore: boolean
  isLoadingMore: boolean
  getMore: () => void
  createCategory: (
    props: CreatePostCategory,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => void
  deletePostCategory: (id: string, handleSuccess?: () => void, hanldeError?: () => void) => void
  updateCategory: (
    params: UpdateCategory,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => void
  filter: (props: GetPostListParams) => void
}

export const usePostCategory = ({ key, params }: usePostListProps): usePostCategoryRes => {
  const dispatch = useDispatch()

  const { data, isValidating, getMore, hasMore, isLoadingMore, mutate, filter } = useListQuery<
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

  const createCategory = async (
    props: CreatePostCategory,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => {
    try {
      dispatch(setBackdropVisible(true))
      const res: any = await postAPI.createCategory(props)

      if (res?.id) {
        handleSuccess?.()
        mutate([res, ...data], true)
      } else {
        handleError?.()
        return
      }

      dispatch(setBackdropVisible(false))
    } catch (err) {
      dispatch(setBackdropVisible(false))
      console.log(err)
      handleError?.()
    }
  }

  const deletePostCategory = async (
    id: string,
    handleSuccess?: () => void,
    hanldeError?: () => void
  ) => {
    try {
      dispatch(setBackdropVisible(true))
      const res: any = await postAPI.deleteCategory(id)

      if (res?.category_id) {
        handleSuccess?.()

        mutate([...data.filter((postCate) => postCate?.id !== id)], true)
      } else {
        hanldeError?.()
      }

      dispatch(setBackdropVisible(false))
    } catch (err) {
      hanldeError?.()
      dispatch(setBackdropVisible(false))
      console.log(err)
    }
  }

  const updateCategory = async (
    params: UpdateCategory,
    handleSuccess?: () => void,
    handleError?: () => void
  ) => {
    try {
      dispatch(setBackdropVisible(true))
      const res: any = await postAPI.updateCategory(params)

      if (res?.id) {
        handleSuccess?.()
        mutate(
          data?.map((p) => (p.id === res.id ? res : p)),
          true
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

  return {
    data,
    isValidating,
    getMore,
    hasMore,
    isLoadingMore,
    createCategory,
    deletePostCategory,
    updateCategory,
    filter,
  }
}
