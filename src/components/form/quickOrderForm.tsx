import { DrugsIcon, PhotoIcon } from '@/assets'
import { DATA_GENDER, LIMIT_ATTACHMENT } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { useAttachment, useCreateAttachment, useModal, useQuickOrder } from '@/hooks'
import { getAdviceSchema } from '@/schema'
import { selectPreviewImageUrl, setPreviewImageUrl } from '@/store'
import { AddressPickerRes, CreateAttachmentRes, Product, UserAccount } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { ChangeEvent, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { CustomImage } from '../customImage'
import { Divider } from '../divider'
import { ImageShower } from '../imageShower'
import { InputField, RadioField, TextareaField } from '../inputs'
import { ModalSelectData } from '../modal'
import { SelectProductItem } from '../product'
import { AddressPickerV2 } from './addressPickerV2'
import { SelectDrugStoreForm } from './selectDrugStoreForm'
import { SelectProductForm } from './selectProductForm'

interface QuickOrderFormProps {
  className?: string
  type: 'purchase' | 'advice'
}

export const QuickOrderForm = ({ className, type = 'purchase' }: QuickOrderFormProps) => {
  const dispatch = useDispatch()
  const { createQuickOrder } = useQuickOrder()
  const addressPickerRef = useRef<any>(null)
  const { getBase64Images } = useAttachment({ limit: LIMIT_ATTACHMENT })
  const { createAttachment, isLoading: isLoadAttachment } = useCreateAttachment()
  
  const previewImageUrl = useSelector(selectPreviewImageUrl)

  const [prescriptionPhotos, setPrescriptionPhotos] = useState<CreateAttachmentRes[]>()
  const [productSelected, setProductSelected] = useState<Product[]>([])

  const {
    visible: showSelectStore,
    openModal: openSelectStore,
    closeModal: closeSelectStore,
  } = useModal()

  const {
    visible: showSelectProduct,
    openModal: openSelectProduct,
    closeModal: closeSelectProduct,
  } = useModal()

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

  const hanldeUnselectProduct = (product: Product) => {
    const index = productSelected?.findIndex((p) => p.product_id === product?.product_id)

    if (index !== -1) {
      setProductSelected([...productSelected.filter((p) => p.product_id !== product.product_id)])
    }
  }

  const handleUploadPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files) return

    getBase64Images(e.target.files, (images) => {
      if (!images?.[0]) return

      createAttachment({
        file: images?.[0].replace(/^data:image\/\w+;base64,/, ''),
        onSuccess(res: CreateAttachmentRes[]) {
          setPrescriptionPhotos([...((prescriptionPhotos as any) || []), res?.[0]])
        },
      })
    })
  }

  const handleDeletePhoto = (photo: CreateAttachmentRes) => {
    if (!prescriptionPhotos) return

    setPrescriptionPhotos([...prescriptionPhotos?.filter((p) => p.id !== photo.id)])
  }

  const getOrderProductsData = (data: Product[]) => {
    if (!data) return []

    return data?.map((product) => ({
      product_id: product.product_id,
      product_uom: product?.uom_id?.uom_id,
      quantity: product?.quantity,
      price_unit: product?.price_unit,
    }))
  }

  const getOrderPrescriptionPhotos = (photos: CreateAttachmentRes[] | undefined): number[] => {
    if (!photos) return []

    return photos?.map((photo) => photo.id)
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
      note: '',
    })
    addressPickerRef.current?.resetData()
    setPrescriptionPhotos([])
    setProductSelected([])
  }

  const handleSubmitForm = (data: any) => {
    if (!isValid || !data) return

    createQuickOrder(
      {
        has_medicine_order: isArrayHasValue(prescriptionPhotos),
        request_type: type,
        contact_name: data?.name,
        drugstore_id: data?.drugstore_id?.value,
        phone: data?.phone,
        province_id: data?.state?.value,
        district_id: data?.district?.value,
        ward_id: data?.ward?.value,
        note: data?.note,
        gender: data?.gender,
        medical_order_image_url: getOrderPrescriptionPhotos(prescriptionPhotos),
        order_line: getOrderProductsData(productSelected),
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
        <div className=" mb-18 flex flex-wrap flex-col md:flex-row gap-24 border border-dotted items-center rounded-md p-12">
          <div
            className="md:flex-1 flex-start md:flex-center flex- flex-row md:flex-col cursor-pointer w-full"
            onClick={openSelectProduct}
          >
            <DrugsIcon className="w-[40px] h-[40px] md:w-[96px] md:h-[96px] md:mb-8 text-gray" />
            <p className="text-base md:bg-primary font-bold md:text-white rounded-full p-4 px-12 cursor-pointer active:opacity-50 duration-200 line-clamp-1">
              Chọn theo tên
            </p>
          </div>

          <Divider className="hidden md:block md:h-[100px]" />

          <div className="md:hidden block min-w-[132px] w-[80%] h-[1px] border border-t border-gray-300"></div>

          <div className="md:flex-1 w-full">
            <input
              onChange={(e) => handleUploadPhoto(e)}
              hidden
              type="file"
              name="prescriptionPhotos"
              multiple
              id="prescriptionPhotos"
              accept="image/*"
            />
            <label
              htmlFor="prescriptionPhotos"
              className="flex-start md:flex-center flex- flex-row md:flex-col cursor-pointer w-full"
            >
              <PhotoIcon className="w-[40px] h-[40px] md:w-[96px] md:h-[96px] md:mb-8 text-gray" />
              <p className="text-base md:bg-primary font-bold md:text-white rounded-full p-4 px-12 cursor-pointer active:opacity-50 duration-200 line-clamp-1">
                Gửi ảnh chụp sản phẩm, đơn hàng cần mua
              </p>
            </label>
          </div>
        </div>

        {isArrayHasValue(prescriptionPhotos) || isLoadAttachment ? (
          <div className="max-h-[400px] overflow-scroll scrollbar-hide mb-12 border p-8 rounded-md border-gray-200">
            <p className="mb-12 text-md font-bold">Ảnh chụp đơn thuốc</p>

            {isLoadAttachment ? (
              <div className="flex items-center gap-12 animate-pulse rounded-md bg-white mb-12">
                <div className="rounded-md w-[45px] h-[45px] bg-gray-300"></div>
                <div className="w-full mb-12 h-[20px] rounded-md bg-gray-300"></div>
              </div>
            ) : null}

            {prescriptionPhotos?.map((photo, index) => (
              <div
                key={index}
                className="rounded-md p-8 border border-gray-200 flex-between mb-12 last:mb-0"
              >
                <CustomImage
                  onClick={() => {
                    dispatch(setPreviewImageUrl(photo?.url || ''))
                  }}
                  src={photo?.url || ''}
                  className="flex-1 cursor-pointer"
                  imageClassName="w-[45px] h-[45px] object-cover rounded-md"
                />

                <div className="flex-center">
                  <p
                    onClick={() => {
                      dispatch(setPreviewImageUrl(photo?.url || ''))
                    }}
                    className="text-base text-primary cursor-pointer font-bold"
                  >
                    Xem ảnh
                  </p>
                  <Divider />
                  <p
                    onClick={() => handleDeletePhoto(photo)}
                    className="text-base text-primary cursor-pointer font-bold"
                  >
                    Xóa
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isArrayHasValue(productSelected) ? (
          <div className="max-h-[400px] overflow-scroll scrollbar-hide mb-12 border p-8 rounded-md border-gray-200">
            <p className="mb-12 text-md font-bold">Sản phẩm đã chọn</p>

            {productSelected?.map((product) => (
              <SelectProductItem
                product={product}
                key={product.product_id}
                type="unSelect"
                className="mb-12 last:mb-0"
                onClick={(product) => hanldeUnselectProduct(product)}
              />
            ))}
          </div>
        ) : null}

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

      {/* modal select store */}
      <ModalSelectData visible={showSelectStore} modalClassName="">
        <SelectDrugStoreForm
          onClose={closeSelectStore}
          onSelect={(data) => handleSelectStore(data)}
        />
      </ModalSelectData>

      {/* modal select product */}
      <ModalSelectData visible={showSelectProduct} modalClassName="">
        <SelectProductForm
          onClose={closeSelectProduct}
          onSubmit={(data) => {
            setProductSelected(data)
          }}
          defaultProductSelected={productSelected}
        />
      </ModalSelectData>

      {previewImageUrl ? <ImageShower url={previewImageUrl} /> : null}
    </div>
  )
}
