import { useRef } from "react"
import { ReplyIcon, CopyIconOutline } from "@/assets"
import { useClickOutside } from "@/hooks"

interface MessageOptionModalProps {
  onClose: Function
  onReply?: () => void
  onCopy?: () => void
}

export const MessageOptionModal = ({ onClose, onCopy, onReply }: MessageOptionModalProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside([ref], () => {
    onClose?.()
  })

  return (
    <div className="fixed z-50 inset-0 flex lg:hidden justify-center items-end">
      <div ref={ref} className="z-10 mb-[100px]">
        <div className="flex bg-white py-12 px-12 rounded-[8px]">
          <button
            onClick={() => {
              onReply?.()
              onClose?.()
            }}
            className="flex-center flex-col mr-16 p-12"
          >
            <ReplyIcon className="text-[20px] text-gray-300 mb-4" />
            <p className="text-[10px] leading-[14px] font-medium text-gray-300">Trả lời</p>
          </button>

          <button
            className="flex-center flex-col p-12"
            onClick={() => {
              onCopy?.()
              onClose?.()
            }}
          >
            <CopyIconOutline className="text-[20px] text-gray-color-3 mb-4" />
            <p className="text-[10px] leading-[14px] font-medium text-gray-300">Copy</p>
          </button>
        </div>
      </div>
      <div onClick={() => onClose?.()} className="absolute inset-0 bg-black-400"></div>
    </div>
  )
}
