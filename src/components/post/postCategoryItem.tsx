import { PostCategory } from '@/types'
import classNames from 'classnames'
import moment from 'moment'
import { useState } from 'react'
import { ModalConfirm } from '../modal'

interface PostCategoryItemProps {
  data: PostCategory
  onDelete?: (id: string) => void
  onEdit?: (data: PostCategory) => void
  className?: string
  onClick?: (data: PostCategory) => void
}

export const PostCategoryItem = ({
  data,
  onDelete,
  onEdit,
  className,
  onClick: onExternalClick,
}: PostCategoryItemProps) => {
  const [modalConfirm, setModalConfirm] = useState<boolean>(false)

  const handleDelete = () => {
    onDelete?.(data?.id)
    setModalConfirm(false)
  }

  const handleEdit = () => {
    onEdit?.(data)
  }

  return (
    <div
      onClick={() => onExternalClick?.(data)}
      className={classNames(
        'relative border border-gray-200 rounded-md p-12 bg-white duration-150 ease-in-out cursor-pointer hover:bg-gray-100',
        className
      )}
    >
      <p className="title_md line-clamp-1 capitalize">{data?.name}</p>

      <div className="flex items-center gap-8">
        <p className="text-md font-bold">Phân cấp:</p>

        <div
          className={classNames(
            'border rounded-lg w-fit min-w-[100px] text-center',
            data?.role === 'npp'
              ? 'border-primary text-primary'
              : data?.role === 'th'
              ? 'border-green text-green'
              : 'border-blue text-blue'
          )}
        >
          {data?.role === 'npp' ? 'Nhà thuốc' : data?.role === 'th' ? 'Người dùng' : 'Tất cả'}
        </div>
      </div>

      <p className="title_md line-clamp-2">
        {'Slug: '}
        <span className="text_md">{data?.slug}</span>
      </p>

      <p className="title_md">
        {'Ngày tạo: '}
        <span className="text_md">{moment(data?.created_at).format('HH:mm DD/MM/YYYY')}</span>
      </p>

      <div className="absolute top-12 right-12 flex items-center">
        <div
          onClick={() => {
            handleEdit()
          }}
          className="cursor-pointer"
        >
          <p className="title_md !text-blue-700 active:opacity-50 duration-150 ease-in-out">Edit</p>
        </div>

        <div
          onClick={() => {
            setModalConfirm(true)
          }}
          className="ml-12 cursor-pointer group"
        >
          <p className="title_md !text-red active:opacity-50 duration-150 ease-in-out">Xóa</p>
        </div>
      </div>

      <ModalConfirm
        visible={modalConfirm}
        title="Bạn có chắc muốn xóa danh mục này?"
        onDeny={() => {
          setModalConfirm(false)
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
