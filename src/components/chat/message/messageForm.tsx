import { EmojiIcon, PhotoIcon, ReplyIcon, SendIcon, TimesIcon } from '@/assets'
import { Image } from '@/components/image'
import { WebsocketEmitEvents } from '@/constants'
import { useClickOutside } from '@/hooks'
import {
  addMessageAttachment,
  deleteMessageAttachment,
  resetMessageDataInRoom,
  RootState,
  setMessageDataInRoom,
  setMessageReply,
  setMessageText,
} from '@/store'
import { MessageAttachment, SendMessageData } from '@/types'
import { Categories, EmojiStyle } from 'emoji-picker-react'
import dynamic from 'next/dynamic'
import { ChangeEvent, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { ImagePickupPreview } from './messageImagePicker'

interface MessageFormProps {
  onSubmit?: (val: SendMessageData) => void
}

const Picker = dynamic(
  () => {
    return import('emoji-picker-react')
  },
  { ssr: false }
)

export const Messageform = ({ onSubmit }: MessageFormProps) => {
  const dispatch = useDispatch()
  const emojiRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const timeout = useRef<any>()

  const messageFormIndex = useSelector((state: RootState) => state.chat.currentMessageFormDataIndex)
  const messageFormData = useSelector(
    (state: RootState) => state.chat.messageFormData?.[messageFormIndex]
  )
  const socket = useSelector((state: RootState) => state.chat.socket)
  const user = useSelector((state: RootState) => state.chat.profile)
  const roomId = useSelector((state: RootState) => state.chat.currentRoomId) as string
  const currentTyping = useSelector((state: RootState) => state.chat.currentTyping)

  const [isTyping, setTyping] = useState<boolean>(false)
  const [showEmoji, setShowEmoji] = useState<boolean>(false)
  const [hasText, setHasText] = useState<boolean>(!!messageFormData.text)

  useClickOutside([emojiRef], () => {
    setShowEmoji(false)
  })

  const handleChange = (text: string) => {
    if (messageInputRef?.current) {
      const value = (messageInputRef.current?.value || '').trim()
      messageInputRef.current.value = `${value ? `${value} ` : ''}${text} `
      messageInputRef.current?.focus()
    }

    if (!hasText) {
      setHasText(true)
    }

    onKeyDownNotEnter()
  }

  const onKeyDownNotEnter = () => {
    if (isTyping === false) {
      setTyping(true)
      user &&
        socket?.emit(WebsocketEmitEvents.START_TYPING, {
          room_id: roomId,
          user_name: user.user_name,
          user_id: user.user_id,
        })

      timeout.current = setTimeout(timeoutFunction, 3000)
    } else {
      clearTimeout(timeout.current)
      timeout.current = setTimeout(timeoutFunction, 3000)
    }
  }

  const timeoutFunction = () => {
    setTyping(false)
    user &&
      socket?.emit(WebsocketEmitEvents.STOP_TYPING, {
        room_id: roomId,
        user_name: user.user_name,
        user_id: user.user_id,
      })
  }

  const handleSubmit = async () => {
    if (!messageFormData) return

    const text = messageInputRef.current?.value?.trim()
    const { attachments } = messageFormData
    if (!attachments?.length && !text) return

    if (user) {
      timeoutFunction()
      clearTimeout(timeout.current)
    }

    onSubmit?.({ ...messageFormData, text })

    setHasText(false)

    dispatch(resetMessageDataInRoom())

    const input = messageInputRef?.current
    if (input) {
      input.value = ''
      input?.focus()
      input.style.height = '20px'
    }
  }

  const textareaGrowthUp = () => {
    const textarea = messageInputRef.current
    if (!textarea) return

    textarea.style.height = '20px'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  const handleAddFile = (e: ChangeEvent<HTMLInputElement>) => {
    const attachments = toAttachments(e)
    if (!attachments) return
    if (!checkLimitFile(attachments.length)) return

    dispatch(addMessageAttachment(attachments))
  }

  const toAttachments = (e: ChangeEvent<HTMLInputElement>): MessageAttachment[] | null => {
    const files = e.target.files
    if (!files?.length) return null

    return Array.from(files).map((file) => ({
      id: uuidv4(),
      file,
      previewImage: URL.createObjectURL(file),
    }))
  }

  const checkLimitFile = (length: number): boolean => {
    if (length + (messageFormData?.attachments?.length || 0) > 20) {
      toast.error('Bạn chỉ được chọn tối đa 20 ảnh 1 lần')
      return false
    }
    return true
  }

  const handleInputFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const attachments = toAttachments(e)
    if (!attachments || !checkLimitFile(attachments.length)) return

    dispatch(setMessageDataInRoom({ ...messageFormData, attachments }))
  }

  const storeMessageText = () => {
    const val = messageInputRef?.current?.value || ''
    if (val !== messageFormData?.text) {
      dispatch(setMessageText(val.trim()))
    }
  }

  return (
    <div className="relative">
      <div className="">
        {showEmoji ? (
          <div
            onBlur={() => {}}
            ref={emojiRef}
            className="absolute bottom-[70px] right-20 shadow-lg"
          >
            <Picker
              categories={[
                { category: Categories.SUGGESTED, name: 'Gợi ý' },
                { category: Categories.SMILEYS_PEOPLE, name: 'Cảm xúc' },
                { category: Categories.TRAVEL_PLACES, name: 'Địa điểm' },
                { category: Categories.SYMBOLS, name: 'Ký tự' },
                { category: Categories.FOOD_DRINK, name: 'Ăn uống' },
                { category: Categories.OBJECTS, name: 'Đối tượng' },
              ]}
              onEmojiClick={({ emoji }) => handleChange(emoji)}
              lazyLoadEmojis
              emojiStyle={EmojiStyle.FACEBOOK}
              width={300}
            />
          </div>
        ) : null}
      </div>

      {/* Typing */}
      {currentTyping?.room_id === roomId ? (
        <div className="absolute left-0 top-[-26px] flex-center px-12 md:px-16 py-4 bg-white">
          <p className="text_sm line-clamp-1 word-wrap-anywhere">
            {currentTyping?.user_name} đang soạn tin nhắn...
          </p>
        </div>
      ) : null}

      {/* Image pickup preview */}
      {messageFormData?.attachments?.length ? (
        <div
          style={{
            top: messageFormData?.reply_to?.message_id ? -250 : -176,
          }}
          className={``}
        >
          <ImagePickupPreview
            onClose={() => dispatch(setMessageDataInRoom({ ...messageFormData, attachments: [] }))}
            onAdd={handleAddFile}
            onDelete={(imageId) => dispatch(deleteMessageAttachment({ imageId }))}
            data={(messageFormData?.attachments as any[]) || []}
          />
        </div>
      ) : null}

      {/* Reply to */}
      {messageFormData?.reply_to?.id ? (
        <div className="p-12 bg-white">
          <div className="p-8 flex-1 relative bg-gray-100">
            <div className="flex items-center">
              {messageFormData?.reply_to?.attachment?.id ? (
                <div className="mr-12 w-[36px] relative overflow-hidden h-[36px] rounded-md">
                  <Image src={messageFormData?.reply_to?.attachment.url} alt="" />
                </div>
              ) : null}

              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <ReplyIcon className="w-12 h-12" />
                    <span className="text">Trả lời</span>
                  </div>
                  <span className="title text-primary line-clamp-1">
                    {messageFormData?.reply_to?.author_name}
                  </span>
                </div>

                <p className="text line-clamp-1 word-wrap-anywhere">
                  {messageFormData?.reply_to?.text}
                </p>
              </div>
            </div>

            <button
              onClick={() => dispatch(setMessageReply(undefined))}
              className="w-10 h-10 transition-colors duration-100 flex-center absolute right-12 top-12"
            >
              <TimesIcon />
            </button>
          </div>
        </div>
      ) : null}

      {/* Message input */}
      <div className="p-[10px] border-t border-gray-200 flex items-center justify-between">
        {/* select images */}
        <div className="">
          <input
            onChange={handleInputFileChange}
            hidden
            type="file"
            name=""
            multiple
            id="message-attachment"
            accept="image/*"
          />
          <label className="cursor-pointer" htmlFor="message-attachment" id="message-attachment">
            <PhotoIcon className="w-20 h-20 text-black" />
          </label>
        </div>

        {/* input message */}
        <div className="flex-1 mx-8 border border-gray-300 rounded-full p-8">
          <div className="flex items-center gap-8">
            <textarea
              id="message-form-input"
              style={{ height: 20, maxHeight: 40 }}
              ref={messageInputRef}
              defaultValue={messageFormData.text}
              className="flex-1 text  resize-none outline-none bg-background"
              placeholder="Nhập tin nhắn"
              onBlur={() => {
                storeMessageText()
              }}
              onChange={(e) => {
                const { value } = e.target
                textareaGrowthUp()
                if (!value && hasText) {
                  setHasText(false)
                } else if (value && !hasText) {
                  setHasText(true)
                }
                onKeyDownNotEnter()
              }}
              onKeyDown={(e) => {
                if (e.code === 'Enter' && !e.shiftKey) {
                  handleSubmit()
                  e.preventDefault()
                }
              }}
            />

            <div className="">
              <div onClick={() => setShowEmoji(!showEmoji)} className="cursor-pointer">
                <EmojiIcon className="w-20 h-20" />
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <button onClick={handleSubmit}>
            <SendIcon className="w-16 h-16 text-primary active:opacity-50 duration-150 ease-in-out" />
          </button>
        </div>
      </div>
    </div>
  )
}
