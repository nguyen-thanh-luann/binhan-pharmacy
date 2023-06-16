import { Payment } from '@/types'
import classNames from 'classnames'
import React from 'react'
import { InputCheckbox } from '../inputs'
import { Image } from '../image'
import { companyIconSm } from '@/assets'

interface PaymentMethodProps {
  data: Payment
  className?: string
  isCheck?: boolean
  hanldeCheck?: (data: Payment) => void
}

export const PaymentMethod = ({
  data,
  className,
  isCheck = false,
  hanldeCheck,
}: PaymentMethodProps) => {
  return (
    <div className={classNames('', className)}>
      <li
        key={data.acquirer_id}
        onClick={() => hanldeCheck?.(data)}
        className={`flex items-center cursor-pointer mb-12 gap-8 last:mb-0`}
      >
        <InputCheckbox
          type="radio"
          isChecked={isCheck}
          onCheck={() => hanldeCheck?.(data)}
          className="rounded-full"
        />

        <div className="">
          <Image
            src={data?.image_url || companyIconSm}
            className="w-[24px] h-[24px] object-cover"
          />
        </div>

        <p className="text-md font-bold text-text-color line-clamp-1">{data.name}</p>
      </li>
    </div>
  )
}
