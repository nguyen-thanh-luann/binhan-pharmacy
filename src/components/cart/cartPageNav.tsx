import { TrashIconOutline } from '@/assets'
import { useAsync, useModal } from '@/hooks'
import { cartAPI } from '@/services'
import { CartProduct } from '@/types'
import classNames from 'classnames'
import { toast } from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'
import { InputCheckbox } from '../inputs'
import { ModalConfirm } from '../modal'
import { Spinner } from '../spinner'

interface CartPageNavProps {
  className?: string
  isCheck: boolean
  onCheck?: () => void
  onDelete?: () => void
  getProductsChecked: () => CartProduct[]
}

export const CartPageNav = ({
  className,
  isCheck,
  onCheck,
  onDelete,
  getProductsChecked,
}: CartPageNavProps) => {
  const { asyncHandler, isLoading } = useAsync()

  const {
    visible: isOpenModalConfirm,
    closeModal: closeModalConfirm,
    openModal: openModalConfirm,
  } = useModal()

  const handleDelete = () => {
    if (getProductsChecked()?.length) {
      openModalConfirm()
    } else {
      toast.error('Bạn chưa chọn sản phẩm nào!')
      return
    }
  }

  const handleToggleCheckAll = () => {
    if (isLoading) return

    asyncHandler({
      fetcher: cartAPI.toggleCheckProductsInCart({ is_check: !isCheck }),
      onSuccess: onCheck,
      config: {
        showBackdrop: false,
        showSuccessMsg: false,
        setLoadingState: true,
      },
    })
  }

  return (
    <div
      className={twMerge(
        classNames(
          `bg-white p-12 rounded-[10px] shadow-shadow-1 z-10 sticky top-header_mobile_height md:top-header_group_height`,
          className
        )
      )}
    >
      <div className={`flex gap-24 items-center`}>
        {/* product info column */}
        <div className={`flex-1 flex items-center`}>
          <div className={`w-32`}>
            {isLoading ? (
              <Spinner />
            ) : (
              <InputCheckbox isChecked={isCheck} onCheck={handleToggleCheckAll} />
            )}
          </div>

          <p
            onClick={handleToggleCheckAll}
            className={classNames('title_md select-none !line-clamp-1 cursor-pointer')}
          >
            {'Chọn Tất Cả'}
          </p>
        </div>

        {/* price unit column */}
        <div className={`w-[115px] text-start hidden md:block`}>
          <p className="title_md line-clamp-1">Đơn giá</p>
        </div>

        {/* quantity column */}
        <div className={`w-[115px] text-start hidden md:block`}>
          <p className="title_md line-clamp-1">Số lượng</p>
        </div>

        {/* uom column */}
        <div className={`w-[115px] text-start hidden md:block`}>
          <p className="title_md line-clamp-1">Đơn vị</p>
        </div>

        {/* option column */}
        <div className="w-32">
          {getProductsChecked()?.length ? (
            <div className="cursor-pointer" onClick={handleDelete}>
              <TrashIconOutline className="text-red w-16 h-16" />
            </div>
          ) : null}
        </div>
      </div>

      {/* modal confirm delete */}
      <ModalConfirm
        visible={isOpenModalConfirm}
        title="Xóa sản phẩm được chọn?"
        onConfirm={() => {
          onDelete?.()
          closeModalConfirm()
        }}
        onDeny={closeModalConfirm}
      />
    </div>
  )
}
