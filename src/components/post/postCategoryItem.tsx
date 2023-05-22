import moment from 'moment'
import React, { useState } from 'react'
import { ModalConfirm } from '../modal'
import { PostCategory } from '@/types'

interface PostCategoryItemProps {
  data: PostCategory
  onDelete?: (id: string) => void
  onEdit?: (data: PostCategory) => void
}

export const PostCategoryItem = ({ data, onDelete, onEdit }: PostCategoryItemProps) => {
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
      className={`relative border border-gray-200 mb-12 last:mb-0 rounded-md p-12 bg-white hover:bg-gray-200 duration-150 ease-in-out`}
    >
      <p className="title_md line-clamp-1 capitalize">{data?.name}</p>

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
