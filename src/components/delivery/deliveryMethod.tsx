/* eslint-disable @next/next/no-img-element */
import { companyIconSm } from '@/assets'
import { formatMoneyVND } from '@/helper'
import { Delivery } from '@/types'
import { Image } from '../image'
import { InputCheckbox } from '../inputs'

interface DeliveryMethodProps {
  delivery: Delivery
  addDelivery: (delivery: Delivery) => void
  isActive: boolean
  disabled?: boolean
}

const DeliveryMethod = (props: DeliveryMethodProps) => {
  const { addDelivery, delivery, isActive, disabled = false } = props

  return (
    <div
      onClick={() => addDelivery && addDelivery(delivery)}
      key={delivery.carrier_id}
      className={`cursor-pointer border-1 border-gray-200 w-fit rounded-md mb-12 last:mb-0 ${
        isActive ? 'border-primary' : ''
      } ${disabled ? 'cursor-default opacity-50' : ''}`}
    >
      <div className="flex items-center gap-8">
        <InputCheckbox
          type="radio"
          isChecked={isActive}
          onCheck={() => addDelivery && addDelivery(delivery)}
          className="rounded-full"
        />

        <div className="">
          <Image
            src={delivery?.shipping_icon || companyIconSm}
            className="w-[24px] h-[24px] object-cover"
          />
        </div>

        <div className="">
          <p className="text-md font-bold text-text-color">{`${
            delivery.carrier_name
          } (${formatMoneyVND(delivery?.shipping_fee)})`}</p>
        </div>
      </div>
    </div>
  )
}

export { DeliveryMethod }
