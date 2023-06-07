import { useAuth, useChatAccount, useGuest, useUser } from '@/hooks'
import { setAuthOption } from '@/store'
import { LoginFormParams } from '@/types'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { LoginForm } from '../form'
import { AuthScreen } from './authScreen'

interface LoginPasswordScreenProps {
  onClose?: () => void
  showCloseButton?: boolean
}

export const LoginPasswordScreen = ({
  onClose,
  showCloseButton = true,
}: LoginPasswordScreenProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { guestInfo } = useGuest()
  const deviceCode = guestInfo?.device_code || ''
  const { addGuestCartToShoppingCart, mutateAccountData } = useUser({})
  const { loginWithPassword } = useAuth()
  const { autoSignupChatServer } = useChatAccount()

  const handleLogin = (data: LoginFormParams) => {
    loginWithPassword({
      params: data,

      onSuccess: () => {
        onClose?.()
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
        footerOption="signup"
        title="Xin Chào!"
        subTitle="Chào bạn, vui lòng đăng nhập để tiếp tục"
        onClose={() => onClose?.()}
        showCloseButton={showCloseButton}
      >
        <div className="px-24">
          <LoginForm
            className=""
            firstOption={
              <div
                onClick={() => {
                  dispatch(setAuthOption('loginOTP'))
                }}
                className="text !text-primary cursor-pointer"
              >
                Đăng nhập bằng OTP
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
            onSubmit={(data) => handleLogin(data)}
          />
        </div>
      </AuthScreen>
    </>
  )
}
