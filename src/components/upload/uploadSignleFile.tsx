import { UploadIcon } from '@/assets'
import { useUpload } from '@/hooks'
import { uploadImageRes } from '@/types'
import React from 'react'
import { Spinner } from '../spinner'
import { Image } from '../image'

interface UploadSignlefileProps {
  id: string
  defaultImage?: string
  isError?: boolean
  getImage?: (params: uploadImageRes) => void
}

export const UploadSignleFile = ({
  id,
  defaultImage,
  getImage,
  isError,
}: UploadSignlefileProps) => {
  const { uploadSingleImage, isUploading } = useUpload()

  const handleUploadImage = (e: any) => {
    const files = e.target.files
    if (!files?.length) return

    uploadSingleImage(files[0], (val: any) => {
      getImage?.(val)
    })
  }

  return (
    <div>
      <input onChange={handleUploadImage} id={id} hidden type="file" name="" accept="image/*" />

      <label
        htmlFor={id}
        className={`flex-center flex-col h-[100px] overflow-hidden w-[148px] rounded-md border border-dashed ${
          isError ? 'border-red' : 'border-gray-500'
        } cursor-pointer relative flex-center file-image-picker mb-[4px] ${
          defaultImage && !isUploading ? 'border-none' : ''
        } ${isError ? 'form-input-err' : ''} file-image-picker-${id}`}
      >
        {isUploading ? (
          <span className="absolute inset-0 w-full h-full flex-center bg-gray-color-1 z-[100]">
            <Spinner className="w-[18px] h-[18px]" />
          </span>
        ) : null}

        <UploadIcon className="text-gray-500 w-18 h-18" />

        <label className={`!text-gray-500 text ${defaultImage ? 'hidden' : ''}`} htmlFor={id}>
          Tải ảnh lên
        </label>

        {defaultImage ? <Image src={defaultImage} imageClassName="object-cover" /> : null}
      </label>
    </div>
  )
}
