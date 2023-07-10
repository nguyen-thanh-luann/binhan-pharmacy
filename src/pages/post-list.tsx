import { FilterOutlineIcon, TimesIcon } from '@/assets'
import {
  Breadcrumb,
  Modal,
  Pagination,
  PostCategoryMenu,
  PostItemLoading,
  PostListItemHorizontal,
  PostListItemVertical,
} from '@/components'
import {
  DEFAULT_POST_LIMIT,
  DOMAIN_URL,
  SWR_KEY,
  thumbnailImageUrl,
  WEB_DESCRIPTION,
  WEB_TITTLE,
} from '@/constants'
import { fromProductSlugToProductId, generateProductSlug, isArrayHasValue } from '@/helper'
import { useModal, usePostList } from '@/hooks'
import { Main, PostListPageContainer } from '@/templates'
import { Post } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSWRConfig } from 'swr'

const PostListPage = () => {
  const router = useRouter()
  const { cache } = useSWRConfig()
  const { visible: showFilters, openModal: openFilters, closeModal: closeFilters } = useModal()

  const current_post_parent_id = cache.get(SWR_KEY.current_post_parent_category)?.data || ''

  const { category_id, tag_ids } = router.query

  const {
    data: postList,
    isValidating,
    filter,
    offset,
    limit,
    paginate,
    total,
  } = usePostList({
    key: `${SWR_KEY.get_post_list}`,
    params: {
      limit: DEFAULT_POST_LIMIT,
    },
  })

  useEffect(() => {
    filter({
      category_id: category_id
        ? fromProductSlugToProductId(category_id as string)
        : current_post_parent_id || undefined,
      tag_ids: [tag_ids] as string[],
    })
  }, [category_id, current_post_parent_id, tag_ids])

  const [firstPost, secondPost, ...postData] = postList || []

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
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container px-12 mb-32 min-h-[100vh]">
        <Breadcrumb
          breadcrumbList={[
            {
              name: 'Tin tức',
              path: '/',
            },
          ]}
        />

        <div>
          <div
            onClick={openFilters}
            className="py-8  flex-end md:hidden mb-12 items-center gap-4 cursor-pointer hover:text-primary duration-150"
          >
            <FilterOutlineIcon className="w-20 h-20" />
            <span className="text-base">Lọc</span>
          </div>

          {/* modal in mobile */}
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

          <div className="mb-24">
            {isValidating ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                {Array.from({ length: 2 }).map((_, index) => (
                  <PostItemLoading key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                {firstPost && <PostListItemVertical data={firstPost} onClick={hanldePostClick} />}

                {secondPost && <PostListItemVertical data={secondPost} onClick={hanldePostClick} />}
              </div>
            )}
          </div>

          <PostListPageContainer
            leftChildren={
              <div className="">
                <PostCategoryMenu className="sticky top-header_group_height" />
              </div>
            }
          >
            <div>
              {isValidating || isArrayHasValue(postData) ? (
                <div>
                  <div>
                    {isValidating ? (
                      <div>{renderderPostLoading()}</div>
                    ) : (
                      <div>
                        {postData?.map((post) => (
                          <PostListItemHorizontal data={post} onClick={hanldePostClick} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </PostListPageContainer>
        </div>

        {!isValidating && (
          <Pagination
            forcePage={offset / limit}
            className={classNames('mt-[24px]')}
            pageCount={Math.ceil(total / DEFAULT_POST_LIMIT)}
            onPageChange={({ selected }) => handlePaginate(selected + 1)}
          />
        )}
      </div>
    </Main>
  )
}

export default PostListPage

export const getStaticProps = async () => {
  return {
    props: {
      openGraphData: [
        {
          property: 'og:image',
          content: thumbnailImageUrl,
          key: 'ogimage',
        },
        {
          property: 'og:image:alt',
          content: thumbnailImageUrl,
          key: 'ogimagealt',
        },
        {
          property: 'og:image:width',
          content: '400',
          key: 'ogimagewidth',
        },
        {
          property: 'og:image:height',
          content: '300',
          key: 'ogimageheight',
        },
        {
          property: 'og:url',
          content: DOMAIN_URL,
          key: 'ogurl',
        },
        {
          property: 'og:image:secure_url',
          content: thumbnailImageUrl,
          key: 'ogimagesecureurl',
        },
        {
          property: 'og:title',
          content: WEB_TITTLE,
          key: 'ogtitle',
        },
        {
          property: 'og:description',
          content: WEB_DESCRIPTION,
          key: 'ogdesc',
        },
        {
          property: 'og:type',
          content: 'website',
          key: 'website',
        },
      ],
    },
  }
}
