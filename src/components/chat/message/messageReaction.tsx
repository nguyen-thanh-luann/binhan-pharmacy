import { EmojiIcon } from '@/assets'
import { useClickOutside } from '@/hooks'
import { MessageReactionType } from '@/types'
import classNames from 'classnames'
import React, { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { MessageReactionIcon } from './messageReactionIcon'

interface MessageReactionProps {
  className?: string
  onReaction?: (emotion: MessageReactionType) => void
  onUndoReaction?: (emotion: MessageReactionType) => void
  value?: MessageReactionType | null | undefined
}

export const MessageReaction = ({
  className,
  onReaction,
  onUndoReaction,
  value,
}: MessageReactionProps) => {
  const emotionRef = useRef<HTMLDivElement>(null)

  const [showEmotion, setShowEmotion] = useState<boolean>()

  useClickOutside([emotionRef], () => setShowEmotion(undefined))

  return (
    <div className={twMerge(classNames('', className))}>
      <div className="relative z-50">
        {!showEmotion ? (
          <button
            className="cursor-pointer w-[28px] h-[28px] rounded-full bg-white flex-center"
            onClick={() => setShowEmotion(true)}
          >
            <EmojiIcon className="text_md" />
          </button>
        ) : (
          <div
            ref={emotionRef}
            className={`absolute z-50 bottom-0 flex-col bg-white border border-gray-200 p-4 rounded-full w-[28px] h-[120px] overflow-scroll scrollbar-hide`}
          >
            {(['like', 'heart', 'laugh', 'sad', 'wow', 'angry'] as MessageReactionType[]).map(
              (val, index) => (
                <button
                  onClick={() => {
                    if (val === value) {
                      onUndoReaction?.(val)
                    } else {
                      onReaction?.(val)
                    }
                      setShowEmotion(undefined)
                  }}
                  className={`mb-8 last:mb-0 hover:scale-125 duration-150 ease-in-out`}
                  key={index}
                >
                  <MessageReactionIcon size={20} emotion_type={val} />

                  {value === val ? (
                    <span className="absolute bottom-[-1px] h-2 bg-primary w-[24px] rounded-[4px]"></span>
                  ) : null}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
