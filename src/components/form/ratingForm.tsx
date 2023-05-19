/* eslint-disable @next/next/no-img-element */
import { useAttachment, useCreateAttachment, useInputText, useModal } from '@/hooks'
import { ratingProductSchema } from '@/schema'
import {
  CreateAttachmentRes,
  CreateRatingReq,
  DeleteRatingProps,
  RatingRes,
  StarRatingRange,
  StarRatingRangeReq,
} from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { PhotoIcon, TimesIcon } from '@/assets'
import { DEFAULT_LIMIT } from '@/constants'
import { getRatingContent } from '@/helper'
import classNames from 'classnames'
import { toast } from 'react-hot-toast'
import { Button } from '../button'
import { CustomImage } from '../customImage'
import { Image } from '../image'
import { TextareaField } from '../inputs'
import { ModalConfirm } from '../modal'
import { Star } from '../star'

interface RatingForm {
  onAddRating: (props: CreateRatingReq) => void
  purchaseForm: RatingRes
  onCloseModal?: Function
  onDeleteRating?: (props: DeleteRatingProps) => void
}

export const RatingForm = ({
  onAddRating,
  purchaseForm,
  onDeleteRating,
  onCloseModal,
}: RatingForm) => {
  const {
    closeModal: closeModalConfirm,
    openModal: openModalConfirm,
    visible: showModalConfirm,
  } = useModal()

  const { createAttachment, isLoading: isCreateAttachment } = useCreateAttachment()

  // useForm
  const { control, getValues, setValue } = useForm({
    resolver: yupResolver(ratingProductSchema),
    mode: 'all',
  })

  useEffect(() => {
    if (!purchaseForm) return

    setValue('content', getRatingContent(purchaseForm?.comment_rating?.content))
    setValue('star_rating', purchaseForm?.product?.star_rating)
  }, [purchaseForm])

  const { deleteImage, images, setImages, getBase64Images } = useAttachment({
    limit: DEFAULT_LIMIT,
    initImages:
      purchaseForm?.comment_rating?.image_urls?.length > 0
        ? purchaseForm.comment_rating.image_urls.map((item) => item.url)
        : undefined,
  })

  // Rating input field
  const commentRating = purchaseForm?.comment_rating?.content || ''
  const inputProps = useInputText(getRatingContent(commentRating))

  // Star rating
  const [ratingVal, setRatingVal] = useState<StarRatingRange | undefined>(
    purchaseForm?.product?.star_rating || 0
  )

  const [ratingImageIds, setRatingImageIds] = useState<Array<number> | undefined>([])

  const handleDeleteCommentRating = () => {
    purchaseForm?.history_line_id &&
      purchaseForm?.product &&
      onDeleteRating &&
      onDeleteRating({
        history_line_id: purchaseForm.history_line_id,
        product_id: purchaseForm.product.product_id,
      })
    closeModalConfirm()
  }

  const handleAddRating = () => {
    if (isCreateAttachment) {
      toast.error('Đang tải ảnh lên, vui lòng thử lại sau!')
      return
    }

    const contentText = getValues('content')

    ratingVal &&
      contentText &&
      onAddRating &&
      onAddRating({
        history_line_id: [purchaseForm?.history_line_id],
        product_id: purchaseForm?.product.product_id,
        star_rating: ratingVal,
        content: contentText,
        image_ids: ratingImageIds || [],
      })
  }

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCreateAttachment) return

    if (!e.target.files || !purchaseForm?.product?.product_id) return

    getBase64Images(e.target.files, (images) => {
      if (!images?.[0]) return

      createAttachment({
        file: images?.[0].replace(/^data:image\/\w+;base64,/, ''),
        onSuccess(res: CreateAttachmentRes[]) {
          setRatingImageIds([...(ratingImageIds || []), res?.[0]?.id || 0])
        },
      })
    })
  }

  const hanldeCloseForm = () => {
    setImages(undefined)
    setRatingVal(undefined)
    setRatingImageIds(undefined)
    onCloseModal?.()
  }

  return (
    <>
      <div className="">
        <header className="flex gap-12 mb-12">
          <div className="flex-1 flex gap-12">
            <CustomImage
              src={purchaseForm?.product?.representation_image?.image_url || ''}
              imageClassName="w-[70px] h-[70px] object-cover aspect-1"
            />
            <p className="text-md line-clamp-1 text-text-color">
              {purchaseForm?.product?.product_name || ''}
            </p>
          </div>

          <div className="cursor-pointer" onClick={() => hanldeCloseForm()}>
            <TimesIcon className="w-16 h-16 text-gray" />
          </div>
        </header>

        {/* body */}
        <div className="mb-12">
          <div className="mb-12">
            <Star
              initialValue={ratingVal}
              allowHover={false}
              onClick={(val: number) => {
                setRatingVal((val / 20) as StarRatingRangeReq)
              }}
              ratingValue={0}
              size={24}
              iconsCount={5}
            />
          </div>

          <div className="">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddRating()
              }}
              className="mb-12"
            >
              <TextareaField
                control={control}
                placeholder="Nhập nội dung đánh giá"
                name="content"
                defaultValue={inputProps?.value}
              />
            </form>

            <div className="flex flex-wrap gap-12">
              {purchaseForm?.comment_rating?.comment_id ? null : (
                <div className="mb-12">
                  <input
                    onChange={(e) => handleUploadImages(e)}
                    hidden
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    multiple
                    id="rating-attachment"
                  />
                  <label
                    htmlFor="rating-attachment"
                    className={classNames(
                      'flex items-center justify-center cursor-pointer text-primary border border-primary rounded-lg w-[60px] h-[60px]',
                      images?.length === DEFAULT_LIMIT ||
                        (purchaseForm?.comment_rating?.image_urls?.length > 0 &&
                          purchaseForm?.comment_rating?.editable)
                        ? 'cursor-not-allowed opacity-50'
                        : '',
                      isCreateAttachment ? 'opacity-50 cursor-wait' : ''
                    )}
                  >
                    <PhotoIcon className="w-24 h-24" />
                  </label>
                </div>
              )}

              {images ? (
                <div className="flex flex-wrap gap-12">
                  {images.map((url, index) => (
                    <div key={index} className="relative w-[60px]">
                      {purchaseForm?.comment_rating?.comment_id ? null : (
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteImage(url)
                          }}
                          className="absolute z-40 top-0 right-0 cursor-pointer bg-white rounded-full p-4"
                        >
                          <TimesIcon className="text-gray text-xs" />
                        </span>
                      )}

                      <div className="">
                        <Image
                          src={url}
                          alt=""
                          imageClassName="w-[60px] h-[60px] object-cover rounded-md"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <footer className="flex justify-end gap-12">
          {purchaseForm?.comment_rating?.comment_id ? (
            <Button
              title="Xóa đánh giá"
              className={classNames('border border-red p-8 rounded-md')}
              textClassName="text-red"
              onClick={openModalConfirm}
            />
          ) : null}

          <Button
            title="Hoàn thành"
            className={classNames(
              'border border-primary p-8 rounded-md',
              getValues('content') === undefined ? 'cursor-not-allowed opacity-50' : ''
            )}
            textClassName="text-primary"
            onClick={handleAddRating}
          />
        </footer>
      </div>

      <ModalConfirm
        visible={showModalConfirm}
        title={`Xóa đánh giá của bạn?`}
        onConfirm={handleDeleteCommentRating}
        onDeny={closeModalConfirm}
      />
    </>
  )
}
