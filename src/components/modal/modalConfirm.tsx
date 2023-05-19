import { WarningCircleIconOutline } from '@/assets'
import React from 'react'
import { Button } from '../button'
import { Modal, ModalTransitionType } from './modal'

interface modalConfirmProps {
  visible: boolean
  animationType?: ModalTransitionType
  onConfirm?: Function
  onDeny?: Function
  title: string
  confirmTitle?: string
  denyTitle?: string
}

export const ModalConfirm = ({
  visible,
  onConfirm,
  onDeny,
  denyTitle,
  confirmTitle,
  title,
  animationType = 'fade',
}: modalConfirmProps) => {
  return (
    <div>
      <Modal
        visible={visible}
        animationType={animationType}
        headerClassName="hidden"
        modalClassName="p-20 h-[212px] w-[396px] rounded-[10px]"
      >
        <div className="flex flex-col justify-between h-full">
          <div className='mb-12 flex-center'>
            <div className="flex-center w-[64px] h-[64px] bg-red-100 rounded-full">
              <WarningCircleIconOutline className="w-32 h-32 text-red" />
            </div>
          </div>

          <div className="flex-1 mb-20 flex justify-center items-center">
            <p className="title text-center">{title}</p>
          </div>

          <div className="flex items-center justify-between gap-16">
            <Button
              title={denyTitle ? denyTitle : 'Quay lại'}
              className="w-[50%] bg-gray-400 p-12 rounded-full active:opacity-50"
              textClassName="title !text-white"
              onClick={() => {
                onDeny?.()
              }}
            />

            <Button
              title={confirmTitle ? confirmTitle : 'Xác nhận'}
              className="w-[50%] bg-primary p-12 rounded-full active:opacity-50"
              textClassName="title !text-white"
              onClick={() => {
                onConfirm?.()
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
