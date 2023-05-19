import { encodeJWT } from '@/helper'
import { useAuth, useGuest, useUser } from '@/hooks'
import { authAPI } from '@/services'
import { setAuthOption } from '@/store'
import { GenerateChatTokenRes, LoginFormParams, UserInfo } from '@/types'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { LoginForm } from '../form'
import { AuthScreen } from './authScreen'
import { useSWRConfig } from 'swr'
import { SWR_KEY } from '@/constants'
import { toast } from 'react-hot-toast'

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
  const { mutate } = useSWRConfig()
  const { getUserInfo, addGuestCartToShoppingCart } = useUser({})
  const { loginWithPassword, generateChatToken } = useAuth()

  const handleLogin = (data: LoginFormParams) => {
    loginWithPassword({
      params: data,
      onSuccess: () => {
        onClose?.()
        mutate(SWR_KEY.get_guest_information)
        addGuestCartToShoppingCart(
          deviceCode,
          () => {
            toast.success('Add guest data success')
          },
          () => {
            toast.error('Add guest data fail')
          }
        )
        handleGetUserInfo()
        router.push('/')
      },
    })
  }

  const handleGetUserInfo = () => {
    getUserInfo((userInfo) => {
      handleGenerateChatToken(userInfo)
    })
  }

  const handleGenerateChatToken = async (userInfo: UserInfo) => {
    generateChatToken({
      token: encodeJWT({ user_id: userInfo.account?.partner_id }),
      onSuccess: async (data: GenerateChatTokenRes) => {
        const res: any = await authAPI.setChatToken(data)
        if (res?.result?.success) {
          console.log('set chat token success!')
        }
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
