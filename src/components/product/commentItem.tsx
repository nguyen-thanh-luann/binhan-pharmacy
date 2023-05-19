import { Comment } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { CustomImage } from '../customImage'
import moment from 'moment'
import { TrashIconOutline } from '@/assets'
import { useModal } from '@/hooks'
import { ModalConfirm } from '../modal'

interface CommentItemProps {
  className?: string
  data: Comment
  onDelete?: (comment_id: number) => void
}

export const CommentItem = ({ data, className, onDelete }: CommentItemProps) => {
  const {
    visible: isShowModalConfirm,
    openModal: openModalConfirm,
    closeModal: closeModalConfirm,
  } = useModal()

  const handleDeleteComment = () => {
    onDelete?.(data?.comment_id)
    closeModalConfirm()
  }

  return (
    <div className={twMerge(classNames(`flex gap-12 mb-12 last:mb-0 relative`, className))}>
      <div className="">
        <CustomImage
          src={data?.author?.avatar_url?.url || ''}
          className="w-32 h-32 rounded-full"
          imageClassName="rounded-full w-32 h-32"
        />
      </div>

      <div className="flex-1">
        <p className="title_md">{data?.author?.partner_name}</p>
        <p
          className="text_md"
          dangerouslySetInnerHTML={{
            __html: data?.content || '',
          }}
        ></p>

        <p className="text_sm !text-gray">{moment(data?.date)?.format('DD/MM/YYYY')}</p>
      </div>

      {data?.deletable ? (
        <div onClick={openModalConfirm} className="absolute top-8 right-8 cursor-pointer">
          <TrashIconOutline className="text-red w-14 h-14" />
        </div>
      ) : null}

      <ModalConfirm
        title="Bạn có chắc muốn xóa bình luận?"
        onConfirm={() => handleDeleteComment()}
        onDeny={closeModalConfirm}
        visible={isShowModalConfirm}
      />
    </div>
  )
}
