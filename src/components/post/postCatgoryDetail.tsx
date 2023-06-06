import { TimesIcon } from '@/assets'
import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { isArrayHasValue, transPostCategoryDataToSelectionType } from '@/helper'
import { usePostCategory } from '@/hooks'
import { selectPostCategoryForm, setPostCategoryForm } from '@/store'
import { CreatePostCategory, OptionType, PostCategory } from '@/types'
import classNames from 'classnames'
import { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import { PostCategoryForm } from '../form'
import { Modal } from '../modal'
import { NotFound } from '../notFound'
import { PostCategoryItem } from './postCategoryItem'
import { PostCategoryItemLoading } from './postCategoryItemLoading'
import { useRouter } from 'next/router'

interface PostCatgoryDetailProps {
  parent_id: string
  parent_name: string
  className?: string
}

export const PostCatgoryDetail = ({
  parent_id,
  parent_name,
  className,
}: PostCatgoryDetailProps) => {
  const router = useRouter()
  const dispatch = useDispatch()

  console.log({
    parent_id,
    parent_name,
  })

  const currentPostCategory: PostCategory = useSelector(selectPostCategoryForm)

  const {
    data: postCategoryList,
    isValidating,
    hasMore,
    getMore,
    filter,
    deletePostCategory,
    updateCategory,
  } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}_${parent_id}`,
    params: {
      parent_id: parent_id,
      limit: DEFAULT_LIMIT,
    },
  })

  useEffect(() => {
    filter({
      parent_id,
    })
  }, [parent_id])

  const categoryOptions: OptionType<string>[] | undefined = useMemo(() => {
    return transPostCategoryDataToSelectionType(postCategoryList || [])
  }, [postCategoryList])

  const hanldeDeleteCategory = (id: string) => {
    deletePostCategory(
      id,
      () => {
        toast.success('Xóa danh mục thành công!')
      },
      () => {
        toast.error('Có lỗi xảy ra!')
      }
    )
  }

  const handleUpdateCategory = (data: CreatePostCategory) => {
    updateCategory(
      { ...data, id: currentPostCategory?.id },
      () => {
        dispatch(setPostCategoryForm(undefined))
        toast.success('Cập nhật thông tin thành công!')
      },
      () => {
        toast.error('Có lỗi xảy ra!')
      }
    )
  }

  const handleSelectCategoryItemEdit = (item: PostCategory) => {
    dispatch(setPostCategoryForm(item))
  }

  const handlePostCategoryClick = (item: PostCategory) => {
    if (!item) return
    router.push({
      pathname: '/account/post-category',
      query: {
        parent_id: item?.id,
        parent_name: item.name,
      },
    })
  }

  return (
    <div className={classNames('bg-white', className)}>
      <p className="text-center text-lg font-bold p-12">{parent_name}</p>

      {isValidating ? (
        <PostCategoryItemLoading />
      ) : isArrayHasValue(postCategoryList) ? (
        <div className="max-h-[80vh] overflow-scroll scrollbar-hide">
          <InfiniteScroll
            dataLength={postCategoryList?.length || 0}
            next={() => getMore()}
            hasMore={hasMore}
            loader={hasMore ? <PostCategoryItemLoading /> : null}
          >
            <div>
              {isValidating ? (
                <div>
                  <PostCategoryItemLoading />
                </div>
              ) : (
                <div>
                  {postCategoryList?.map((category) => {
                    return (
                      <div key={category.id}>
                        <PostCategoryItem
                          className="mb-12"
                          data={category}
                          key={category.id}
                          onDelete={hanldeDeleteCategory}
                          onEdit={handleSelectCategoryItemEdit}
                          onClick={handlePostCategoryClick}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </InfiniteScroll>
        </div>
      ) : (
        <NotFound notify="Không tìm thấy danh mục con nào!" />
      )}

      <Modal
        visible={currentPostCategory !== undefined}
        headerClassName="hidden"
        modalClassName="w-[90%] md:w-[500px] max-w-[90vw] h-fit"
      >
        <div>
          <div className="flex-between p-12">
            <p className="text-md">Cập nhật danh mục</p>
            <div
              className="cursor-pointer"
              onClick={() => {
                dispatch(setPostCategoryForm(undefined))
              }}
            >
              <TimesIcon />
            </div>
          </div>

          <div className="max-h-[400px] h-fit overflow-scroll scrollbar-hide p-12">
            <PostCategoryForm onSubmit={handleUpdateCategory} categoryOptions={categoryOptions} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
