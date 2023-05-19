import { LeftIcon } from '@/assets'
import { Spinner } from '@/components/spinner'
import { WebsocketEmitEvents } from '@/constants'
import { useMessage, useRoomDetail } from '@/hooks'
import { RootState, setCurrentRoomId } from '@/store'
import { LikeMessage, RoomType, SendMessageData, UnlikeMessage } from '@/types'
import { useDispatch, useSelector } from 'react-redux'
import { Messageform, MessageList } from '../message'

export const RoomDetail = () => {

  const dispatch = useDispatch()
  const socket = useSelector((state: RootState) => state.chat.socket)
  const currentRoomId = useSelector((state: RootState) => state.chat.currentRoomId)
  
  const {
    data: messages,
    getMoreMessages,
    isFetchingMore,
    sendMessage,
    resendMessage,
    likeMessage,
    unlikeMessage
  } =
    useMessage({ roomId: currentRoomId })
  
  const { data, isFirstLoading } = useRoomDetail({ roomId: currentRoomId })


  const handleSendMessage = (params: SendMessageData) => {
    sendMessage({
      params,
      onSuccess: (data) => {
        socket?.emit(WebsocketEmitEvents.SEND_MESSAGE, data)
      },
    })
  }

  const handleBackToHomelist = () => {
    dispatch(setCurrentRoomId(undefined))
  }

  const handleReactionMessage = (params: LikeMessage) => {
    likeMessage(params)
  }

  const handleUndoMesasgeReaction = (params: UnlikeMessage) => {
    unlikeMessage(params)
  }

  
  if (!currentRoomId) return (<div className=''>
    <p className='text_md text-center'>Chưa chọn phòng</p>
  </div>)
  
  return (
    <div className="h-full">
      {isFirstLoading ? (
        <div className="flex justify-center h-full items-center">
          <Spinner className="w-25 h-25" />
        </div>
      ) : (
        <div className="h-full flex flex-col justify-between">
          <div className="flex items-center justify-between p-8">
            <button onClick={handleBackToHomelist}>
              <LeftIcon className="w-12 h-12" />
            </button>
            <p className="flex-1 text-center capitalize title">{data?.name}</p>
          </div>

          <div className="flex-1 overflow-scroll scrollbar-hide p-8">
            {messages?.data?.length ? (
              <MessageList
                isFetchingMore={isFetchingMore}
                roomType={data?.room_type as RoomType}
                data={messages}
                onGetMoreMessage={() => getMoreMessages()}
                onResendMessage={resendMessage}
                onReactMessage={handleReactionMessage}
                onUndoReactMessage={handleUndoMesasgeReaction}
              />
            ) : (
              <div className="">
                <p className="title_md text-center !text-primary">Bắt đầu trò chuyện!</p>
              </div>
            )}
          </div>

          <div>
            <Messageform onSubmit={handleSendMessage} />
          </div>
        </div>
      )}
    </div>
  )
}
