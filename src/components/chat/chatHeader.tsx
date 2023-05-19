import React from 'react'
import { Image } from '../image'
import { companyIconSm, TimesIcon } from '@/assets'

interface ChatHeaderProps {
  onClose?: () => void
}

export const ChatHeader = ({onClose}: ChatHeaderProps) => {
  return (
    <div className="border-b border-gray-200 p-[10px] shadow-sm flex justify-between items-center">
      <div className="flex gap-[8px] items-center">
        <Image
          src={companyIconSm}
          imageClassName='w-[24px] h-[24px]'
        />
        <p className="text-lg leading-9 font-bold text-text-color not-italic">Nhà Thuốc Bình An</p>
      </div>
      <button className="" onClick={() => {onClose?.()}}>
        <TimesIcon/>
      </button>
    </div>
  )
}
