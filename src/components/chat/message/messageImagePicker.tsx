import { TimesIcon, UploadIcon } from "@/assets"
import { Image, Spinner } from "@/components"
import { MessageAttachment } from "@/types"
import { ChangeEvent } from "react"

interface ImagePickupPreviewProps {
  data: MessageAttachment[]
  onDelete: (_: string) => void
  onAdd?: (_: ChangeEvent<HTMLInputElement>) => void
  size?: number
  showLoading?: boolean
  onClose?: Function
}

export const ImagePickupPreview = ({
  data,
  onDelete,
  size = 100,
  onAdd,
  showLoading,
  onClose,
}: ImagePickupPreviewProps) => {
  return (
    <div
      className={`relative p-12 border-t max-h-[150px] overflow-scroll border-gray-200 ${
        showLoading ? 'pointer-events-none' : ''
      }`}
    >
      {showLoading ? (
        <div className="absolute inset-0 flex-center">
          <Spinner size={30} />
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="flex items-center text_sm mb-12">
          <span className="border border-primary rounded-full text-primary font-semibold w-14 h-14 text_sm flex-center mr-6">
            {data.length}
          </span>
          <span className="text">ảnh được chọn</span>
        </p>
        <button onClick={() => onClose?.()} className="relative top-[-8px]">
          <TimesIcon />
        </button>
      </div>

      <div className="flex flex-wrap overflow-y-auto">
        <label
          style={{ height: size, width: size }}
          className="rounded-lg relative overflow-hidden mr-8 mb-8 md:mr-12 md:mb-12 flex-center border-[2px] border-dashed border-gray-400 cursor-pointer"
          htmlFor="image-add"
        >
          <input
            name=""
            multiple
            accept="image/*"
            hidden
            onChange={onAdd}
            type="file"
            id="image-add"
          />
          <UploadIcon className="text-lg" />
        </label>

        {data.map((item, index) => (
          <div
            key={index}
            style={{ height: size, width: size }}
            className="rounded-lg relative overflow-hidden mr-8 mb-8 md:mr-12 md:mb-12"
          >
            <button
              onClick={() => onDelete(item.id)}
              className="absolute w-16 h-16 rounded-full bg-gray-300 right-4 top-4 p-4 z-10 flex-center opacity-70 hover:opacity-100 duration-150 ease-in-out"
            >
              <TimesIcon />
            </button>

            <Image
              src={item.previewImage}
              alt=""
              className="w-100 h-100"
              imageClassName="h-full w-full object-cover aspect-1"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
