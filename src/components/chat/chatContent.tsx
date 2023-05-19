import React from 'react'
import { RoomRes } from '@/types'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setCurrentRoomId } from '@/store'
import { RoomList } from './room/roomList'
import { RoomDetail } from './room/roomDetail'

interface ChatContentProps {
  className?: string
}

export const ChatContent = ({ className }: ChatContentProps) => {
  const dispatch = useDispatch()

  const currentRoomId = useSelector((state: RootState) => state.chat.currentRoomId)

  const handleSelectRoom = (room: RoomRes) => {
    dispatch(setCurrentRoomId(room?.id))    
  }
  
  
  return (
    <div className={twMerge(classNames('', className))}>

      {!currentRoomId ? 
        
      <div className={``}>
        <RoomList onSelectRoom={handleSelectRoom} />
      </div>
        :
        
      <div className={`h-full`}>
        <RoomDetail/>
      </div>
    }
    </div>
  )
}
