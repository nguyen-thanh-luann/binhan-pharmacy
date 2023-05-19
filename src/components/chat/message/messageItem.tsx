import { imageBlur } from '@/assets'
import { Image } from '@/components/image'
import { getMessageDescription } from '@/helper'
import { useLongPress } from '@/hooks'
import {
  setcurrentDetailMessageId,
  setCurrentMessageEmotionId,
  setCurrentProfileId,
  setMessageReply,
} from '@/store'
import { LikeMessage, MessageReactionType, MessageRes, RoomType, UnlikeMessage } from '@/types'
import moment from 'moment'
import { useRef, useState } from 'react'
import Linkify from 'react-linkify'
import { useDispatch } from 'react-redux'
import { MessageImages } from './messageImages'
import { MessageOption } from './messageOption'
import { MessageOptionMenu } from './messageOptionMenu'
import { MessageOptionModal } from './messageOptionModal'
import { MessageReaction } from './messageReaction'
import { MessageReactionCount } from './messageReactionCount'
import { MessageStatus } from './messageStatus'

interface MessageItemProps {
  data: MessageRes
  lastMessage?: MessageRes
  onReactMessage?: (_: LikeMessage) => void
  onUndoReactMessage?: (_: UnlikeMessage) => void
  isLast?: boolean
  shouldBreak?: boolean
  onClickReplyMsg?: (id: string) => void
  onResendMessage?: (_: MessageRes) => void
  onSaveToNote?: (note: string) => void
  roomType: RoomType
}

const componentDecorator = (href: any, text: any, key: any) => (
  <a href={href} key={key} target="_blank" rel="noreferrer">
    {text}
  </a>
)

