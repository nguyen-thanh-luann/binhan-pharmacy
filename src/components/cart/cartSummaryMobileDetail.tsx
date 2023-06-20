import { TimesIcon } from '@/assets'
import { formatMoneyVND } from '@/helper'

interface ICartSummaryMobileDetail {
  onClose?: Function
  subTotal?: number
  totalPromotion?: number
  total?: number
}

export const CartSummaryMobileDetail = ({
  onClose,
  subTotal = 0,
  total = 0,
  totalPromotion = 0,
}: ICartSummaryMobileDetail) => {
  return (
    <div className="relative h-[100vh] bg-black-400 animate-fade">
      <div className="absolute bottom-0 p-12 bg-white min-h-[150px] w-full rounded-tl-2xl rounded-tr-2xl duration-150 ease-in-out">
        <div className="relative mb-18">
          <p className="text-md font-semibold text-center">{'Đơn hàng'}</p>
          <div
            className="absolute top-4 right-4 cursor-pointer"
            onClick={() => {
              onClose && onClose()
            }}
          >
            <TimesIcon className="text-sm text-gray" />
          </div>
        </div>

        {/* subtotal */}
        <div className="flex items-center justify-between mb-12 title-md">
          <p className="text-base text-text-color font-semibold">{`Tạm tính`}</p>
          <p className="text-base text-text-color font-semibold">{formatMoneyVND(subTotal)}</p>
        </div>

        {/* total promotion */}
        <div className="flex items-center justify-between mb-12 title-md">
          <p className="text-base text-text-color font-semibold">{`Khuyến mãi`}</p>
          <p className="text-base text-text-color font-semibold">
            {`-${formatMoneyVND(totalPromotion)}`}
          </p>
        </div>

        {/* total */}
        <div className="flex items-center justify-between mb-12 title-md">
          <p className="text-base text-text-color font-semibold">{`Tổng`}</p>
          <p className="text-base text-text-color font-semibold">{formatMoneyVND(total)}</p>
        </div>
      </div>
    </div>
  )
}
