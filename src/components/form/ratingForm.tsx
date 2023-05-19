/* eslint-disable @next/next/no-img-element */
import { useAttachment, useInputText, useModal } from '@/hooks'
import { ratingProductSchema } from '@/schema'
import {
  DeleteRatingProps,
  PurchasedProduct,
  RatingAttachmentRes,
  RatingRange,
  RatingRangePost,
  TagRating,
  UpdateRatingProps,
} from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import { TextareaField } from '../inputs'
import { Star } from '../star'
import { API_URL } from '@/constants'
import ratingAPI from '@/services/ratingAPI'
import { CustomImage } from '../customImage'
import { PhotoIcon, TimesIcon } from '@/assets'
import { ModalConfirm } from '../modal'
import { RatingTag } from '../tag'

interface RatingForm {
  onAddRating: (props: UpdateRatingProps) => void
  purchaseForm: PurchasedProduct
  isShowFooter?: boolean
  onCloseModal?: Function
  onDeleteRating?: (props: DeleteRatingProps) => void
}

export const RatingForm = ({
  onAddRating,
  purchaseForm,
  isShowFooter = true,
  onDeleteRating,
}: RatingForm) => {
  const router = useRouter()
  const LIMIT_ATTACHMENT = 5
  const {
    closeModal: closeModalConfirm,
    openModal: openModalConfirm,
    visible: showModalConfirm,
  } = useModal()

  // useForm
  const { control, getValues } = useForm({
    resolver: yupResolver(ratingProductSchema),
    mode: 'all',
  })

  const { deleteImage, images, getBase64Images } = useAttachment({
    limit: 5,
    initImages:
      purchaseForm?.comment_rating?.image_urls?.length > 0
        ? purchaseForm.comment_rating.image_urls.map((item: any) => `${API_URL}${item.image_url}`)
        : undefined,
  })

  // Rating input field
  const commentRating = purchaseForm?.comment_rating?.content || ''
  const inputProps = useInputText(
    commentRating.includes('<p>') ? commentRating.slice(3, commentRating.length - 4) : commentRating
  )

  // Star rating
  const [ratingVal, setRatingVal] = useState<RatingRange>(
    purchaseForm?.comment_rating?.star_rating_int || 0
  )

  // rating tags
  const [ratingTags, setRatingTags] = useState<TagRating[] | undefined>()
  const [ratingTagIds, setRatingTagId] = useState<Array<number> | undefined>(() => {
    const ratingTags = purchaseForm?.comment_rating?.rating_tag
    if (!ratingTags || ratingTags?.length === 0) return undefined
    return ratingTags.map((item: any) => item.tag_id)
  })

  // Rating image ids after upload successfully to server
  const [attachmentIds, setAttachmentIds] = useState<Array<number>>()
  const [ratingImageIds, setRatingImageIds] = useState<Array<number>>()

  // Get rating tags if update
  useEffect(() => {
    if (purchaseForm?.comment_rating?.editable) {
      getRatingTags().then((tags: TagRating[]) => setRatingTags(tags))
    }

    if (ratingVal) {
      getRatingTags().then((tags: TagRating[]) => {
        setRatingTags(tags?.slice(0, ratingVal))
      })
    }
  }, [ratingVal])

  // Functions
  const getRatingTags = async () => {
    const res: any = await ratingAPI.getRatingTags({
      product_id: Number(router?.query?.productId) || 0,
    })

    const tags = res?.result
    return tags?.length > 0 ? tags : undefined
  }

  const handleToggleTag = (tagId: number) => {
    if (!ratingTagIds) {
      setRatingTagId([tagId])
    } else {
      if (ratingTagIds.includes(tagId)) {
        const newTags = [...ratingTagIds].filter((id) => id !== tagId)
        setRatingTagId(newTags?.length > 0 ? newTags : undefined)
      } else {
        setRatingTagId([...ratingTagIds, tagId])
      }
    }
  }

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
    const contentText = getValues('content')

    ratingVal &&
      contentText &&
      onAddRating &&
      onAddRating({
        star_rating: ratingVal,
        content: contentText,
        tag_ids: ratingTagIds || [],
        attachment_ids: attachmentIds || [],
        product_id: purchaseForm?.product.product_id,
        image_ids: ratingImageIds || [],
      })
  }

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !purchaseForm?.product?.product_id) return

    try {
      getBase64Images(e.target.files, async (urls: Array<string>) => {
        const res: any = await ratingAPI.createAttachment({
          product_id: purchaseForm.product.product_tmpl_id,
          attachments: urls.map((url) => ({
            file: url.replace(/^data:image\/\w+;base64,/, ''),
            type: 'picture',
          })),
        })
        const imageIds: RatingAttachmentRes[] = res?.result?.data

        if (imageIds?.length > 0) {
          setAttachmentIds(imageIds.map((item) => item.attachment_id))
          setRatingImageIds(imageIds.map((item) => item.image_id))
        } else {
          toast.error('Có lỗi xảy ra!')
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="">
        <header className="flex gap-12 mb-12">
          <div className="">
            <CustomImage
              src={purchaseForm?.product?.image_url?.[0] || ''}
              imageClassName="w-[70px] h-[70px] object-cover"
            />
          </div>
          <p className="title-md">{purchaseForm?.product?.product_name || ''}</p>
        </header>

        {/* body */}
        <div className="mb-12">
          <div className="mb-12">
            <Star
              initialValue={ratingVal}
              allowHover={false}
              onClick={(val: number) => {
                setRatingVal((val / 20) as RatingRangePost)

                if (!ratingTags) {
                  getRatingTags().then((tags: TagRating[]) => setRatingTags(tags))
                }
              }}
              ratingValue={0}
              size={30}
              iconsCount={5}
            />
          </div>

          <div className="">
            {ratingTags && (
              <div className="">
                {ratingTags.map((item: TagRating) => (
                  <RatingTag
                    key={item.tag_id}
                    id={item.tag_id}
                    name={item.tag_content}
                    onChange={() => handleToggleTag(item.tag_id)}
                    isActive={ratingTagIds?.includes(item.tag_id)}
                  />
                ))}
              </div>
            )}

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
              {!isShowFooter && (
                <button
                  type="submit"
                  className={`default-button ${
                    !ratingVal || !inputProps.value
                      ? 'opacity-50 cursor-not-allowed hover:opacity-50'
                      : ''
                  }`}
                >
                  Thêm đánh giá
                </button>
              )}
            </form>

            <div className="">
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
                    className={`flex items-center text-md !text-primary border-1 border-primary rounded-sm p-8 w-fit ${
                      images?.length === LIMIT_ATTACHMENT ||
                      (purchaseForm?.comment_rating?.attachment_ids?.length > 0 &&
                        purchaseForm?.comment_rating?.editable)
                        ? 'cursor-not-allowed opacity-50'
                        : ''
                    }`}
                  >
                    <PhotoIcon />
                    <span className="ml-6 text-primary">{`Thêm ảnh ${
                      images?.length || 0
                    } / ${LIMIT_ATTACHMENT}`}</span>
                  </label>
                </div>
              )}

              {images ? (
                <div className="flex gap-12">
                  {images.map((url, index) => (
                    <div key={index} className="relative">
                      {purchaseForm?.comment_rating?.comment_id ? null : (
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteImage(url)
                          }}
                          className="absolute top-4 right-4 cursor-pointer"
                        >
                          <TimesIcon className="text-gray" />
                        </span>
                      )}

                      <div className="">
                        <Image
                          src={url}
                          alt=""
                          className="w-[70px] h-[70px] object-cover"
                          width={1000}
                          height={1000}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {isShowFooter ? (
          <footer className="flex justify-end">
            {purchaseForm?.comment_rating?.comment_id ? (
              <button onClick={openModalConfirm} className="delete-button">
                Xóa đánh giá
              </button>
            ) : (
              <button
                className={`default-button ${
                  getValues('content') === undefined || getValues('content') === ''
                    ? 'cursor-not-allowed opacity-50 hover:opacity-50'
                    : ''
                }`}
                onClick={handleAddRating}
              >
                Hoàn thành
              </button>
            )}
          </footer>
        ) : null}
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
