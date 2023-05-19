import { CHAT_POPOVER_HEIGHT } from '@/constants'
import { ChatContent } from './chatContent'
import { ChatHeader } from './chatHeader'

interface ChatContainerProps {
  onClose?: () => void
}

export const ChatContainer = ({ onClose }: ChatContainerProps) => {

  return (
    <div
      className={`max-h-[${CHAT_POPOVER_HEIGHT}px] h-[80vh] w-[370px] max-w-[370px] flex flex-col justify-between bg-background border border-gray-200 rounded-lg shadow-shadow-1 duration-150 ease-in-out`}
    >
      <ChatHeader onClose={onClose} />

      <ChatContent className="flex-1 overflow-scroll scrollbar-hide" />
    </div>
  )
}
