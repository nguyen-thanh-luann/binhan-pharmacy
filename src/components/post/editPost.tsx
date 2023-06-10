import { TimesIcon } from '@/assets'
import { CreatePostForm, Modal, PostEditor } from '@/components'
import { DEFAULT_LIMIT, SWR_KEY } from '@/constants'
import { usePostList } from '@/hooks'
import { selectPostForm } from '@/store'
import { CreatePost, Post } from '@/types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'

interface EditPostProps {
  onSuccess?: () => void
}

const EditPost = ({ onSuccess }: EditPostProps) => {
  const router = useRouter()
  const postForm: Post = useSelector(selectPostForm)

  const [content, setContent] = useState<string>()

  const { updatePost } = usePostList({
    key: `${SWR_KEY.get_post_list}`,
    params: {
      limit: DEFAULT_LIMIT,
    },
  })

  const handleUpdatePost = (params: CreatePost) => {
    updatePost(
      { ...params, id: postForm.id },
      () => {
        setContent(undefined)
        onSuccess?.()
        router.push('/account/post')
        toast.success('Cập nhật tin tức thành công!')
      },
      () => {
        toast.error('Có lỗi xảy ra!')
      }
    )
  }

  return (
    <div>
      <div className="p-12 relative post_update_modal_editor">
        <PostEditor
          defaultValue={postForm?.content}
          onSubmit={(val) => {
            setContent(val)
          }}
        />
      </div>

      <Modal
        visible={content !== undefined}
        headerClassName="hidden"
        modalClassName="w-[90%] md:w-[500px] max-w-[90vw] h-fit"
      >
        <div>
          <div className="flex-between p-12">
            <p className="text-md">Cập nhật thông tin</p>
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
              onSubmit={(params) => {
                if (content) {
                  handleUpdatePost({
                    attachment_id: params?.attachment_id,
                    categories: params?.categories,
                    short_content: params?.short_content,
                    slug: params?.slug,
                    title: params?.title,
                    role: params?.role,
                    content,
                  })
                }
              }}
              type={'update'}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EditPost
