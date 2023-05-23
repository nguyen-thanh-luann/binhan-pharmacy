import { TimesIcon } from '@/assets'
import { Breadcrumb, CreatePostForm, Modal, PostEditor, SignupPostAdminForm } from '@/components'
import { DEFAULT_LIMIT, SWR_KEY, WEB_DESCRIPTION, WEB_TITTLE } from '@/constants'
import { useChatAccount, usePostCategory, usePostList } from '@/hooks'
import { AccountContainer, Main } from '@/templates'
import { CreatePost, OptionType } from '@/types'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

const CreatePostPage = () => {
  const router = useRouter()

  const { data: chatToken } = useChatAccount()
  const [content, setContent] = useState<string>()

  const { createPost } = usePostList({
    key: `${SWR_KEY.get_post_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const handleCreatePost = (params: CreatePost) => {
    createPost(params, () => {
      setContent(undefined)
      router.push('/account/post')
      toast.success('Thêm tin tức thành công!')
    })
  }

  const { data: postCategories } = usePostCategory({
    key: `${SWR_KEY.get_post_category_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const categoryOptions: OptionType<string>[] | undefined = useMemo(() => {
    return postCategories?.map((item) => ({
      label: item.name,
      value: item.id,
    }))
  }, [postCategories])

  return (
    <Main title={WEB_TITTLE} description={WEB_DESCRIPTION}>
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: `Thêm tin tức`,
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          <div className="flex-between flex-wrap border-b border-gray-200 pb-12 mb-24">
            <p className="text-xl capitalize font-semibold">Thêm tin tức</p>
          </div>

          {chatToken ? (
            <div>
              <div className="">
                <PostEditor
                  onSubmit={(val) => {
                    setContent(val)
                  }}
                />
              </div>
            </div>
          ) : (
            <SignupPostAdminForm className="md:w-[60%] mx-auto" />
          )}

          {/* modal create post form */}
          <Modal
            visible={content !== undefined}
            headerClassName="hidden"
            modalClassName="w-[90%] md:w-[500px] max-w-[90vw] h-fit"
          >
            <div>
              <div className="flex-between p-12">
                <p className="text-md">Tạo tin tức mới</p>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setContent(undefined)
                  }}
                >
                  <TimesIcon />
                </div>
              </div>

              <div className="max-h-[400px] h-fit overflow-scroll scrollbar-hide p-12">
                <CreatePostForm
                  categoryOptions={categoryOptions}
                  onSubmit={(params) => {
                    if (content) {
                      handleCreatePost({ ...params, content })
                    }
                  }}
                  type={'create'}
                />
              </div>
            </div>
          </Modal>
        </div>
      </AccountContainer>
    </Main>
  )
}

export default CreatePostPage
