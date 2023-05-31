import {
  Breadcrumb,
  PostCategoryMenu,
  PostDetail,
  PostItemLoading,
  PostListItemHorizontal,
  Spinner,
} from '@/components'
import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { fromProductSlugToProductId, isArrayHasValue, isObjectHasValue } from '@/helper'
import { usePostDetail, usePostList } from '@/hooks'
import { postAPI } from '@/services'
import { Main } from '@/templates'
import { Post } from '@/types'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'

type IPostUrl = {
  slug: string
}

export const getStaticPaths: GetStaticPaths<IPostUrl> = async () => {
  try {
    const res: any = await postAPI.getPostList({})

    return {
      paths: res?.data?.data?.map((post: Post) => ({
        params: { slug: post?.id },
      })),
      fallback: false,
    }
  } catch (err) {
    console.log(err)
    return {
      paths: [],
      fallback: false,
    }
  }
}

export const getStaticProps: GetStaticProps<IPostUrl, IPostUrl> = async ({ params }) => {
  return {
    props: {
      slug: params!.slug,
    },
  }
}

const PostDetailPage = () => {
  const router = useRouter()
  const post_id = fromProductSlugToProductId((router.query.slug as string) || '')
  const { data: postDetail, isValidating } = usePostDetail({
    key: `${SWR_KEY.get_post_detail}_${post_id}`,
    params: { post_id },
  })

  const {
    data: postList,
    isValidating: isLoadingPostList,
    getMore,
    hasMore,
  } = usePostList({
    key: `${SWR_KEY.get_post_list_related}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const renderderPostLoading = () => {
    return (
      <div>
        {Array.from({ length: 4 }).map((_, index) => (
          <PostItemLoading key={index} />
        ))}
      </div>
    )
  }

  return (
    <Main title="" description="">
      <div className="container my-24">
        {isValidating ? (
          <div className="flex-center">
            <Spinner />
          </div>
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

            <div className="flex gap-24">
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

                      <InfiniteScroll
                        dataLength={postList?.length || 0}
                        next={() => getMore()}
                        hasMore={hasMore}
                        loader={hasMore ? renderderPostLoading() : null}
                      >
                        <div>
                          {isLoadingPostList ? (
                            <div>{renderderPostLoading()}</div>
                          ) : (
                            <div>
                              {postList?.map((post) =>
                                post?.id !== post_id ? <PostListItemHorizontal data={post} /> : null
                              )}
                            </div>
                          )}
                        </div>
                      </InfiniteScroll>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Main>
  )
}

export default PostDetailPage
