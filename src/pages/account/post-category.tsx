import { PlusIcon } from '@/assets'
import {
  Breadcrumb,
  Button,
  NotFound,
  PostCategoryItem,
  PostCategoryItemLoading,
  PostCatgoryDetail,
  SearchField,
} from '@/components'
import { DEFAULT_LIMIT, SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { isAdmin, isArrayHasValue } from '@/helper'
import { useChatAccount, usePostCategory, useUser } from '@/hooks'
import { setPostCategoryForm } from '@/store'
import { AccountContainer, Main } from '@/templates'
import { BreadcrumbItem, PostCategory } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch } from 'react-redux'

const PostCategoryPage = () => {
  const router = useRouter()
  const { parent_id, parent_name } = router.query
  const { data: chatToken } = useChatAccount()
  const { userInfo } = useUser({})

  const [breadcrumbList, setBreadcrumbList] = useState<BreadcrumbItem[]>([
    {
      path: '/account/post-category',
      name: 'Danh mục tin tức',
    },
  ])

  const dispatch = useDispatch()

  const {
    data: postCategoryList,
    isValidating,
    hasMore,
    getMore,
    deletePostCategory,
    filter,
  } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const hanldeDeleteCategory = (id: string) => {
    deletePostCategory(
      id,
      () => {
        toast.success('Xóa danh mục thành công!')
      },
      () => {
        toast.error('Không thể xóa danh mục!')
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

  useEffect(() => {
    if (parent_id && parent_name) {
      setBreadcrumbList([
        {
          path: '/account/post-category',
          name: 'Danh mục tin tức',
        },
        {
          name: parent_name as string,
          path: `/account/post-category?parent_id=${parent_id}&parent_name=${parent_name}`,
        },
      ])
    } else {
      setBreadcrumbList([
        {
          path: '/account/post-category',
          name: 'Danh mục tin tức',
        },
      ])
    }
  }, [router.query])

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb breadcrumbList={breadcrumbList} />
      </div>

      <AccountContainer className="container mb-32">
        {parent_id && parent_name ? (
          <PostCatgoryDetail parent_id={parent_id as string} parent_name={parent_name as string} />
        ) : (
          <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
            <div className="flex-between flex-wrap border-b border-gray-200 pb-12 mb-24">
              <p className="text-xl capitalize font-semibold">Danh mục tin tức</p>

              <Button
                title="Thêm danh mục"
                className="py-8 px-20 active:opacity-50 duration-200 border border-primary"
                textClassName="text-primary"
                icon={<PlusIcon className="text-primary" />}
                onClick={() => {
                  router.push('/account/create-category')
                }}
              />
            </div>

            <div>
              <SearchField
                placeholder="Tìm theo tên danh mục"
                className={classNames('border rounded-lg p-12 mb-12')}
                onChangeWithDebounceValue={(val) =>
                  filter({
                    keyword: val,
                  })
                }
              />
            </div>

            {isAdmin(userInfo?.account) && chatToken ? (
              <div>
                {isValidating || isArrayHasValue(postCategoryList) ? (
                  <div>
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
                  </div>
                ) : (
                  <NotFound notify="Không tìm thấy danh mục nào!" />
                )}
              </div>
            ) : (
              // <SignupPostAdminForm className="md:w-[60%] mx-auto" />
              <NotFound notify="Tài khoản của bạn không được cấp phép" />
            )}
          </div>
        )}
      </AccountContainer>
    </Main>
  )
}

export default PostCategoryPage
