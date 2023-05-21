import { LocationOutlineIcon, PenIconSolid, TimesIcon, TrashIconOutline } from '@/assets'
import { TelePhoneIconOutline } from '@/assets/icons/telephoneOutline'
import { useModal, useUser, useUserAddress } from '@/hooks'
import { setAddressForm } from '@/store'
import { ShippingAddressV2 } from '@/types'
import classNames from 'classnames'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import { AddressForm } from '../form'
import { Modal, ModalConfirm } from '../modal'

interface IAddressItem {
  isActive?: boolean
  address: ShippingAddressV2
  className?: string
}

export const AddressItem = ({ isActive, address, className }: IAddressItem) => {
  const dispatch = useDispatch()
  const { userInfo } = useUser({})
  const partner_id = userInfo?.account?.partner_id || 0

  const {
    visible: showModalConfirm,
    closeModal: closeModalConfirm,
    openModal: openModalConfirm,
  } = useModal()

  const {
    visible: showModalUpdate,
    closeModal: closeModalUpdate,
    openModal: openModalUpdate,
  } = useModal()

  const { deleteAddress } = useUserAddress({ shouldFetch: false })

  const onClickUpdate = () => {
    if (!address) return

    openModalUpdate()
    dispatch(setAddressForm(address))
  }

  const handleCloseModalUpdate = () => {
    closeModalUpdate()
    dispatch(setAddressForm(undefined))
  }

  const handleDeleteAddress = () => {
    if (!partner_id) return

    deleteAddress({ partner_id, adress_id: address.id }).then(() => {
      closeModalConfirm()
      toast.success('Xóa địa chỉ thành công!')
    })
  }

  return (
    <div
      className={twMerge(
        classNames(
          `bg-white p-16 mb-20 last:mb-0 border-b border-gray-200 last:border-none ${
            isActive ? '' : ''
          }`,
          className
        )
      )}
    >
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-lg flex-1 line-clamp-1 font-bold">{address.name}</p>
          <div className="flex items-center">
            <div
              onClick={() => {
                onClickUpdate()
              }}
              className="flex title-sm !font-600 items-center cursor-pointer !text-blue-800 hover:bg-blue-200 rounded-md p-8 duration-150 ease-in-out"
            >
              <PenIconSolid />
              <span className="ml-4">Chỉnh sửa</span>
            </div>

            <div
              onClick={() => openModalConfirm()}
              className="flex title-sm !font-600 items-center !text-red ml-12 cursor-pointer hover:bg-red-200 rounded-md p-8 duration-150 ease-in-out"
            >
              <TrashIconOutline />
              <span className="ml-4">Xóa</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <LocationOutlineIcon className="min-w-[16px] w-[16px] h-[16px]" />
          <p className="text-base font-semibold line-clamp-1">{address.full_adress}</p>
        </div>

        <div className="flex items-center gap-8">
          <TelePhoneIconOutline className="min-w-[16px] w-[16px] h-[16px]" />
          <p className="text-base font-semibold line-clamp-1">{address.phone}</p>
        </div>
      </div>

      {/* modal confirm delete */}
      <ModalConfirm
        visible={showModalConfirm}
        title="Bạn có chắc muốn xóa địa chỉ"
        onDeny={closeModalConfirm}
        onConfirm={handleDeleteAddress}
      />

      {/* modal update form */}
      <Modal
        visible={showModalUpdate}
        headerClassName="hidden"
        modalClassName="w-[90%] md:w-[500px] max-w-[90vw] h-fit"
      >
        <div>
          <div className="flex-between p-12">
            <p className="text-md">Cập nhật địa chỉ</p>
            <div className="cursor-pointer" onClick={handleCloseModalUpdate}>
              <TimesIcon />
            </div>
          </div>

          <div className="max-h-[400px] h-fit overflow-scroll scrollbar-hide p-12">
            <AddressForm
              onSubmit={() => {
                closeModalUpdate()
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
