import { PlusIcon } from '@/assets'
import {
  Breadcrumb,
  Button,
  NotFound,
  PostAdminItem,
  SignupPostAdminForm,
  Spinner,
} from '@/components'
import { DEFAULT_LIMIT, SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useChatAccount, usePostList } from '@/hooks'
import { AccountContainer, Main } from '@/templates'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useRouter } from 'next/router'

const PostPage = () => {
  const router = useRouter()
  const { data: chatToken } = useChatAccount()

  const {
    data: postList,
    isValidating,
    getMore,
    hasMore,
  } = usePostList({
    key: `${SWR_KEY.get_post_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: 'Tin tức',
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          <div className="flex-between flex-wrap border-b border-gray-200 pb-12 mb-24">
            <p className="text-xl capitalize font-semibold">Tin tức</p>

            <Button
              title="Thêm tin tức"
              className="py-8 px-20 active:opacity-50 duration-200 border border-primary"
              textClassName="text-primary"
              icon={<PlusIcon className="text-primary" />}
              onClick={() => {
                router.push('/account/add-post')
              }}
            />
          </div>

          {chatToken ? (
            <div>
              {isValidating || isArrayHasValue(postList) ? (
                <div>
                  <InfiniteScroll
                    dataLength={postList?.length || 0}
                    next={() => getMore()}
                    hasMore={hasMore}
                    loader={hasMore ? <Spinner /> : null}
                  >
                    <div>
                      {isValidating ? (
                        <div>
                          <Spinner />
                        </div>
                      ) : (
                        <div>
                          {postList?.map((post) => (
                            <PostAdminItem post={post} key={post.id} />
                          ))}
                        </div>
                      )}
                    </div>
                  </InfiniteScroll>
                </div>
              ) : (
                <NotFound notify="Không tìm thấy danh mục nào!" />
              )}
            </div>
          ) : (
            <SignupPostAdminForm className="md:w-[60%] mx-auto" />
          )}
        </div>
      </AccountContainer>
    </Main>
  )
}

export default PostPage