export const MessageItem = ({
  data,
  lastMessage,
  isLast,
  shouldBreak,
  onClickReplyMsg,
  onResendMessage,
  roomType,
  onSaveToNote,
  onReactMessage,
  onUndoReactMessage,
}: MessageItemProps) => {
  const dispatch = useDispatch()
  const messageOptionMenuRef = useRef<HTMLDivElement>(null)
  const [showMessageOptionMenu, setShowMessageOptionMenu] = useState<boolean>()
  const { action, handlers, setAction } = useLongPress()

  const handleSetMessageReply = () => {
    dispatch(
      setMessageReply({
        message_id: data.id,
        id: data.id,
        text: getMessageDescription(data),
        attachment: data?.attachments?.length
          ? {
              id: data?.attachments?.[0]?.id || '',
              url: data?.attachments?.[0]?.url || '',
            }
          : undefined,
        created_at: data.created_at,
        author_avatar: data?.author_avatar,
        author_id: data?.author_id,
        author_name: data?.author_name,
      })
    )
    document.getElementById('message-form-input')?.focus()
  }

  const handleResendMessage = () => {
    onResendMessage?.(data)
  }

  const handleClickMessageReaction = () => {
    dispatch(setCurrentMessageEmotionId(data.id))
  }

  const handleShowMessageOption = () => {
    setShowMessageOptionMenu(true)
  }

  const handleCopyText = () => {
    data?.text && navigator.clipboard.writeText(data.text)
  }

  const handleViewDetail = () => {
    dispatch(setcurrentDetailMessageId(data.id))
  }

  const handleSaveToNote = () => {
    if (!data?.text) return
    onSaveToNote?.(data.text)
  }

  const handleReactOnMessage = (emotion: MessageReactionType) => {
    onReactMessage?.({ emotion, message_id: data.id })
  }

  const handleUndoReactOnMessage = (reaction: MessageReactionType) => {
    onUndoReactMessage?.({ message_id: data.id, reaction })
  }


  return (
    <div
      className={`message-item relative flex message-item-${data.id} ${
        data?.attachments?.length || isLast ? 'mb-24' : 'mb-12'
      }
      }`}
    >
      {action === 'longpress' ? (
        <MessageOptionModal
          onReply={handleSetMessageReply}
          onCopy={handleCopyText}
          onClose={() => setAction(undefined)}
        />
      ) : null}

      {showMessageOptionMenu ? (
        <MessageOptionMenu
          onSaveToNote={() => handleSaveToNote?.()}
          roomType={roomType}
          onClose={() => setShowMessageOptionMenu(false)}
          onViewDetail={handleViewDetail}
          className="group-hover:block w-fit"
          messageId={data.id}
          showOn={data.is_author ? 'right' : 'left'}
          onCopy={handleCopyText}
        />
      ) : null}

      <div className={`flex w-full group ${data.is_author ? 'flex-row-reverse' : ''}`}>
        {/* Show avatar of sender if type of conversation is group  */}
        {roomType === 'group' ? (
          <div
            onClick={() => shouldBreak && dispatch(setCurrentProfileId(data.author_id))}
            className={`relative w-[28px] h-[28px] md:w-[40px] md:h-[40px] rounded-[50%] overflow-hidden ${
              roomType === 'group'
                ? `${data.is_author ? 'ml-8 md:ml-12 hidden sm:block' : 'mr-8 md:mr-12'}`
                : 'mr-8 md:mr-12'
            } ${shouldBreak ? 'cursor-pointer' : ''}`}
          >
            {shouldBreak ? (
              <Image blurDataURL={imageBlur} src={data.author_avatar.thumbnail_url} alt="" />
            ) : null}
          </div>
        ) : null}

        <div className={`max-w-[90%] sm:max-w-[80%] lg:max-w-[55%] xl:max-w-[60%] flex-1 relative`}>
          {!data?.attachments?.length ? (
            <div
              {...(handlers as any)}
              ref={messageOptionMenuRef}
              className={`relative w-fit message-option-absolute message-item-child-${data.id} ${
                data.is_author ? 'ml-auto' : ''
              } rounded-[16px]`}
            >
              {!data?.status || data.status === 'fulfilled' ? (
                <div>
                  <MessageOption
                    groupclassName={`hidden group-hover:flex w-full`}
                    className={`${data?.is_author ? 'left-[-60px]' : 'right-[-60px]'}`}
                    onReply={handleSetMessageReply}
                    onShowMessageOption={handleShowMessageOption}
                  />

                  <MessageReaction
                    className={`hidden group-hover:block absolute bottom-[-8px] ${
                      data?.is_author ? 'left-[-8px]' : 'right-[-8px]'
                    }`}
                    onReaction={handleReactOnMessage}
                    onUndoReaction={handleUndoReactOnMessage}
                  />
                </div>
              ) : null}

              <div
                className={`rounded-lg p-12 ${
                  isLast || data?.text || data?.reaction_count ? '' : ''
                } ${data?.attachments?.length ? '' : 'w-fit'} ${
                  data.is_author ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                }`}
              >
                {!data.is_author && roomType === 'group' && shouldBreak ? (
                  <p className="text mb-8">{data.author_name}</p>
                ) : null}

                {/* Reply message */}
                {data?.reply_to?.id ? (
                  <div
                    onClick={() => data.reply_to?.id && onClickReplyMsg?.(data.reply_to?.id)}
                    className={`p-12 mb-12 rounded-lg min-w-[140px] cursor-pointer flex items-stretch bg-blue-200 border-l-2 border-primary ${
                      data?.is_author ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <div className="">
                      <p className="text-sm mb-4 line-clamp-1 word-wrap-anywhere text-primary font-semibold">
                        @{data?.reply_to?.author_name}
                      </p>
                      <p className="text line-clamp-1 word-wrap-anywhere">
                        {data.reply_to.text}
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Message text */}
                {data?.text ? (
                  <Linkify componentDecorator={componentDecorator}>
                    <p className="word-wrap-anywhere text">{`${data.text}`}</p>
                  </Linkify>
                ) : null}

                {/* message reaction & time */}
                <div className="flex items-center justify-between gap-12 mt-12">
                  <div>
                    {data.reaction_count ? (
                      <MessageReactionCount
                        onClick={handleClickMessageReaction}
                        count={data.reaction_count}
                        reactions={data.reactions}
                      />
                    ) : null}
                  </div>

                  <p className={`text text-end !text-gray`}>
                    {moment(data?.created_at).format('HH:mm')}
                  </p>
                </div>
              </div>

              {isLast || data.status ? (
                <MessageStatus
                  onResendMessage={handleResendMessage}
                  className={`${data?.text ? 'mt-12' : ''}`}
                  isRead={data.is_read}
                  showStatus={lastMessage?.id === data.id && lastMessage?.is_author}
                  status={data?.status}
                />
              ) : null}
            </div>
          ) : data?.attachments?.length ? (
            <div
              {...(handlers as any)}
              ref={messageOptionMenuRef}
              className={`relative w-full message-item-child-${data.id}`}
            >
              <MessageOption
                groupclassName={`hidden group-hover:flex w-full`}
                className={`${data?.is_author ? 'left-[-60px]' : 'right-[-60px]'}`}
                onReply={handleSetMessageReply}
              />

              <MessageReaction
                className={`hidden group-hover:block absolute bottom-[-8px] ${
                  data?.is_author ? 'left-[-8px]' : 'right-[-8px]'
                }`}
                onReaction={handleReactOnMessage}
                onUndoReaction={handleUndoReactOnMessage}
              />

              <div
                className={`relative rounded-lg ${data.is_author ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                <MessageImages data={data.attachments} className="mt-4" />

                {data?.text ? (
                  <div>
                    <Linkify componentDecorator={componentDecorator}>
                      <p className="text word-wrap-anywhere p-12">{`${data.text}`}</p>
                    </Linkify>
                  </div>
                ) : null}

                {/* message reaction & time */}
                <div className={`flex items-center justify-between gap-12 p-8`}>
                  <div>
                    {data.reaction_count ? (
                      <MessageReactionCount
                        className={`${data?.text || isLast ? 'mt-12' : ''}`}
                        onClick={handleClickMessageReaction}
                        count={data.reaction_count}
                        reactions={data.reactions}
                      />
                    ) : null}
                  </div>

                  <p className={`text mt-12 text-end !text-gray`}>
                    {moment(data?.created_at).format('HH:mm')}
                  </p>
                </div>
              </div>

              {isLast || data.status ? (
                <MessageStatus
                  onResendMessage={handleResendMessage}
                  className={`mt-12 ${data?.attachments?.length ? `pb-16 mt-12 md:mt-24` : ''}`}
                  isRead={data.is_read}
                  showStatus={lastMessage?.id === data.id && lastMessage?.is_author}
                  status={data?.status}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
