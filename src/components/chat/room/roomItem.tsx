
import { RoomRes } from '@/types'
import { avatarBlank } from '@/assets'
import {Image} from '@/components'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getMessageDescription, toFirstUpperCase } from '@/helper'
import moment from 'moment'

interface RoomItemProps {
  data: RoomRes | null
  isActive?: boolean
  onSelectRoom?: (data: RoomRes) => void
}

export const RoomItem = ({ data, onSelectRoom }: RoomItemProps) => {
  
  const currentRoomId = useSelector((state: RootState) => state.chat.currentRoomId);
  
	const messageUnsend = useSelector((state: RootState) =>
    state.chat.messageFormData?.find((item: any) => item.room_id === data?.id))
    
  return (
    <div>
      {data ? (
        <div
          onClick={() => onSelectRoom?.(data)}
          className={`p-8 flex items-center bg-background shadow-shadow-1 cursor-pointer hover:bg-gray-200 active:opacity-50 duration-150 ease-in-out`}
        >
          <div>
            <Image src={avatarBlank} imageClassName="w-40 h-40 rounded-full" />
          </div>

          <div className="ml-8 flex-1">
            {/* account info */}
            <div className="flex items-center justify-between">
              <p className="title">{data?.name || ''}</p>

              {currentRoomId !== data.id &&
              (messageUnsend?.attachments?.length ||
                messageUnsend?.text ||
                messageUnsend?.reply_to?.message_id) ? (
                <p className="text_sm !text-red">Chưa gửi</p>
              ) : data?.last_message?.created_at ? (
                <p className="text_sm">
                  {toFirstUpperCase(moment(data?.last_message?.created_at).fromNow())}
                </p>
              ) : null}
            </div>

            {/* last message */}
            {data?.last_message?.id ? (
              <div className="flex items-center">
                {currentRoomId !== data.id && messageUnsend?.text ? (
                  <p className="text_sm line-clamp-1 word-wrap-anywhere flex-1 mr-12">
                    {getMessageDescription({
                      message_text: messageUnsend?.text,
                      attachments: messageUnsend?.attachments as any[],
                    } as any)}
                  </p>
                ) : (
                  <div
                    className={`flex-1 flex items-center mr-12 ${
                      !data?.message_unread_count ? 'text-gray-400' : 'text-blue-500'
                    }`}
                  >
                    {data?.last_message?.is_author || data?.room_type === 'group' ? (
                      <span className="text_md mr-4 line-clamp-1 word-wrap-anywhere">
                        {data?.last_message?.is_author ? 'Bạn' : data.last_message?.user_name}:
                      </span>
                    ) : null}
                    <span
                      className={`text line-clamp-1 word-wrap-anywhere flex-1`}
                    >
                      {data?.last_message?.text}
                    </span>
                  </div>
                )}

                {/* <div className="">
                  {data?.message_unread_count ? (
                    <Badge className="text_sm" count={data.message_unread_count} size={16} />
                  ) : (
                    <BiCheck className="text-gray-color-5" />
                  )}
                </div> */}
              </div>
            ) : null}

          </div>
        </div>
      ) : null}
    </div>
  )
}
