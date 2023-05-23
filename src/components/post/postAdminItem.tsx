import { EyeIconSolid, PenIconSolid, TrashIconOutline } from '@/assets'
import { Post } from '@/types'
import moment from 'moment'
import { Image } from '../image'

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
    return (
      <div className="flex mb-[24px]">
        <div className="skeleton w-[100px] h-[100px]"></div>
        <div className="flex-1 ml-[12px]">
          <div className="skeleton rounded-[4px] h-[20px] mb-[8px]"></div>
          <div className="skeleton rounded-[4px] h-[25px] mb-[12px]"></div>
          <div className="max-w-[200px] w-full skeleton h-[15px]"></div>
        </div>
      </div>
    )
  }

  return (
    <div key={post.id} className="flex mb-12 last:mb-0">
      <div className="relative h-[100px] w-[100px] ">
        <Image src={post?.thumbnail?.thumbnail_url} imageClassName="object-cover aspect-1" />
      </div>
      <div className="flex-1 mx-[12px]">
        <div className="">
          <p className="title_md line-clamp-1">{post?.title}</p>
          <p className="text_md line-clamp-2">{post?.short_content}</p>
          <p className="text">
            <span>{moment(post?.created_at).fromNow()}</span>
            <span className="ml-[10px]">
              Đăng bởi: <span className="title">{post?.author_name}</span>
            </span>
          </p>
          <p></p>
        </div>
      </div>

      <div className="flex flex-col h-full">
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
      </div>
    </div>
  )
}

export { PostAdminItem }
