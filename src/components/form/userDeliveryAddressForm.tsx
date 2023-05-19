import { LocationOutlineIcon, UserCircleIcon } from '@/assets'
import { isObjectHasValue } from '@/helper'
import { useUser, useUserAddress } from '@/hooks'
import { AddressSchema } from '@/schema'
import { selectOrderAddress, setOrderAddress } from '@/store'
import { AddressAdd, AddressPickerRes, ShippingAddress } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { InputField, TextareaField } from '../inputs'
import { AddressPicker } from './addressPicker'
import { useSWRConfig } from 'swr'
import { SWR_KEY } from '@/constants'

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

  const orderAddress = useSelector(selectOrderAddress)

  const { userInfo } = useUser({})
  const dispatch = useDispatch()
  const { mutate } = useSWRConfig()

  const { addAddress } = useUserAddress({})

  useEffect(() => {
    if (!orderAddress) return

    setValue('name', orderAddress?.name)
    setValue('phone', orderAddress?.phone)
    setValue('street', orderAddress?.full_adress)
    setValue('state', {
      label: orderAddress?.state_id,
      value: orderAddress?.state_name_id,
    })

    setValue('district', {
      label: orderAddress?.district_id,
      value: orderAddress?.district_name_id,
    })

    setValue('ward', {
      label: orderAddress?.ward_id,
      value: orderAddress?.ward_name_id,
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
      adress_id: orderAddress?.id || false,
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

    const addressRes: ShippingAddress = {
      ...data,
      full_adress: `${data.street}, ${data.ward.label}, ${data.district.label},
               ${data.state.label}`,
      id: orderAddress?.id || 0,
      country_name_id: data?.country_id || '',
      country_id: data?.country_name || '',
      district_name_id: data?.district.value,
      district_id: data?.district.label,
      state_name_id: data?.state.value,
      state_id: data?.state.label,
      ward_name_id: data?.ward.value,
      ward_id: data?.ward.label,
    }

    addAddress({ address: newAddress, addressForm: addressRes }).then(() => {
      dispatch(setOrderAddress(addressRes))
      mutate(SWR_KEY.get_user_address)
      onExternalSubmit?.()
    })
  }

  return (
    <form className={twMerge(classNames(``, className))} onSubmit={handleSubmit(handleAddAddress)}>
      <div className="">
        <div className="mb-12">
          <div className="flex items-center mb-12">
            <UserCircleIcon className="text-lg mr-8 w-24 h-24" />
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
                  ? `${orderAddress?.state_id || ''} ${orderAddress?.district_id || ''} ${
                      orderAddress?.ward_id || ''
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
              defaultValue={orderAddress ? orderAddress?.full_adress : ''}
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
