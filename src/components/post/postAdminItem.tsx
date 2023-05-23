import { EyeIconSolid, PenIconSolid, ThreeDotsIcon, TrashIconOutline } from '@/assets'
import { Post } from '@/types'
import moment from 'moment'
import { Image } from '../image'
import { PostAdminItemLoading } from './postAdminItemLoading'
import { useClickOutside, useModal } from '@/hooks'
import classNames from 'classnames'
import { useRef } from 'react'

interface PostItemProps {
  post: Post
  isLoading?: boolean
  onClickDetail?: Function
  onClickEdit?: Function
  onClickDelete?: Function
}

const PostAdminItem = ({
  post,
  isLoading = false,
  onClickDelete,
  onClickDetail,
  onClickEdit,
}: PostItemProps) => {
  if (isLoading) {
    return <PostAdminItemLoading />
  }

  const { visible, openModal, closeModal, toggle } = useModal()
  const optionModalRef = useRef<HTMLDivElement>(null)

  useClickOutside([optionModalRef], closeModal)

  return (
    <div key={post.id} className="relative flex mb-12 last:mb-0">
      <div className="relative h-[100px] w-[100px] ">
        <Image
          src={post?.thumbnail?.thumbnail_url}
          imageClassName="object-cover aspect-1 rounded-lg"
        />
      </div>
      <div className="flex-1 mx-[12px]">
        <div className="">
          <p className="title_md line-clamp-1">{post?.title}</p>
          <p className="text_md line-clamp-2">{post?.short_content}</p>
          <p className="text">
            <p className="">
              Đăng bởi: <span className="title">{post?.author_name}</span>
            </p>
            <p className="text-sm">{moment(post?.created_at).fromNow()}</p>
          </p>
          <p></p>
        </div>
      </div>

      <div
        ref={optionModalRef}
        className="absolute right-0"
        onMouseEnter={openModal}
        onMouseLeave={closeModal}
      >
        <div className="relative">
          <button onClick={toggle} className="border border-gray rounded-lg p-8">
            <ThreeDotsIcon className="text-gray" />
          </button>

          <div
            className={classNames(
              visible ? 'block' : 'hidden',
              'absolute z-50 right-0 rounded-lg p-8 shadow-shadow-1 bg-white min-w-[120px]'
            )}
          >
            <button
              onClick={() => onClickEdit && onClickEdit()}
              className="flex items-center gap-12 border border-blue-600 text-blue-600 px-8 py-4 rounded-lg w-full mb-12"
            >
              <PenIconSolid className="text-base text-blue-600" />
              <p className="text-base text-blue-600">Cập nhật</p>
            </button>

            <button
              onClick={() => onClickDetail && onClickDetail()}
              className="flex items-center gap-12 border  border-blue-400 text-blue-400 px-8 py-4 rounded-lg w-full mb-12"
            >
              <EyeIconSolid className="text-base text-blue-400" />
              <p className="text-base text-blue-400">Chi tiết</p>
            </button>

            <button
              onClick={() => onClickDelete && onClickDelete()}
              className="flex items-center gap-12 border border-red px-8 py-4 rounded-lg w-full mb-12"
            >
              <TrashIconOutline className="text-base text-red" />
              <p className="text-base text-red">Xóa</p>
            </button>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col h-full">
        <button
          onClick={() => onClickEdit && onClickEdit()}
          className="bg-blue-600 flex-center w-[40px] h-[40px] title_md !text-white hover:opacity-80 ease-in-out"
        >
          <PenIconSolid className="text-white-color" />
        </button>
        <button
          onClick={() => onClickDetail && onClickDetail()}
          className="bg-blue-400 flex-center w-[40px] h-[40px] title_md !text-white hover:opacity-80 ease-in-out"
        >
          <EyeIconSolid className="text-white-color" />
        </button>
        <button
          onClick={() => onClickDelete && onClickDelete()}
          className="bg-red flex-center w-[40px] h-[40px] title_md !text-white hover:opacity-80 ease-in-out"
        >
          <TrashIconOutline className="text-white-color" />
        </button>
      </div> */}
    </div>
  )
}

export { PostAdminItem }
