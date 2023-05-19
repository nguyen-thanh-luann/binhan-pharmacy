import { Spinner } from '@/components'
import { LikeMessage, ListRes, MessageRes, RoomType, UnlikeMessage } from '@/types'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroll-component'
import { MessageItem } from './messageItem'

interface MessageListProps {
  data: ListRes<MessageRes[]>
  isFetchingMore?: boolean
  onGetMoreMessage: Function
  roomType: RoomType
  onResendMessage?: (_: MessageRes) => void
  onReactMessage?: (_: LikeMessage) => void
  onUndoReactMessage?: (_: UnlikeMessage) => void
}

export const MessageList = ({
  data,
  isFetchingMore,
  onGetMoreMessage,
  roomType,
  onResendMessage,
  onReactMessage,
  onUndoReactMessage
}: MessageListProps) => {

  const handleRedirectToReplyMessage = (id: string) => {
    document.querySelector(`.message-item-${id}`)?.scrollIntoView()
  }
  
  return (
    <div
      id="messageScrollable"
      className={`flex-1 overflow-y-auto max-h-[700px] flex flex-col-reverse scrollbar-hide chat-message-list`}
    >
      <InfiniteScroll
        inverse
        className="px-12 lg:p-16 min-h-full flex flex-col-reverse"
        scrollableTarget="messageScrollable"
        loader={
          isFetchingMore ? (
            <div className="text-center text-primary">
              <Spinner className="w-20 h-20" />
            </div>
          ) : null
        }
        hasMore={data?.has_more || true}
        next={() => {
          if (isFetchingMore) return
          onGetMoreMessage()
        }}
        dataLength={data?.data?.length || 0}
      >
        {isFetchingMore ? <Spinner className="w-20 h-20 text-center " /> : null}

        {data?.data?.length
          ? data?.data?.map((item, index) => {
              const messages = data?.data || []
              const prevMsg = messages[index - 1]
              // const nextMsg = messages[index + 1]

              const shouldShowDate = !moment(item?.created_at).isSame(
                moment(prevMsg?.created_at),
                'date'
              )

              const shouldBreak =
                !prevMsg || prevMsg?.author_id !== item?.author_id || shouldShowDate

              const isLast = !prevMsg

              return (
                <div key={item.id}>
                  {shouldShowDate ? (
                    <div className="flex-center my-24 mx-24">
                      <span className="flex-1 border-b border-gray-300"></span>
                      <span className="text_sm md:text-12 bg-gray-200 rounded-[8px] py-2 px-8 mx-4">
                        {moment(item.created_at).format('HH:mm DD/MM/YYYY')}
                      </span>
                      <span className="flex-1 border-b border-gray-300"></span>
                    </div>
                  ) : null}

                  <MessageItem
                    roomType={roomType}
                    onResendMessage={onResendMessage}
                    onClickReplyMsg={handleRedirectToReplyMessage}
                    isLast={isLast}
                    shouldBreak={shouldBreak}
                    onReactMessage={onReactMessage}
                    onUndoReactMessage={onUndoReactMessage}
                    lastMessage={data.data?.[data?.data?.length - 1]}
                    data={item}
                  />
                </div>
              )
            })
          : null}
      </InfiniteScroll>
    </div>
  )
}
