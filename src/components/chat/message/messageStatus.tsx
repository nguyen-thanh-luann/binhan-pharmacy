import { ReloadIconOutline } from '@/assets'
import { MESSAGE_STATUS } from '@/constants'
import { MessageResponseStatus } from '@/types'

interface MessageStatusProps {
  createdAt?: Date
  status?: MessageResponseStatus
  showStatus: boolean
  isRead: boolean
  className?: string
  onResendMessage?: () => void
}

export const MessageStatus = ({
  status,
  showStatus,
  isRead,
  className = '',
  onResendMessage,
}: MessageStatusProps) => {
  return (
    <div className={`${className}`}>
      <div className={`flex items-center`}>
        {status && status !== 'fulfilled' ? (
          <p className={`text ml-auto ${status === 'rejected' ? 'text-red' : ''}`}>
            {MESSAGE_STATUS[status]}
          </p>
        ) : showStatus ? (
          <p className={`text ml-auto`}>{isRead ? 'Đã xem' : 'Đã gửi'}</p>
        ) : null}
      </div>
      {status === 'rejected' ? (
        <button
          onClick={() => onResendMessage?.()}
          className="flex items-center mt-8 hover:text-primary"
        >
          <ReloadIconOutline className="mr-4" />
          <span className={`text ml-auto hover:text-primary`}>Gửi lại</span>
        </button>
      ) : null}
    </div>
  )
}
