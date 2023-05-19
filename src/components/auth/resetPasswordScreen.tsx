import { setAuthOption, setBackdropVisible } from '@/store'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { PhoneForm } from '../form'
import { OtpForm } from '../form/otpForm'
import { AuthScreen } from './authScreen'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createPasswordSchema } from '@/schema'
import { Button } from '../button'
import { PasswordField } from '../inputs'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { authentication } from '@/utils'
import { useAuth } from '@/hooks'
import { toast } from 'react-hot-toast'

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
  const { resetPassword } = useAuth()
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
        dispatch(setAuthOption('loginPassword'))
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
                  <PasswordField control={control} name="newPassword" label="Mật khẩu mới" />
                </div>

                <div className="mb-12">
                  <PasswordField
                    control={control}
                    name="reNewPassword"
                    label="Nhập lại Mật khẩu mới"
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
