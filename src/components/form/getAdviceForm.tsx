import { DATA_GENDER } from '@/constants'
import { useModal, useQuickOrder } from '@/hooks'
import { getAdviceSchema } from '@/schema'
import { AddressPickerRes, UserAccount } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { InputField, RadioField, TextareaField } from '../inputs'
import { Modal } from '../modal'
import { AddressPickerV2 } from './addressPickerV2'
import { SelectDrugStoreForm } from './selectDrugStoreForm'

interface GetAdviceFormProps {
  className?: string
}

// =================NOTE=========================
// MR.Thanh change request => dont use this component anymore

export const GetAdviceForm = ({ className }: GetAdviceFormProps) => {
  const { createQuickOrder } = useQuickOrder()

  const addressPickerRef = useRef<any>(null)

  const {
    control,
    handleSubmit,
    formState: { isValid },
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(getAdviceSchema),
    mode: 'all',
  })

  const {
    visible: showSelectStore,
    openModal: openSelectStore,
    closeModal: closeSelectStore,
  } = useModal()

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

  const handleSelectStore = (store: UserAccount) => {
    setValue('drugstore_id', {
      label: store?.partner_name,
      value: store?.partner_id,
    })
  }

  const resetForm = () => {
    reset({
      name: '',
      phone: '',
      gender: 'male',
      drugstore_id: {
        label: ' ',
        value: 0,
      },
      addressDetail: '',
    })
    addressPickerRef.current?.resetData()
  }

  const handleSubmitForm = (data: any) => {
    if (!isValid || !data) return

    createQuickOrder(
      {
        has_medicine_order: false,
        request_type: 'advice',
        contact_name: data?.name,
        drugstore_id: data?.drugstore_id?.value,
        phone: data?.phone,
        province_id: data?.state?.value,
        district_id: data?.district?.value,
        ward_id: data?.ward?.value,
        note: data?.note,
        gender: data?.gender,
      },
      () => {
        toast.success('Gửi yêu cầu tư vấn thành công!')
        resetForm()
      }
    )
  }

  return (
    <div className={twMerge(classNames(`px-12 md:px-24`, className))}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="mb-18 flex flex-wrap flex-col md:flex-row gap-24">
          <div className="flex-1">
            <InputField
              control={control}
              name="name"
              type="text"
              label={`Họ và tên`}
              placeholder={`Họ và tên`}
              inputClassName="p-12"
              labelClassName="!text-lg !font-bold"
              required
            />
          </div>

          <div className="flex-1">
            <InputField
              control={control}
              name="phone"
              type="text"
              label={`Số điện thoại`}
              placeholder={`số điện thoại`}
              labelClassName="!text-lg !font-bold"
              inputClassName="p-12"
              required
            />
          </div>
        </div>

        <div className="mb-18 flex flex-wrap flex-col md:flex-row gap-24">
          <div className="flex-1">
            <label className="text-lg font-bold">Giới tính</label>

            <div className="mt-8">
              <RadioField
                data={DATA_GENDER}
                control={control}
                defaultValue={'male'}
                name="gender"
              />
            </div>
          </div>
          <div className="flex-1"></div>
        </div>

        <div className="mb-18 flex flex-wrap flex-col md:flex-row gap-24">
          <div className="flex-1">
            <InputField
              control={control}
              name="drugstore_id"
              type="text"
              label={`Nhà thuốc`}
              placeholder={`Chọn nhà thuốc`}
              labelClassName="!text-lg !font-bold"
              inputClassName="p-12"
              readOnly
              onClick={openSelectStore}
              value={getValues('drugstore_id.label')}
            />
          </div>
          <div className="flex-1"></div>
        </div>

        <div className="mb-24">
          <label className="capitalize text-lg font-bold mb-24">Địa chỉ nhận hàng</label>
          <div className="my-12">
            <AddressPickerV2
              ref={addressPickerRef}
              onSubmit={(data: AddressPickerRes) => handleSelectAddress(data)}
            />
          </div>

          <div>
            <TextareaField
              control={control}
              name="note"
              placeholder="Nhập nội dung ghi chú của bạn"
            />
          </div>
        </div>

        <Button
          type="submit"
          title="Gửi thông tin"
          className={`py-8 w-[50%] mx-auto bg-primary rounded-[10px] mb-24 ${
            isValid ? '' : 'opacity-25 cursor-default'
          }`}
          textClassName="text-white"
        />
      </form>

      <Modal
        visible={showSelectStore}
        animationType="fade"
        headerClassName="hidden"
        modalClassName="h-fit max-h-[450px] w-[500px] max-w-[90%] rounded-[10px] overflow-scroll scrollbar-hide"
      >
        <SelectDrugStoreForm
          onClose={closeSelectStore}
          onSelect={(data) => handleSelectStore(data)}
        />
      </Modal>
    </div>
  )
}
