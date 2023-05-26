import { LocationOutlineIcon, UserDoubleCircleIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useDrugstores, useUser, useUserAddress } from '@/hooks'
import { storeReceiveSchema } from '@/schema'
import { setOrderAddress } from '@/store'
import {
  AddressAdd,
  AddressPickerRes,
  GetDrugStoreParams,
  ShippingAddressV2,
  UserAccount,
} from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch } from 'react-redux'
import { useSWRConfig } from 'swr'
import { Button } from '../button'
import { InputCheckbox, InputField } from '../inputs'
import { Spinner } from '../spinner'
import { AddressPicker } from './addressPicker'
import { SearchField } from './searchField'

export const StoreReceiveForm = () => {
  const [params, setParams] = useState<GetDrugStoreParams>()
  const [storeSelected, setStoreSelected] = useState<UserAccount>()

  const { addAddress } = useUserAddress({})
  const { drugstores, filter, hasMore, getMore } = useDrugstores({
    key: `${SWR_KEY.get_drug_stores}`,
    params: {},
  })
  // const orderAddress = useSelector(selectOrderAddress)
  const dispatch = useDispatch()
  const { mutate } = useSWRConfig()
  const { userInfo } = useUser({})

  useEffect(() => {
    if (!storeSelected) {
      setStoreSelected(drugstores?.[0])
    }
  }, [drugstores])

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(storeReceiveSchema),
    mode: 'all',
  })

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

  const onCheckStore = (store: UserAccount) => {
    setStoreSelected(store)
    setValue('drugstore_id', store.partner_id)
  }

  const handleConfirm = (data: any) => {
    if (!isValid && storeSelected) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    const newAddress: AddressAdd = {
      partner_id: userInfo?.account?.partner_id || 0,
      // adress_id: orderAddress?.id || false,
      address_new: {
        name: data.name,
        phone: data.phone,
        street: storeSelected?.street || '',
        state_id: storeSelected?.province_id?.province_id || 0,
        district_id: storeSelected?.district_id?.district_id || 0,
        ward_id: storeSelected?.ward_id?.ward_id || 0,
      },
    }

    const addressRes: ShippingAddressV2 = {
      name: data?.name,
      phone: data?.phone,
      full_adress: storeSelected?.full_address || '',
      id: 0,
      street: storeSelected?.street || '',
      district_id: {
        id: storeSelected?.district_id.district_id || 0,
        name: storeSelected?.district_id.district_name || '',
      },
      state_id: {
        id: storeSelected?.province_id.province_id || 0,
        name: storeSelected?.province_id.province_name || '',
      },
      ward_id: {
        id: storeSelected?.ward_id.ward_id || 0,
        name: storeSelected?.ward_id?.ward_name || '',
      },
    }

    addAddress({
      address: newAddress,
      addressForm: addressRes,
      onSuccess: (data) => {
        dispatch(setOrderAddress(data))
        mutate(SWR_KEY.get_user_address)
      },
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleConfirm)}>
        <div className="">
          <div className="mb-12">
            <div className="flex items-center mb-12">
              <UserDoubleCircleIcon className="text-lg mr-8 w-24 h-24" />
              <p className="text-text-color text-lg font-bold">Thông tin người nhận</p>
            </div>

            <div className="flex gap-12">
              <InputField
                control={control}
                name="name"
                type="text"
                label="Họ và tên"
                placeholder={`Họ và tên`}
                className="flex-1"
                defaultValue={userInfo?.account?.partner_name || ''}
                required
              />

              <InputField
                control={control}
                name="phone"
                type="text"
                label="Số điện thoại"
                placeholder={`số điện thoại`}
                className="flex-1"
                required
                defaultValue={userInfo?.account?.phone || ''}
              />
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center mb-12">
              <LocationOutlineIcon className="text-lg mr-8 w-24 h-24" />
              <p className="text-text-color text-lg font-bold">Chọn nhà thuốc nhận hàng</p>
            </div>

            <div className="mb-12">
              <SearchField
                onChangeWithDebounceValue={(val) => searchStore(val as string)}
                className="border p-8"
                placeholder="Nhập tên nhà thuốc"
              />
            </div>

            <div className="mb-12">
              <AddressPicker
                placeHolder="Tìm theo địa chỉ"
                onSubmit={(data: AddressPickerRes) => addressFilter(data)}
              />
            </div>

            <div className="max-h-[400px] overflow-scroll scrollbar-hide">
              <InfiniteScroll
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
                        className="border border-gray-200 rounded-md p-12 mb-12 last:mb-0 cursor-pointer hover:bg-gray-200 flex gap-8 items-center"
                        onClick={() => onCheckStore(store)}
                      >
                        <InputCheckbox
                          type="radio"
                          isChecked={storeSelected?.partner_id === store?.partner_id}
                          onCheck={() => onCheckStore(store)}
                          className="rounded-full"
                        />

                        <div className="flex-1">
                          <p className="text-md font-bold">{store.partner_name}</p>
                          <p className="text">{`Địa chỉ: ${store.full_address}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </InfiniteScroll>
            </div>
          </div>

          <Button
            type="submit"
            title={`Xác nhận`}
            className={`bg-primary w-full py-8 ${
              isValid ? '' : 'opacity-50 cursor-default hidden'
            }`}
            textClassName="text-white text-md"
          />
        </div>
      </form>
    </div>
  )
}
