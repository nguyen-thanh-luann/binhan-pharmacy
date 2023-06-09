import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { usePostCategory } from '@/hooks'
import { setPostCategoryForm } from '@/store'
import { PostCategory } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch } from 'react-redux'
import { NotFound } from '../notFound'
import { PostCategoryItem } from './postCategoryItem'
import { PostCategoryItemLoading } from './postCategoryItemLoading'

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

  const {
    data: postCategoryList,
    isValidating,
    hasMore,
    getMore,
    filter,
    deletePostCategory,
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

  const handleSelectCategoryItemEdit = (item: PostCategory) => {
    dispatch(setPostCategoryForm(item))
    router.push(`/account/create-category?category_id=${item.id}`)
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
    <div className={classNames('bg-white p-12', className)}>
      <p className="text-center text-lg font-bold mb-12">{parent_name}</p>

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
    </div>
  )
}
