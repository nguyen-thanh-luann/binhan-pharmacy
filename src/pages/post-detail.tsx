import { FilterOutlineIcon, TimesIcon } from '@/assets'
import {
  Breadcrumb,
  Modal,
  NotFound,
  Pagination,
  PostCategoryMenu,
  PostDetail,
  PostDetailLoading,
  PostItemLoading,
  PostListItemHorizontal,
} from '@/components'
import { DEFAULT_POST_LIMIT, SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import {
  fromProductSlugToProductId,
  generateProductSlug,
  isArrayHasValue,
  isObjectHasValue,
} from '@/helper'
import { useModal, usePostDetail, usePostList } from '@/hooks'
import { Main } from '@/templates'
import { Post } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const PostDetailPage = () => {
  const router = useRouter()
  const post_id = fromProductSlugToProductId((router?.query?.slug as string) || '')
  const parentCategoryId = fromProductSlugToProductId(
    (router?.query?.parent_category as string) || ''
  )
  const categoryId = fromProductSlugToProductId(router?.query?.category_id as string) || ''

  const { visible: showFilters, openModal: openFilters, closeModal: closeFilters } = useModal()

  const { data: postDetail, isValidating } = usePostDetail({
    key: `${SWR_KEY.get_post_detail}_${post_id}`,
    params: { post_id },
  })

  // At see more posts, prioritize filtering by category first, then by parent category.
  const {
    data: postList,
    isValidating: isLoadingPostList,
    paginate,
    limit,
    total,
    offset,
    filter,
  } = usePostList({
    key: `${SWR_KEY.get_post_list_related}`,
    params: {
      limit: DEFAULT_POST_LIMIT,
    },
  })

  useEffect(() => {
    filter({
      category_id: categoryId || parentCategoryId || undefined,
    })
  }, [parentCategoryId, categoryId])

  const renderderPostLoading = () => {
    return (
      <div>
        {Array.from({ length: 4 }).map((_, index) => (
          <PostItemLoading key={index} />
        ))}
      </div>
    )
  }

  const hanldePostClick = (data: Post) => {
    router.push({
      pathname: '/post-detail',
      query: {
        ...router.query,
        slug: generateProductSlug(data?.title, data?.id),
      },
    })
  }

  const handlePaginate = (page: number) => {
    paginate({ page })
  }

  return (
    <Main title={postDetail?.title || WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container my-24">
        {isValidating ? (
          <PostDetailLoading />
        ) : isObjectHasValue(postDetail) ? (
          <div>
            <Breadcrumb
              breadcrumbList={[
                {
                  path: '/',
                  name: 'Tin tức',
                },
              ]}
            />

            {/* filter in mobile */}
            <div className="block md:hidden">
              <div
                onClick={openFilters}
                className="p-8 flex-end md:hidden mb-12 items-center gap-4 cursor-pointer hover:text-primary duration-150"
              >
                <FilterOutlineIcon className="w-20 h-20" />
                <span className="text-base">Lọc</span>
              </div>

              {/* modal filter by postCategory in mobile */}
              <Modal
                visible={showFilters}
                animationType="slideFromLeft"
                headerClassName="hidden"
                modalClassName="h-full w-full max-w-[350px] fixed right-0"
              >
                <div>
                  <div className="flex-between bg-primary px-12 py-8">
                    <div onClick={closeFilters} className="cursor-pointer">
                      <TimesIcon className="text-white" />
                    </div>
                    <span className="flex-1 text-center text-white text-md">Lọc sản phẩm</span>
                  </div>

                  <div className="p-16 h-[100vh] overflow-scroll scrollbar-hide">
                    <PostCategoryMenu />
                  </div>
                </div>
              </Modal>
            </div>

            <div className="flex gap-24">
              {/* filter in desktop */}
              <div className="w-[300px] hidden md:block ">
                <div className="bg-white p-12 sticky top-header_group_height">
                  <PostCategoryMenu />
                </div>
              </div>

              <div className="flex-1 overflow-scroll scrollbar-hide">
                <PostDetail className="mb-32 bg-white" data={postDetail} />

                <div className="bg-white p-12">
                  {isLoadingPostList || isArrayHasValue(postList) ? (
                    <div>
                      <p className="mb-12 text-2xl font-bold capitalize border-b-2 border-primary">
                        Xem thêm bài viết
                      </p>

                      <div>
                        {isValidating ? (
                          <div>{renderderPostLoading()}</div>
                        ) : (
                          <div>
                            {postList?.map((post) =>
                              post?.id !== post_id ? (
                                <PostListItemHorizontal data={post} onClick={hanldePostClick} />
                              ) : null
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {!isValidating && isArrayHasValue(postList) && (
                    <Pagination
                      forcePage={offset / limit}
                      className={classNames('mt-[24px]')}
                      pageCount={Math.ceil(total / DEFAULT_POST_LIMIT)}
                      onPageChange={({ selected }) => handlePaginate(selected + 1)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NotFound notify="Không tìm thấy thông tin bài viết" />
        )}
      </div>
    </Main>
  )
}

export default PostDetailPage
