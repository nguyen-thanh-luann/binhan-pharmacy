import React from 'react'
import { CommentIcon } from '@/assets'
import { useModal } from '@/hooks'
import { ChatContainer } from './chatContainer'

export const ChatButton = () => {
  const { closeModal, toggle, visible: showChatContent } = useModal()

  return (
    <div className="fixed bottom-[40px] right-[40px] z-40">
      <div className="">
        <div className={`${showChatContent ? '' : 'hidden'}`}>
          <ChatContainer onClose={closeModal} />
        </div>

        <div
          onClick={toggle}
          className={`${
            showChatContent ? 'hidden' : ''
          } relative w-[48px] h-[48px] rounded-full bg-primary text-white flex justify-center items-center cursor-pointer duration-150 ease-in-out active:opacity-50`}
        >
          <CommentIcon className="text-white w-[24px] h-[24px]" />

          <div className="absolute top-[-24%] right-[0] bg-red text-white rounded-full w-20 h-20 flex-center border border-white">
            <span className="text-xs">9</span>
          </div>
        </div>
      </div>
    </div>
  )
}