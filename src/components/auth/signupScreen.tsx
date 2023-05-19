import { setAuthOption } from '@/store'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { PhoneForm } from '../form'
import { OtpForm } from '../form/otpForm'
import { AuthScreen } from './authScreen'

interface SignupScreenProps {
  onClose?: () => void
}

export const SignupScreen = ({ onClose }: SignupScreenProps) => {
  const dispatch = useDispatch()
  const [phoneNumber, setPhoneNumber] = useState<string>()

  const handlePhoneSubmit = (data: any) => {
    setPhoneNumber(data)
  }

  return (
    <>
      <AuthScreen
        title={phoneNumber ? 'Nhập mã OTP' : 'Đăng ký!'}
        titleClassName={phoneNumber ? 'text-center' : ''}
        subTitle={phoneNumber ? undefined : 'Bạn chưa có tài khoản? hãy đăng kí ngay!'}
        onBack={() => {
          phoneNumber ? setPhoneNumber(undefined) : dispatch(setAuthOption('loginPassword'))
        }}
        onClose={() => onClose?.()}
        footerOption={phoneNumber ? undefined : 'login'}
      >
        <div className="px-24">
          {phoneNumber ? (
            <OtpForm phoneNumber={phoneNumber} reGenerateRecaptcha={() => {}} onSubmit={() => {}} />
          ) : (
            <PhoneForm
              onSubmit={handlePhoneSubmit}
              label="Số điện thoại"
              className="mb-24"
              firstOption={
                <div
                  onClick={() => {
                    dispatch(setAuthOption('loginOTP'))
                  }}
                  className="text_md !text-primary cursor-pointer"
                >
                  Đăng nhập bằng OTP
                </div>
              }
              secondOption={
                <div
                  onClick={() => {
                    dispatch(setAuthOption('resetPassword'))
                  }}
                  className="text_md !text-primary cursor-pointer"
                >
                  Quên mật khẩu?
                </div>
              }
            />
          )}
        </div>
      </AuthScreen>
    </>
  )
}
