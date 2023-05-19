import { setAuthOption } from '@/store'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { VerifyOtpForm } from '../form'
import { AuthScreen } from './authScreen'

interface LoginOTPScreenProps {
  onClose?: () => void
}

export const LoginOTPScreen = ({ onClose }: LoginOTPScreenProps) => {
  const dispatch = useDispatch()
  const [phoneNumber, setPhoneNumber] = useState<string>()

  // const handlePhoneSubmit = (data: any) => {
  //   setPhoneNumber(data)
  // }

  return (
    <>
      <AuthScreen
        title={phoneNumber ? 'Nhập mã OTP' : 'Đăng nhập OTP'}
        titleClassName={phoneNumber ? 'text-center' : ''}
        subTitle={phoneNumber ? undefined : 'Chào bạn, vui lòng nhập số điện thoại để tiếp tục'}
        onBack={() => {
          phoneNumber ? setPhoneNumber(undefined) : dispatch(setAuthOption('loginPassword'))
        }}
        onClose={() => onClose?.()}
        footerOption={phoneNumber ? undefined : 'signup'}
      >
        <div className="px-24">
          <VerifyOtpForm
            type="login"
            firstOption={
              <div
                onClick={() => {
                  dispatch(setAuthOption('loginPassword'))
                }}
                className="text !text-primary cursor-pointer"
              >
                Đăng nhập bằng tài khoản
              </div>
            }
            secondOption={
              <div
                onClick={() => {
                  dispatch(setAuthOption('resetPassword'))
                }}
                className="text !text-primary cursor-pointer"
              >
                Quên mật khẩu?
              </div>
            }
          />
        </div>
      </AuthScreen>
    </>
  )
}
