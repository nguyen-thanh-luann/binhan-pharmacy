import {
  Breadcrumb,
  NotFound,
  PostAdminItemLoading,
  PostListItemHorizontal,
  PostOwnerDetail,
} from '@/components'
import { DEFAULT_LIMIT, SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import {
  ValidAccountRoleToUsePostService,
  fromProductSlugToProductId,
  generateProductSlug,
  isArrayHasValue,
  transPostCategoryDataToSelectionType,
} from '@/helper'
import { usePostCategory, usePostList, useUser } from '@/hooks'
import { AccountContainer, Main } from '@/templates'
import { AccountType, BreadcrumbItem, OptionType, Post } from '@/types'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Select from 'react-select'

const YourNewsPage = () => {
  const router = useRouter()
  const { slug, title } = router?.query
  const post_id = fromProductSlugToProductId((slug as string) || '')
  const [breadcrumbList, setBreadcrumbList] = useState<BreadcrumbItem[]>([
    {
      path: '/account/your-news',
      name: 'Tin tức của bạn',
    },
  ])

  const { userInfo } = useUser({ shouldFetch: false })
  const userId = userInfo?.account?.partner_id
  const userRole: AccountType = ValidAccountRoleToUsePostService(userInfo)

  const {
    data: postList,
    isValidating,
    getMore,
    hasMore,
    filter,
  } = usePostList({
    key: `${SWR_KEY.get_post_list}_${userId}`,
    params: {
      limit: DEFAULT_LIMIT,
      role: userRole,
    },
  })

  const { data: postCategoryList } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}_${userId}`,
    params: {
      limit: DEFAULT_LIMIT,
      role: userRole,
    },
  })

  const categoryOptions: OptionType<string>[] | [] = useMemo(() => {
    return transPostCategoryDataToSelectionType(postCategoryList || [])
  }, [postCategoryList])

  const renderPostLoading = () => {
    return (
      <div>
        {Array.from({ length: 4 }).map((_, index) => (
          <PostAdminItemLoading key={index} />
        ))}
      </div>
    )
  }

  const hanldePostClick = (data: Post) => {
    router.push({
      pathname: '/account/your-news',
      query: {
        slug: generateProductSlug(data?.title, data?.id),
        title: data?.title,
      },
    })
  }

  useEffect(() => {
    if (post_id && title) {
      setBreadcrumbList([
        {
          path: '/account/your-news',
          name: 'Tin tức của bạn',
        },
        {
          path: '',
          name: title as string,
        },
      ])
    } else {
      setBreadcrumbList([
        {
          path: '/account/your-news',
          name: 'Tin tức của bạn',
        },
      ])
    }
  }, [router.query])

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb breadcrumbList={...breadcrumbList} />
      </div>

      <AccountContainer className="container mb-32">
        {post_id ? (
          <PostOwnerDetail post_id={post_id} />
        ) : (
          <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
            <div className="flex-between flex-wrap border-b border-gray-200 pb-12 mb-24">
              <p className="text-xl capitalize font-semibold">Tin của bạn</p>
            </div>

            <div>
              <div className="mb-12">
                <p className="title_md mb-8">Lọc theo danh mục</p>
                <div className="">
                  <Select
                    className="w-[300px] text_md"
                    defaultValue={{ label: 'Tất cả', value: '' }}
                    placeholder={'Danh mục'}
                    options={[{ label: 'Tất cả', value: '' }, ...categoryOptions]}
                    onChange={(val) => filter({ category_id: val?.value || '', role: userRole })}
                  />
                </div>
              </div>

              {isValidating || isArrayHasValue(postList) ? (
                <div>
                  <InfiniteScroll
                    dataLength={postList?.length || 0}
                    next={() => getMore()}
                    hasMore={hasMore}
                    loader={hasMore ? renderPostLoading() : null}
                  >
                    <div>
                      {isValidating ? (
                        <div>{renderPostLoading()}</div>
                      ) : (
                        <div>
                          {postList?.map((post) => (
                            <PostListItemHorizontal
                              data={post}
                              onClick={hanldePostClick}
                              imageClassName="!w-[100px] !h-[100px]"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </InfiniteScroll>
                </div>
              ) : (
                <NotFound notify="Không tìm thấy bài viết nào!" />
              )}
            </div>
          </div>
        )}
      </AccountContainer>
    </Main>
  )
}

export default YourNewsPage
