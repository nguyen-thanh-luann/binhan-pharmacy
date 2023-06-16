import classNames from 'classnames'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { StoreReceiveForm, UserDeliveryAddressForm } from '../form'
import { Tabs } from '../tabs'

interface DeliveryAddressProps {
  className?: string
}

export type DeliveryTabOption = 'user' | 'store'

export const DeliveryAddress = ({ className }: DeliveryAddressProps) => {
  const deliveryTabs = [
    { label: 'Giao hàng cho bạn', value: 'user' },
    { label: 'Nhận tại nhà thuốc', value: 'store' },
  ]

  const [currentTab, setCurrentTab] = useState<DeliveryTabOption>('user')

  const handleChangeTab = (value: DeliveryTabOption) => {
    setCurrentTab(value)
    //check orderAddress
  }

  return (
    <div className={twMerge(classNames(`bg-white shadow-shadow-1 rounded-lg p-12`, className))}>
      <div className="flex justify-between items-center flex-wrap gap-12 mb-24">
        <p className="text-text-color font-bold text-xl leading-10">
          Thông tin địa chỉ nhận hàng
        </p>

        <div className="">
          <Tabs
            list={deliveryTabs}
            tabActive={currentTab}
            onChange={(val: any) => handleChangeTab(val)}
            className="rounded-full border border-gray-200"
            labelClassName="rounded-full w-[50%] px-12 py-8  text-center"
            tabActiveClassName="!bg-primary text-white"
          />
        </div>
      </div>

      <div>{currentTab === 'user' ? <UserDeliveryAddressForm /> : <StoreReceiveForm />}</div>
    </div>
  )
}
