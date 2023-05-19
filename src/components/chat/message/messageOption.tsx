/* eslint-disable @next/next/no-img-element */
import { ReplyIcon } from '@/assets'
import { MessageReactionType } from '@/types'
import classNames from 'classnames'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface MessageOptionProps {
  onReaction?: (emotion: MessageReactionType) => void
  onUndoReaction?: (emotion: MessageReactionType) => void
  onReply?: Function
  groupclassName?: string
  className?: string

  value?: MessageReactionType | null | undefined
  onShowMessageOption?: Function
}

export const MessageOption = ({
  onReply,
  groupclassName,
  className,
}: MessageOptionProps) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className={twMerge(classNames('relative', groupclassName))}>
      <div
        className={twMerge(
          classNames(
            'absolute z-50 px-12 rounded-full h-[30px] flex-center bg-white shadow-shadow-1',
            className
          )
        )}
      >
        <button onClick={() => onReply?.()} className="">
          <ReplyIcon className="text_lg !text-gray  hover:!text-primary" />
        </button>

        {/* <div className="">
          <button
            onClick={() => {
              onShowMessageOption?.()
            }}
            className="transform rotate-[90deg]"
          >
            <ThreeDotsIcon className="text_lg !text-gray  hover:!text-primary" />
          </button>
        </div> */}
      </div>
    </div>
  )
}
