import { imageBlur } from "@/assets"
import { AttachmentRes } from "@/types"
import { setCurrentPreviewImages } from "@/store"
import { useDispatch } from "react-redux"
import { Image } from "@/components/image"

interface MessageImagesProps {
  data: AttachmentRes[]
  className?: string
}

export const MessageImages = ({ data, className }: MessageImagesProps) => {
  const dispatch = useDispatch()
  

  return (
    <div className={`flex flex-wrap w-fit ${className}`}>
      {data.map((item, index) => (
        <div
          onClick={() => dispatch(setCurrentPreviewImages([item.url]))}
          key={item.id}
          className={`relative rounded-lg overflow-hidden ${
            data.length > 1 ? 'border border-solid border-gray-200' : ''
          } hover:opacity-90 cursor-pointer mb-2 ${
            data.length - 1 === index
              ? `${index % 2 === 0 ? 'w-full' : 'w-[50%]'}`
              : `w-[calc(50%-2px)]  ${index % 2 === 0 ? 'mr-2' : ''}`
          }`}
        >
          <Image
            blurDataURL={imageBlur}
            alt=""
            src={item?.url || item?.previewImage || ''}
            imageClassName="object-cover aspect-1"
            className="w-full"
          />
        </div>
      ))}
    </div>
  )
}
