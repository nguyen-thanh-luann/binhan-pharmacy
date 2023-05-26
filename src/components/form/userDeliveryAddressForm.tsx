import { LocationOutlineIcon, UserDoubleCircleIcon } from '@/assets'
import { SWR_KEY } from '@/constants'
import { isObjectHasValue } from '@/helper'
import { useUser, useUserAddress } from '@/hooks'
import { AddressSchema } from '@/schema'
import { selectOrderAddress, setOrderAddress } from '@/store'
import { AddressAdd, AddressPickerRes, ShippingAddressV2 } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useSWRConfig } from 'swr'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { InputField, TextareaField } from '../inputs'
import { AddressPicker } from './addressPicker'

interface UserDeliveryAddressFormProps {
  onSubmit?: Function
  className?: string
}

export const UserDeliveryAddressForm = ({
  onSubmit: onExternalSubmit,
  className,
}: UserDeliveryAddressFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(AddressSchema),
    mode: 'all',
  })

  const orderAddress: ShippingAddressV2 = useSelector(selectOrderAddress)

  // console.log({ orderAddress })

  const { userInfo } = useUser({})
  const dispatch = useDispatch()
  const { mutate } = useSWRConfig()

  const { addAddress } = useUserAddress({})

  useEffect(() => {
    if (!orderAddress) return

    setValue('name', orderAddress?.name)
    setValue('phone', orderAddress?.phone)
    setValue('street', orderAddress?.street || '')
    setValue('state', {
      label: orderAddress?.state_id?.name,
      value: orderAddress?.state_id?.id,
    })

    setValue('district', {
      label: orderAddress?.district_id?.name,
      value: orderAddress?.district_id?.id,
    })

    setValue('ward', {
      label: orderAddress?.ward_id?.name,
      value: orderAddress?.ward_id?.id,
    })
  }, [])

  const handleSelectAddress = (data: AddressPickerRes) => {
    setValue('state', {
      label: data?.state?.label,
      value: data?.state?.value,
    })

    setValue('district', {
      label: data?.district?.label,
      value: data?.district?.value,
    })

    setValue('ward', {
      label: data?.ward?.label,
      value: data?.ward?.value,
    })
  }

  const handleAddAddress = (data: any) => {
    if (!isValid) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    const newAddress: AddressAdd = {
      partner_id: userInfo?.account?.partner_id || 0,
      // adress_id: orderAddress?.id || false,
      address_new: {
        name: data.name,
        phone: data.phone,
        street: data.street,
        state_id: data.state.value,
        district_id: data.district.value,
        ward_id: data.ward.value,
        country_id: data.country_id,
      },
    }

    const addressRes: ShippingAddressV2 = {
      name: data?.name,
      phone: data?.phone,
      full_adress: `${data.street}, ${data.ward.label}, ${data.district.label},
               ${data.state.label}`,
      id: 0, // setId = 0
      street: data?.street,
      country_id: {
        id: data?.country_id,
        name: data?.country_name,
      },
      district_id: {
        id: data?.district.value,
        name: data?.district.label,
      },
      state_id: {
        id: data?.state.value,
        name: data?.state.label,
      },
      ward_id: {
        id: data?.ward.value,
        name: data?.ward?.label,
      },
    }


    addAddress({
      address: newAddress,
      addressForm: addressRes,
      onSuccess: (data) => {
        dispatch(setOrderAddress(data))
        mutate(SWR_KEY.get_user_address)
        onExternalSubmit?.()
      },
    })
  }

  const defaultStreet = orderAddress?.street || 'Địa chỉ chi tiết'

  return (
    <form className={twMerge(classNames(``, className))} onSubmit={handleSubmit(handleAddAddress)}>
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
              defaultValue={orderAddress?.name || ''}
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
              defaultValue={orderAddress?.phone || ''}
            />
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center mb-12">
            <LocationOutlineIcon className="text-lg mr-8 w-24 h-24" />
            <p className="text-text-color text-lg font-bold">Địa chỉ nhận hàng</p>
          </div>

          <div className="mb-12">
            <AddressPicker
              onSubmit={(data: AddressPickerRes) => handleSelectAddress(data)}
              defaultValue={
                orderAddress
                  ? `${orderAddress?.ward_id.name || ''} ${orderAddress?.district_id?.name || ''} ${
                      orderAddress?.state_id?.name || ''
                    }`
                  : ``
              }
            />
          </div>

          <div className="mb-12">
            <TextareaField
              control={control}
              name="street"
              placeholder="Địa chỉ chi tiết"
              defaultValue={defaultStreet}
            />
          </div>
        </div>

        <Button
          type="submit"
          title={`${isObjectHasValue(orderAddress) ? 'Lưu' : 'Thêm'}`}
          className={`bg-primary w-full py-8 ${isValid ? '' : 'opacity-50 cursor-default hidden'}`}
          textClassName="text-white text-md"
        />
      </div>
    </form>
  )
}
