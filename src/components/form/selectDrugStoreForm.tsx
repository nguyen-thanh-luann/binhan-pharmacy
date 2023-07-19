import { TimesIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useClickOutside, useDrugstores } from '@/hooks'
import { AddressPickerRes, GetDrugStoreParams, UserAccount } from '@/types'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { twMerge } from 'tailwind-merge'
import { NotFound } from '../notFound'
import { Spinner } from '../spinner'
import { AddressPickerV2 } from './addressPickerV2'
import { SearchField } from './searchField'

interface SelectDrugStoreFormProps {
  className?: string
  onSelect?: (data: UserAccount) => void
  onClose?: () => void
}

export const SelectDrugStoreForm = ({ className, onSelect, onClose }: SelectDrugStoreFormProps) => {
  const [params, setParams] = useState<GetDrugStoreParams>()

  const { drugstores, filter, hasMore, getMore } = useDrugstores({
    key: `${SWR_KEY.get_drug_stores}`,
    params: {},
  })

  const ref = useRef<HTMLDivElement>(null)

  useClickOutside([ref], () => {
    onClose?.()
  })

  const hanldeSelectStore = (data: UserAccount) => {
    onSelect?.(data)
    onClose?.()
  }

  useEffect(() => {
    if (params) filter(params)
  }, [params])

  const searchStore = (data: string) => {
    setParams({
      drugstore_name: data,
    })
  }

  const addressFilter = (data: AddressPickerRes) => {
    setParams({
      ...params,
      district_id: data?.district?.value,
      province_id: data?.state?.value,
      ward_id: data?.ward?.value,
    })
  }

  return (
    <div ref={ref} className={twMerge(classNames(`relative`, className))}>
      <div className="sticky top-0 z-40 bg-white">
        <div className="flex-between p-12">
          <p className="text-lg font-bold text-center capitalize">Chọn nhà thuốc</p>

          <button onClick={() => onClose?.()} className="">
            <TimesIcon className="text-gray" />
          </button>
        </div>

        <div className="p-12">
          <SearchField
            onChangeWithDebounceValue={(val) => searchStore(val as string)}
            className="border p-8"
            placeholder="Nhập tên cửa hàng"
          />
        </div>

        <div className="p-12">
          <AddressPickerV2
            placeHolder="Tìm theo địa chỉ"
            onSubmit={(data: AddressPickerRes) => addressFilter(data)}
          />
        </div>
      </div>

      <div className="p-12 max-h-[50vh] overflow-auto scrollbar-hide" id="drugstoresScrollable">
        <InfiniteScroll
          scrollableTarget="drugstoresScrollable"
          dataLength={drugstores?.length || 0}
          next={() => getMore()}
          hasMore={false}
          loader={
            hasMore ? (
              <div className="my-12">
                <Spinner />
              </div>
            ) : null
          }
        >
          {isArrayHasValue(drugstores) ? (
            <div>
              {drugstores?.map((store) => (
                <div
                  key={store.partner_id}
                  className="border border-gray-200 rounded-md p-12 mb-12 last:mb-0 cursor-pointer hover:bg-gray-200"
                  onClick={() => hanldeSelectStore(store)}
                >
                  <p className="text-md font-bold">
                    {store?.business_operation_name ||
                      store?.business_operation_owner ||
                      store?.partner_name}
                  </p>
                  <p className="text">{`Địa chỉ: ${store.full_address}`}</p>
                </div>
              ))}
            </div>
          ) : (
            <NotFound notify="Không tìm thấy cửa hàng nào!" />
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}
