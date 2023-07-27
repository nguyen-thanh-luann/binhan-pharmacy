import { ArrowLeftIcon } from '@/assets'
import { Breadcrumb, CreatePostForm, NotFound, TinyMceEditor } from '@/components'
import { DEFAULT_LIMIT, SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { isAdmin } from '@/helper'
import { useChatAccount, useChatAdminAccount, usePostList, useUser } from '@/hooks'
import { AccountContainer, Main } from '@/templates'
import { CreatePost, Post } from '@/types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSWRConfig } from 'swr'

const CreatePostPage = () => {
  const { cache, mutate: mutateRemote } = useSWRConfig()

  const router = useRouter()
  const { post_id } = router.query
  const { userInfo } = useUser({})
  const { data: chatToken } = useChatAccount()
  const { data: chatInfo, updateChatAccountRole } = useChatAdminAccount()

  const postForm: Post = cache.get(`${SWR_KEY.post_form}`)?.data

  const type = postForm && post_id ? 'update' : 'create'
  const pageTitle = type === 'create' ? 'Tạo tin tức' : 'Cập nhật tin tức'

  const [content, setContent] = useState<string | undefined>(
    post_id && postForm?.content ? postForm?.content : undefined
  )

  const [step, setStep] = useState<number>(1) //step 1 is edit post content, step 2 is select image, categories,.... for this post

  const { createPost, updatePost } = usePostList({
    key: `${SWR_KEY.get_post_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  useEffect(() => {
    if (!post_id) {
      mutateRemote(SWR_KEY.post_form)
    }
  }, [post_id])

  const handleCreatePost = (params: CreatePost) => {
    createPost(params, () => {
      setContent(undefined)
      router.push('/account/post')
      toast.success('Thêm tin tức thành công!')
    })
  }

  const handleUpdatePost = (params: CreatePost) => {
    updatePost(
      { ...params, id: postForm.id },
      () => {
        setContent(undefined)
        router.push('/account/post')
        toast.success('Cập nhật tin tức thành công!')
      },
      () => {
        toast.error('Có lỗi xảy ra khi cập nhật tin tức!')
      }
    )
  }

  const hanldeSubmit = (params: CreatePost) => {
    if (postForm && post_id) {
      handleUpdatePost(params)
    } else {
      handleCreatePost(params)
    }
  }

  useEffect(() => {
    if (isAdmin(userInfo?.account)) {
      if (chatInfo && chatInfo?.role !== 'npp') {
        updateChatAccountRole({
          id: chatInfo?.id,
          role: 'npp',
        })
      }
    }
  }, [userInfo, chatInfo])

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: `${pageTitle}`,
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          <div className="flex-between flex-wrap border-b border-gray-200 pb-12 mb-24">
            <p className="text-xl capitalize font-semibold">
              {step === 1 ? `${pageTitle}` : 'Thông tin bài viết'}
            </p>

            {step === 2 && (
              <div
                onClick={() => setStep(1)}
                className="flex items-center gap-8 text-primary cursor-pointer"
              >
                <ArrowLeftIcon />
                <p className="text-md text-primary">Quay lại</p>
              </div>
            )}
          </div>

          {isAdmin(userInfo?.account) && chatToken ? (
            <div>
              {step === 2 && content ? (
                <div>
                  <CreatePostForm
                    onSubmit={(params) => {
                      if (content) {
                        hanldeSubmit({ ...params, content })
                      }
                    }}
                    type={type}
                    defaultValue={post_id ? postForm : undefined}
                  />
                </div>
              ) : (
                <div className="post_editor_account_page">
                  {/* <PostEditor
                    defaultValue={content}
                    onSubmit={(val) => {
                      // console.log({val});

                      setContent(val)
                      if (val) {
                        setStep(2)
                      }
                    }}
                  /> */}

                  <TinyMceEditor
                    defaultValue={content}
                    onSubmit={(val) => {
                      setContent(val)
                      if (val) {
                        setStep(2)
                      }
                    }}
                  />
                </div>
              )}
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

export default CreatePostPage
