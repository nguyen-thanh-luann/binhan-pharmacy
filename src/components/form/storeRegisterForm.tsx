import { PhotoIcon } from '@/assets'
import { LIMIT_ATTACHMENT, STORE_TYPE } from '@/constants'
import {
  useAttachment,
  useAuth,
  useChatAccount,
  useCreateAttachment,
  useGuest,
  useModal,
  useUser,
} from '@/hooks'
import { storeRegisterSchema } from '@/schema'
import { userAPI } from '@/services'
import { setBackdropVisible } from '@/store'
import { AddressPickerRes, CreateAttachmentRes } from '@/types'
import { authentication } from '@/utils/firebase'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { CustomImage } from '../customImage'
import { InputDate, InputField, RadioField, TextareaField } from '../inputs'
import { Modal } from '../modal'
import { Spinner } from '../spinner'
import { AddressPicker } from './addressPicker'
import { OtpForm } from './otpForm'

interface StoreRegisterFormProps {
  className?: string
}

declare global {
  interface Window {
    recaptchaVerifier: any
    confirmationResult: any
  }
}

type certificatteTypeImage = 'businessCertificateImage' | 'gppCertificateImage'

export const StoreRegisterForm = ({ className }: StoreRegisterFormProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { guestInfo } = useGuest()
  const deviceCode = guestInfo?.device_code || ''
  const { loginPhoneNumber } = useAuth()
  const { updateUser, addGuestCartToShoppingCart, mutateAccountData } = useUser({})
  const { autoSignupChatServer } = useChatAccount()
  const [formData, setFormData] = useState<any>()

  const { visible: showOtpForm, openModal: setShowOtpForm, closeModal: closeOtpForm } = useModal()

  const {
    control,
    handleSubmit,
    formState: { isValid },
    setValue,
  } = useForm({
    resolver: yupResolver(storeRegisterSchema),
    mode: 'all',
  })

  const { getBase64Images } = useAttachment({ limit: LIMIT_ATTACHMENT })
  const { createAttachment, isLoading: isLoadAttachment } = useCreateAttachment()

  const [businessCerImage, setBusinessCerImage] = useState<CreateAttachmentRes>()
  const [gppCerImage, setGppCerImage] = useState<any>()

  const handleUploadCertificate = (
    e: ChangeEvent<HTMLInputElement>,
    type: certificatteTypeImage
  ) => {
    if (!e?.target?.files || isLoadAttachment) return

    getBase64Images(e.target.files, (images) => {
      if (!images?.[0]) return

      createAttachment({
        file: images?.[0].replace(/^data:image\/\w+;base64,/, ''),
        onSuccess(res: CreateAttachmentRes[]) {
          if (type === 'businessCertificateImage') {
            setValue('businessCertificateImage', res?.[0])
            setBusinessCerImage(res?.[0])
          } else if (type === 'gppCertificateImage') {
            setValue('gppCertificateImage', res?.[0])
            setGppCerImage(res?.[0])
          }
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

  const checkAccountExist = async (
    phone: string,
    onExist?: () => void,
    onNotExist?: () => void,
    onError?: () => void
  ) => {
    try {
      const res: any = await userAPI.checkUserAccountExist(phone)
      if (res?.success) {
        onExist?.()
      } else {
        onNotExist?.()
      }
    } catch (error) {
      onError?.()
      console.log(error)
    }
  }

  const handleGenerateOTP = async (phone: string) => {
    if (!phone) return

    dispatch(setBackdropVisible(true))

    const verify = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
      },
      authentication
    )

    try {
      const confirmationResult = await signInWithPhoneNumber(
        authentication,
        `+84${phone.slice(1)}`,
        verify
      )

      dispatch(setBackdropVisible(false))
      window.confirmationResult = confirmationResult

      setShowOtpForm()
    } catch (error) {
      console.log(error)
      dispatch(setBackdropVisible(false))
      generateRecaptcha()
    }
  }

  const handleVerifyOTP = async (otpInput: string, data: any) => {
    checkAccountExist(
      data?.phone,
      // account exist handler
      () => {
        toast.error('Số điện thoại đã tồn tại!')
        closeOtpForm()
      },
      // account not exist handler (signup and update accounttype as patient_account)
      () => {
        loginPhoneNumber({
          otpInput,
          handleSuccess: () => {
            updateUser(
              {
                partner_name: data?.name,
                email: data?.email,
                province_id: data?.state?.value,
                district_id: data?.district?.value,
                ward_id: data?.ward?.value,
                street: data?.addressDetail,
                medicine_account_type: 'drugstore_account',
                business_type: data?.storeType,
                gpp_certification_image_url: data?.gppCertificateImage?.id,
                business_registration_certification_image_url: data?.businessCertificateImage?.id,
                business_operation_name: data?.business_name,
                business_operation_owner: data?.business_owner,
                business_phone: data?.business_phone,
                establish_date: data?.establish_date,
              },
              () => {
                autoSignupChatServer('npp')
                // merge cart data of guest to user's cart
                mutateAccountData()
                addGuestCartToShoppingCart(deviceCode)
                router.push('/')
              }
            )
          },
        })
      },
      () => {
        toast.error('Có lỗi xảy ra!')
        closeOtpForm()
      }
    )
  }

  const generateRecaptcha = () => {
    return new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
      },
      authentication
    )
  }

  const handleSubmitForm = (data: any) => {
    if (!isValid) return

    setFormData(data)

    handleGenerateOTP(data?.phone)
  }

  const hanldeOnEnterPhoneNumber = (phoneNumber: string) => {
    checkAccountExist(phoneNumber, () => {
      toast.error('Số điện thoại đã được đăng kí')
      return
    })
  }

  return (
    <div className={twMerge(classNames(``, className))}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="mb-18 flex flex-wrap flex-col md:flex-row gap-24">
          <div className="flex-1">
            <InputField
              control={control}
              name="name"
              type="text"
              label={`Tên đăng nhập`}
              placeholder={`Họ và tên`}
              inputClassName="p-12"
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
              inputClassName="p-12"
              required
              onBlur={(e) => {
                hanldeOnEnterPhoneNumber(e.target.value)
              }}
            />
          </div>
        </div>

        <div className="mb-18 flex flex-wrap flex-col md:flex-row gap-24">
          <div className="flex-1">
            <InputField
              control={control}
              name="business_owner"
              type="text"
              label={`Tên chủ sở hữu`}
              placeholder={`Họ và tên`}
              inputClassName="p-12"
            />
          </div>
          <div className="flex-1">
            <InputField
              control={control}
              name="email"
              type="text"
              label={`Email`}
              placeholder={`email`}
              inputClassName="p-12"
            />
          </div>
        </div>

        <div className="mb-18 flex flex-wrap flex-col md:flex-row gap-24">
          <div className="flex-1">
            <InputField
              control={control}
              name="business_name"
              type="text"
              label={`Tên Cơ sở kinh doanh`}
              placeholder={`Tên cơ sở`}
              inputClassName="p-12"
            />
          </div>
          <div className="flex-1">
            <InputField
              control={control}
              name="business_phone"
              type="text"
              label={`Số điện thoại doanh nghiệp`}
              placeholder={`Số điện thoại`}
              inputClassName="p-12"
            />
          </div>
        </div>

        <div className="mb-18 flex flex-wrap flex-col md:flex-row gap-24">
          <div className="flex-1">
            <InputDate
              control={control}
              name="establish_date"
              label={`Ngày thành lập`}
              placeholder={``}
              inputClassName="p-12"
            />
          </div>

          <div className="flex-1"></div>
        </div>

        <p className="text-lg font-bold text-primary mb-24">
          Lưu ý:{' '}
          <span className="text-md text-text-color font-medium">
            Để đảm bảo quyền lợi, chúng tôi cần xác thực để cấp tài khoản. Quý khách vui lòng cung
            cấp đầy đủ thông tin.
          </span>
        </p>

        <label className="capitalize text-lg font-bold">Công việc hiện tại</label>
        <div className="mb-24 mt-12">
          <RadioField
            data={STORE_TYPE}
            control={control}
            defaultValue={STORE_TYPE[0]?.value}
            name="storeType"
          />
        </div>

        <div className="mb-24">
          <label className="capitalize text-lg font-bold mb-24">Địa chỉ</label>
          <div className="my-12">
            <AddressPicker onSubmit={(data: AddressPickerRes) => handleSelectAddress(data)} />
          </div>

          <div>
            <TextareaField control={control} name="addressDetail" placeholder="Địa chỉ chi tiết" />
          </div>
        </div>

        <div className="mb-24">
          <p className="capitalize text-lg font-bold mb-12">Giấy chứng nhận</p>

          <div className="flex gap-24">
            <div>
              <label htmlFor="business-certificatte-image" className="text-md">
                Đăng ký kinh doanh <span className="text-red font-bold">*</span>
              </label>

              <div className="shadow-shadow-1 w-[170px] h-[170px] flex-center p-12">
                <input
                  onChange={(e) => handleUploadCertificate(e, 'businessCertificateImage')}
                  hidden
                  type="file"
                  name="businessCertificateImage"
                  multiple
                  readOnly={isLoadAttachment}
                  id="business-certificatte-image"
                  accept="image/*"
                />
                <label
                  className={classNames(isLoadAttachment ? 'cursor-wait' : 'cursor-pointer')}
                  htmlFor="business-certificatte-image"
                  id="business-certificatte-image"
                >
                  {businessCerImage?.url ? (
                    <div>
                      <CustomImage
                        src={businessCerImage?.url || ''}
                        imageClassName="w-[170px] h-[170px] object-cover"
                      />
                    </div>
                  ) : (
                    <div>
                      <PhotoIcon className="w-90 h-90 text-gray" />
                      <p className="mt-8 text-center text-md">Chọn ảnh</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="gpp-certificatte-image" className="text-md">
                Giấy chứng nhận GPP <span className="text-red font-bold">*</span>
              </label>

              <div className="shadow-shadow-1 w-[170px] h-[170px] flex-center p-12">
                <input
                  onChange={(e) => handleUploadCertificate(e, 'gppCertificateImage')}
                  hidden
                  type="file"
                  name="gppCertificateImage"
                  multiple
                  readOnly={isLoadAttachment}
                  id="gpp-certificatte-image"
                  accept="image/*"
                />
                <label
                  className={classNames(isLoadAttachment ? 'cursor-wait' : 'cursor-pointer')}
                  htmlFor="gpp-certificatte-image"
                  id="gpp-certificatte-image"
                >
                  {gppCerImage?.url ? (
                    <div>
                      <CustomImage
                        src={gppCerImage?.url || ''}
                        imageClassName="w-[170px] h-[170px] object-cover"
                      />
                    </div>
                  ) : (
                    <div>
                      <PhotoIcon className="w-90 h-90 text-gray" />
                      <p className="mt-8 text-center text-md">Chọn ảnh</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {isLoadAttachment && (
            <div className="flex justify-center my-12">
              <Spinner />
            </div>
          )}
        </div>

        <p className="text-lg font-bold text-primary mb-24">
          Lưu ý:{' '}
          <span className="text-md text-text-color font-medium">
            Để quá trình xác minh nhanh chóng, quý khách vui lòng cung cấp đầy đủ giấy tờ, Xin cảm
            ơn!
          </span>
        </p>

        <Button
          type="submit"
          title="Đăng ký"
          className={`py-8 w-[50%] mx-auto bg-primary rounded-[10px] mb-24 ${
            isValid ? '' : 'opacity-25 cursor-default'
          }`}
          textClassName="text-white"
        />
      </form>

      <Modal
        visible={showOtpForm}
        animationType={'fade'}
        headerClassName="hidden"
        modalClassName="p-20 h-fit max-h-[300px] w-[396px] rounded-[10px]"
      >
        <OtpForm
          phoneNumber={formData?.phone || ''}
          reGenerateRecaptcha={() => handleGenerateOTP(formData?.phone)}
          onSubmit={(val) => handleVerifyOTP(val, formData)}
        />
      </Modal>

      <div id="recaptcha-container"></div>
    </div>
  )
}
