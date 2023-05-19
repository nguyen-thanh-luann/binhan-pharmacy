import { Image } from "@/components/image"
import { MESSAGE_EMOTION_ICON } from "@/constants"
import { MessageReactionType } from "@/types"

interface MessageReactionIconProps {
  emotion_type: MessageReactionType
  size?: number
  className?: string
}

export const MessageReactionIcon = ({
  emotion_type,
  size = 28,
  className = "",
}: MessageReactionIconProps) => {
  return (
    <span style={{ height: size, width: size }} className={`relative ${className}`}>
      <Image
        src={MESSAGE_EMOTION_ICON[emotion_type]}
        alt=""
      />
    </span>
  )
}
