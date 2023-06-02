import { EmailIcon, PenIconSolid, TelePhoneIcon } from '@/assets'
import {
  AddressPicker,
  Button,
  CustomImage,
  InputDate,
  InputField,
  TextareaField,
} from '@/components'
import { LIMIT_ATTACHMENT } from '@/constants'
import { isAddressNameValid, isInvalidDate } from '@/helper'
import { useAttachment, useCreateAttachment, useUser } from '@/hooks'
import { storeInfoSchema } from '@/schema'
import { AddressPickerRes, CreateAttachmentRes, UserInfo } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import moment from 'moment'
import { ChangeEvent, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'

interface StoreProfileProps {
  data: UserInfo
  className?: string
}

export const StoreProfile = ({ data, className }: StoreProfileProps) => {
  const { updateUser } = useUser({})
  const { getBase64Images } = useAttachment({ limit: LIMIT_ATTACHMENT })
  const { createAttachment } = useCreateAttachment()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(storeInfoSchema),
    mode: 'all',
  })

  // setForm data in first load
  useEffect(() => {
    if (!data) return

    setValue('email', data?.account?.email || '')
    setValue('businessName', data?.account?.business_operation_name || '')
    setValue('businessOwner', data?.account?.business_operation_owner || '')
    setValue('businessPhone', data?.account?.business_phone || '')
    setValue('addressDetail', data?.account?.full_address || '')
    setValue('state', {
      label: data?.account?.province_id?.province_name,
      value: data?.account?.province_id?.province_id,
    })

    setValue('district', {
      label: data?.account?.district_id?.district_name,
      value: data?.account?.district_id?.district_id,
    })

    setValue('ward', {
      label: data?.account?.ward_id?.ward_name,
      value: data?.account?.ward_id?.ward_id,
    })
    setValue('dateOfBirth', moment(data?.account?.date_of_birth).format('YYYY-MM-DD') || '')
    setValue('establishDate', moment(data?.account?.establish_date).format('YYYY-MM-DD') || '')
  }, [])

  const handleEditUser = (newUserInfo: any) => {
    updateUser(
      {
        business_operation_name: newUserInfo?.businessName,
        business_operation_owner: newUserInfo?.businessOwner,
        business_phone: newUserInfo?.businessPhone,
        email: newUserInfo?.email || '',
        date_of_birth: isInvalidDate(newUserInfo?.dateOfBirth)
          ? moment(new Date()).format('YYYY-MM-DD')
          : newUserInfo?.dateOfBirth,

        establish_date: isInvalidDate(newUserInfo?.establishDate)
          ? moment(new Date()).format('YYYY-MM-DD')
          : newUserInfo?.establishDate,

        province_id: newUserInfo?.state?.value,
        district_id: newUserInfo?.district?.value,
        ward_id: newUserInfo?.ward?.value,
        street: newUserInfo?.addressDetail,
      },
      () => {
        toast.success('Cập nhật thông tin thành công!')
      }
    )
  }

  const handleChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files) return

    getBase64Images(e.target.files, (images) => {
      if (!images?.[0]) return

      createAttachment({
        file: images?.[0].replace(/^data:image\/\w+;base64,/, ''),
        onSuccess(res: CreateAttachmentRes[]) {
          updateUser(
            {
              avatar_url: res[0]?.id || 0,
            },
            () => {
              toast.success('Cập nhật ảnh đại diện thành công!')
            }
          )
        },
      })
    })
  }

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

  return (
    <div className={twMerge(classNames(``, className))}>
      <div className="flex flex-col md:flex-row items-center gap-24 mb-24">
        <div className="min-w-[120px] h-[120px] rounded-full relative">
          <input onChange={handleChangeAvatar} type="file" name="" hidden id="user-avatar" />

          <label htmlFor="user-avatar" className="cursor-pointer">
            <div className="relative">
              <CustomImage
                src={`${data?.account?.avatar_url?.url || ''}`}
                imageClassName="object-cover rounded-full w-[120px] h-[120px]"
              />

              <PenIconSolid className="absolute bottom-0 right-0 text-primary" />
            </div>
          </label>
        </div>
        <div className="w-full">
          <p className="text-lg font-bold mb-12">
            {data?.account?.business_operation_name || data?.account?.partner_name}
          </p>

          <div className="flex items-center gap-12 mb-12">
            <TelePhoneIcon className="font-medium text-base" />
            <p className="text-md font-medium">{data?.account?.phone}</p>
          </div>

          <div className="flex items-center gap-12 mb-12">
            <EmailIcon className="font-medium text-base" />
            <p className="text-md font-medium">{data?.account?.email}</p>
          </div>
        </div>
      </div>

      <div>
        <form onSubmit={handleSubmit(handleEditUser)}>
          <p className="text-lg text-text-color mb-18 font-bold capitalize">Thông tin nhà thuốc</p>

          <div className="mb-18 flex flex-wrap flex-col md:flex-row gap-18">
            <div className="flex-1">
              <InputField
                control={control}
                name="businessName"
                label="Tên Cơ sở kinh doanh"
                type="text"
                defaultValue={data?.account?.business_operation_name || ''}
                required
              />
            </div>

            <div className="flex-1">
              <InputField
                control={control}
                name="businessOwner"
                label="Tên chủ sở hữu"
                type="text"
                defaultValue={data?.account?.business_operation_owner || ''}
                required
              />
            </div>
          </div>

          <div className="mb-18 flex flex-wrap flex-col md:flex-row gap-18">
            <div className="flex-1">
              <InputField
                control={control}
                name="businessPhone"
                type="text"
                label="Số điện thoại doanh nghiệp"
                defaultValue={data?.account?.business_phone || ''}
                required
              />
            </div>

            <div className="flex-1">
              <InputField
                control={control}
                name="email"
                label="Email"
                type="text"
                defaultValue={data?.account?.email || ''}
              />
            </div>
          </div>

          <div className="mb-18 flex flex-wrap flex-col md:flex-row gap-18">
            <div className="flex-1">
              <InputDate
                control={control}
                name="dateOfBirth"
                label="Ngày tháng năm sinh"
                defaultValue={moment(data?.account?.date_of_birth).format('YYYY-MM-DD') || ''}
              />
            </div>

            <div className="flex-1">
              <InputDate
                control={control}
                name="establishDate"
                label="Ngày thành lập"
                defaultValue={moment(data?.account?.establish_date).format('YYYY-MM-DD') || ''}
              />
            </div>
          </div>

          <div className="mb-18">
            <p className="text-lg text-text-color mb-18 font-bold capitalize">Địa chỉ</p>
            <AddressPicker
              className="mb-12"
              onSubmit={(data: AddressPickerRes) => handleSelectAddress(data)}
              defaultValue={
                isAddressNameValid(
                  data?.account?.province_id?.province_name,
                  data?.account?.district_id?.district_name,
                  data?.account?.ward_id?.ward_name
                )
                  ? `${data?.account?.ward_id?.ward_name} ${
                      data?.account?.district_id?.district_name
                    } ${data?.account?.province_id?.province_name} `
                  : undefined
              }
            />

            <TextareaField
              control={control}
              name="addressDetail"
              placeholder="Địa chỉ chi tiết"
              label="Địa chỉ cụ thể"
              defaultValue={data?.account?.full_address}
            />
          </div>

          <div className="flex-center">
            <Button
              title="Cập nhật thông tin"
              className={`rounded-full bg-primary py-12 px-24 ${
                isValid ? '' : 'opacity-50 cursor-default'
              }`}
              textClassName={`text-base text-white`}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
