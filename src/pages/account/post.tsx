import { PlusIcon, TimesIcon } from '@/assets'
import {
  Breadcrumb,
  Button,
  Modal,
  ModalConfirm,
  NotFound,
  PostAdminItem,
  PostAdminItemLoading,
  PostContentDetail
} from '@/components'
import EditPost from '@/components/post/editPost'
import { DEFAULT_LIMIT, SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { isAdmin, isArrayHasValue, transPostCategoryDataToSelectionType } from '@/helper'
import { useChatAccount, usePostCategory, usePostList, useUser } from '@/hooks'
import { selectPostForm, setPostForm } from '@/store'
import { AccountContainer, Main } from '@/templates'
import { OptionType, Post } from '@/types'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'

const PostPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { userInfo } = useUser({})
  const { data: chatToken } = useChatAccount()
  const [currentPostId, setCurrentPostId] = useState<string | undefined>()
  const [currentPostContent, setCurrentPostContent] = useState<string | undefined>()
  const postForm: Post = useSelector(selectPostForm)

  const {
    data: postList,
    isValidating,
    getMore,
    hasMore,
    deletePost,
    filter,
  } = usePostList({
    key: `${SWR_KEY.get_post_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const { data: postCategoryList } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const handleDeletePost = (id: string) => {
    deletePost(
      id,
      () => {
        setCurrentPostId(undefined)
        toast.success('Xóa tin tức thành công!')
      },
      () => {
        toast.error('Có lỗi xảy ra!')
      }
    )
  }

  const handleEditPostClick = (post: Post) => {
    dispatch(setPostForm(post))
  }

  const resetPostForm = () => {
    dispatch(setPostForm(undefined))
  }

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

          {isAdmin(userInfo?.account) && chatToken ? (
            <div>
              <div className="mb-12">
                <p className="title_md mb-8">Lọc theo danh mục</p>
                <div className="">
                  <Select
                    className="w-[300px] text_md"
                    defaultValue={{ label: 'Tất cả', value: '' }}
                    placeholder={'Danh mục'}
                    options={[{ label: 'Tất cả', value: '' }, ...categoryOptions]}
                    onChange={(val) => filter({ category_id: val?.value || '' })}
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
                            <PostAdminItem
                              post={post}
                              key={post.id}
                              onClickDelete={() => {
                                setCurrentPostId(post?.id)
                              }}
                              onClickDetail={() => {
                                setCurrentPostContent(post?.content)
                              }}
                              onClickEdit={() => handleEditPostClick(post)}
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

              {/* modal confirm delete post */}
              <ModalConfirm
                title="Bạn có chắc muốn xóa bài viết?"
                onConfirm={() => {
                  if (currentPostId) handleDeletePost(currentPostId)
                }}
                onDeny={() => setCurrentPostId(undefined)}
                visible={currentPostId !== undefined}
              />

              {/* show post detail */}
              <Modal
                visible={currentPostContent !== undefined}
                modalClassName={`h-[90%] w-[90%] md:w-[60%] mx-auto`}
                animationType="slideUp"
                header={
                  <div className="flex-between p-18">
                    <p className="text-lg font-bold capitalize">Xem trước thông tin</p>

                    <div
                      className="cursor-pointer hover:opacity-50 duration-150 ease-in-out"
                      onClick={() => {
                        setCurrentPostContent(undefined)
                      }}
                    >
                      <TimesIcon className="w-18 h-18 text-gray-500" />
                    </div>
                  </div>
                }
              >
                <div className="relative">
                  <PostContentDetail content={currentPostContent || ''} />
                </div>
              </Modal>

              {/* modal edit post */}
              <Modal
                visible={postForm !== undefined}
                modalClassName={`h-[90%] w-[90%] md:w-[60%] mx-auto`}
                animationType="slideUp"
                header={
                  <div className="flex-between p-18">
                    <p className="text-lg font-bold capitalize">Cập nhật thông tin</p>
                    <div
                      className="cursor-pointer hover:opacity-50 duration-150 ease-in-out"
                      onClick={() => resetPostForm()}
                    >
                      <TimesIcon className="w-18 h-18 text-gray-500" />
                    </div>
                  </div>
                }
              >
                <div className="relative">
                  <EditPost onSuccess={() => resetPostForm()} />
                </div>
              </Modal>
            </div>
          ) : (
            // <SignupPostAdminForm className="md:w-[60%] mx-auto" />
            <NotFound notify="Tài khoản của bạn không được cấp phép" />
          )}
        </div>
      </AccountContainer>
    </Main>
  )
}

export default PostPage
