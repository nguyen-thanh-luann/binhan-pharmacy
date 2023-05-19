import { MessageReactionType } from '@/types'
import classNames from 'classnames'
import _ from 'lodash'
import { twMerge } from 'tailwind-merge'
import { MessageReactionIcon } from './messageReactionIcon'

interface MessageReactionCountProps {
  onClick: Function
  reactions: MessageReactionType[]
  count: number
  className?: string
}

export const MessageReactionCount = ({
  reactions,
  onClick,
  count,
  className = '',
}: MessageReactionCountProps) => {
  return (
    <div
      onClick={() => onClick()}
      className={twMerge(
        classNames(
          'px-12 py-6 bg-white rounded-[25px] flex items-center w-fit cursor-pointer',
          className
        )
      )}
    >
      <span className="text_sm mr-6">{count}</span>
      {_.uniq(reactions)
        .slice(0, 3)
        ?.map((item, index) => (
          <MessageReactionIcon
            className={`mr-2 last:mr-0`}
            key={index}
            emotion_type={item}
            size={16}
          />
        ))}
    </div>
  )
}
