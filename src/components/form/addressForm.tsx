import { isObjectHasValue } from '@/helper'
import { useUser, useUserAddress } from '@/hooks'
import { AddressSchema } from '@/schema'
import { selectAddressForm, selectOrderAddress, setAddressForm } from '@/store'
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

interface AddressFormProps {
  onSubmit?: Function
  className?: string
}

// use AddressForm to add address
export const AddressForm = ({ onSubmit: onExternalSubmit, className }: AddressFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(AddressSchema),
    mode: 'all',
  })

  const addressForm = useSelector(selectAddressForm)
  
  const { userInfo } = useUser({})
  const dispatch = useDispatch()

  const { addAddress, updateOrderAddress } = useUserAddress({})
  const orderAddress = useSelector(selectOrderAddress)

  useEffect(() => {
    if (!addressForm) return

    setValue('name', addressForm?.name)
    setValue('phone', addressForm?.phone)
    setValue('street', addressForm?.full_adress)
    setValue('state', {
      label: addressForm?.state_id,
      value: addressForm?.state_name_id,
    })

    setValue('district', {
      label: addressForm?.district_id,
      value: addressForm?.district_name_id,
    })

    setValue('ward', {
      label: addressForm?.ward_id,
      value: addressForm?.ward_name_id,
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
      adress_id: addressForm?.id || false,
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
      id: addressForm?.id || 0,
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
      dispatch(setAddressForm(undefined))
      if (addressRes?.id === orderAddress?.id) {
        updateOrderAddress(addressRes)
      }
      onExternalSubmit?.()
    })
  }

  return (
    <form className={twMerge(classNames(``, className))} onSubmit={handleSubmit(handleAddAddress)}>
      <div className="">
        <div className="mb-12">
          <InputField
            control={control}
            name="name"
            type="text"
            placeholder={`Họ và tên`}
            defaultValue={addressForm?.name}
            inputClassName="p-12"
            required
          />
        </div>

        <div className="mb-12">
          <InputField
            control={control}
            name="phone"
            type="text"
            placeholder={`số điện thoại`}
            defaultValue={addressForm?.phone}
            inputClassName="p-12"
            required
          />
        </div>

        <div className="mb-12">
          <AddressPicker
            onSubmit={(data: AddressPickerRes) => handleSelectAddress(data)}
            defaultValue={
              addressForm
                ? `${addressForm?.state_id} ${addressForm?.district_id} ${addressForm?.ward_id}`
                : ``
            }
          />
        </div>

        <div className="mb-12">
          <TextareaField
            control={control}
            name="street"
            placeholder="Địa chỉ chi tiết"
            defaultValue={addressForm?.full_adress}
          />
        </div>

        <Button
          type="submit"
          title={`${isObjectHasValue(addressForm) ? 'Lưu' : 'Thêm'}`}
          className={`bg-primary w-full py-8 ${isValid ? '' : 'opacity-50 cursor-default'}`}
          textClassName="text-white text-md"
        />
      </div>
    </form>
  )
}
