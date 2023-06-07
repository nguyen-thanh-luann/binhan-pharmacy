import { useAuth, useChatAccount, useGuest, useUser } from '@/hooks'
import { createPasswordSchema } from '@/schema'
import { setAuthOption, setBackdropVisible } from '@/store'
import { authentication } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Button } from '../button'
import { PhoneForm } from '../form'
import { OtpForm } from '../form/otpForm'
import { PasswordField } from '../inputs'
import { AuthScreen } from './authScreen'

declare global {
  interface Window {
    recaptchaVerifier: any
    confirmationResult: any
  }
}

interface ResetPasswordScreenProps {
  onClose?: () => void
}

export const ResetPasswordScreen = ({ onClose }: ResetPasswordScreenProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { guestInfo } = useGuest()
  const deviceCode = guestInfo?.device_code || ''
  const { resetPassword } = useAuth()
  const { addGuestCartToShoppingCart, mutateAccountData } = useUser({})
  const { autoSignupChatServer } = useChatAccount()

  const [phoneNumber, setPhoneNumber] = useState<string>()
  const [verify, setVerify] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { isValid },
    getValues,
  } = useForm({
    resolver: yupResolver(createPasswordSchema),
    mode: 'all',
  })

  const handlePhoneSubmit = (data: any) => {
    setPhoneNumber(data)
  }

  const handlePasswordSubmit = () => {
    if (phoneNumber) {
      handleGenerateOTP(phoneNumber)
      setVerify(true)
    }
  }

  const handleGenerateOTP = async (phone: string) => {
    if (!phone) return

    setPhoneNumber(phone)

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
    } catch (error) {
      console.log(error)
      dispatch(setBackdropVisible(false))
      generateRecaptcha()
    }
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

  const handleVerifyOTP = async (otpInput: string) => {
    resetPassword({
      otpInput,
      password: getValues('newPassword'),
      re_password: getValues('reNewPassword'),
      handleSuccess: () => {
        toast.success('Thay đổi mật khẩu thành công!')
        mutateAccountData()
        // merge cart data of guest to user's cart
        addGuestCartToShoppingCart(deviceCode)
        autoSignupChatServer()
        router.push('/')
      },
    })
  }

  return (
    <>
      <AuthScreen
        title={phoneNumber ? 'Nhập mã OTP' : 'Quên mật khẩu'}
        titleClassName={phoneNumber ? 'text-center' : ''}
        subTitle={phoneNumber ? undefined : 'Chào bạn, vui lòng nhập số điện thoại để tiếp tục'}
        onBack={() => {
          phoneNumber ? setPhoneNumber(undefined) : dispatch(setAuthOption('loginPassword'))
        }}
        onClose={() => onClose?.()}
        footerOption={phoneNumber ? undefined : 'signup'}
      >
        <div className="px-24">
          {verify && phoneNumber ? (
            <OtpForm
              phoneNumber={phoneNumber}
              reGenerateRecaptcha={() => handleGenerateOTP(phoneNumber)}
              onSubmit={(val) => handleVerifyOTP(val)}
            />
          ) : phoneNumber ? (
            <div>
              <form onSubmit={handleSubmit(handlePasswordSubmit)}>
                <div className="mb-12">
                  <PasswordField
                    control={control}
                    name="newPassword"
                    label="Mật khẩu mới"
                    inputClassName="rounded-[10px] p-[12px]"
                  />
                </div>

                <div className="mb-12">
                  <PasswordField
                    control={control}
                    name="reNewPassword"
                    label="Nhập lại Mật khẩu mới"
                    inputClassName="rounded-[10px]"
                  />
                </div>

                <Button
                  type="submit"
                  title={'Xác nhận'}
                  className={`bg-primary w-full py-8 ${isValid ? '' : 'opacity-50 cursor-default'}`}
                  textClassName="text-white font-bold"
                />
              </form>
            </div>
          ) : (
            <PhoneForm onSubmit={handlePhoneSubmit} label="Số điện thoại" className="mb-24" />
          )}
        </div>
        <div id="recaptcha-container"></div>
      </AuthScreen>
    </>
  )
}
