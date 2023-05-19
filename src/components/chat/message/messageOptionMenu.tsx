import { CopyIconOutline, EyeIconOutline, NoteIconOutline } from "@/assets"
import { MESSAGE_OPTION_MENU_SIZE } from "@/constants"
import { useClickOutside } from "@/hooks"
import { RoomType } from "@/types"
import classNames from "classnames"
import { useEffect, useRef } from "react"
import { twMerge } from "tailwind-merge"

interface MessageOptionProps {
  onSaveToNote?: Function
  className?: string
  onViewDetail?: Function
  messageId: string
  onClose?: Function
  showOn?: "left" | "right"
  onCopy?: Function
  roomType: RoomType
}

export const MessageOptionMenu = ({
  className = "",
  onSaveToNote,
  onViewDetail,
  messageId,
  onClose,
  showOn,
  onCopy,
  roomType,
}: MessageOptionProps) => {
  const menuOptionRef = useRef<HTMLDivElement>(null)
  const container = document.querySelector(".chat-message-list")?.getBoundingClientRect() as DOMRect
  const child = document.querySelector(`.message-item-child-${messageId}`) as HTMLDivElement
  const childDOMRect = child.getBoundingClientRect()
  const top =
    container.height - childDOMRect.top < MESSAGE_OPTION_MENU_SIZE.height
      ? -MESSAGE_OPTION_MENU_SIZE.height
      : 50

  useClickOutside([menuOptionRef], () => onClose?.())

  useEffect(() => {
    const container = document.querySelector(".chat-message-list")
    if (!container) return

    container?.addEventListener("scroll", () => {
      onClose?.()
    })

    return () => {
      container.removeEventListener("scroll", () => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={menuOptionRef}
      style={{
        ...MESSAGE_OPTION_MENU_SIZE,
        top,
        left: showOn === 'left' ? child.offsetWidth + (roomType === 'group' ? -8 : -60) : 'unset',
        right: showOn === 'right' ? child.offsetWidth + (roomType === 'group' ? 64 : 12) : 'unset',
      }}
      className={twMerge(classNames('rounded-[8px] z-60 absolute bg-white shadow-shadow-1 p-8', className))}
    >
      <button
        onClick={() => {
          onViewDetail?.()
          onClose?.()
        }}
        className="flex items-center py-[14px] w-full px-12 hover:bg-gray-100 hover:rounded-[5px]"
      >
        <EyeIconOutline className="mr-8 text" />
        <p className="text whitespace-nowrap">Xem chi tiết</p>
      </button>

      <button
        onClick={() => {
          onSaveToNote?.()
          onClose?.()
        }}
        className="flex items-center py-[14px] w-full px-12 hover:bg-gray-100 hover:rounded-[5px]"
      >
        <NoteIconOutline className="mr-8 text" />
        <p className="text whitespace-nowrap">Lưu vào ghi chú</p>
      </button>

      <button
        onClick={() => {
          onCopy?.()
          onClose?.()
        }}
        className="flex items-center py-[14px] w-full px-12 hover:bg-gray-100 hover:rounded-[5px]"
      >
        <CopyIconOutline className="mr-8 text" />
        <p className="text whitespace-nowrap">Copy tin nhắn</p>
      </button>
    </div>
  )
}
