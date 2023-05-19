import { Spinner } from '@/components'
import { useRoom } from '@/hooks'
import { RootState } from '@/store'
import { RoomRes } from '@/types'
import React from 'react'
import { useSelector } from 'react-redux'
import { RoomItem } from './roomItem'

interface RoomListProps {
  onSelectRoom?: (room: RoomRes) => void
}


export const RoomList = ({onSelectRoom}: RoomListProps) => {
  const { data, isValidating } = useRoom()

  const roomId = useSelector((state: RootState) => state.chat.currentRoomId) as string


  return (
    <div className="">
      {isValidating ? (
        <div className="flex justify-center h-full items-center my-12">
          <Spinner className="w-25 h-25" />
        </div>
      ) : (
        <div className="">
          {data?.data?.map((item: any) => (
            <RoomItem
              key={item.id}
              isActive={item.room_id === roomId}
              data={item}
              onSelectRoom={onSelectRoom}
            />
          ))}
        </div>
      )}
    </div>
  )
}
