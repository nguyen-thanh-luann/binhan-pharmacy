import { encodeJWT } from '@/helper'
import { useAuth, useUser } from '@/hooks'
import { authAPI, userAPI } from '@/services'
import { setBackdropVisible } from '@/store'
import { GenerateChatTokenRes, UserInfo, VERIFY_OTP_TYPE } from '@/types'
import { authentication } from '@/utils/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { OtpForm } from './otpForm'
import { PhoneForm } from './phoneForm'

declare global {
  interface Window {
    recaptchaVerifier: any
    confirmationResult: any
  }
}

interface VerifyOtpFormProps {
  type: VERIFY_OTP_TYPE
  firstOption?: ReactNode
  secondOption?: ReactNode
}

export const VerifyOtpForm = ({ firstOption, secondOption, type }: VerifyOtpFormProps) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { loginPhoneNumber, generateChatToken } = useAuth()
  const { getUserInfo, updateUser } = useUser({})
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [otpForm, setOtpForm] = useState<boolean>()

  const generateRecaptcha = () => {
    return new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
      },
      authentication
    )
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

      setOtpForm(true)
    } catch (error) {
      console.log(error)
      dispatch(setBackdropVisible(false))
      generateRecaptcha()
    }
  }

  const handleVerifyOTP = async (otpInput: string) => {
    if (!phoneNumber || phoneNumber === '') {
      toast.error('Vui lòng nhập lại số điện thoại!')
      return
    }

    checkAccountExist(
      phoneNumber,
      // account exist handler
      () => {
        if (type === 'login') {
          loginPhoneNumber({
            otpInput,
            handleSuccess: () => {
              handleGetUserInfo()
              router.push('/')
            },
          })
        }
      },
      // account not exist handler (signup and update accounttype as patient_account)
      () => {
        if (type === 'login') {
          loginPhoneNumber({
            otpInput,
            handleSuccess: () => {
              updateUser(
                {
                  medicine_account_type: 'patient_account',
                },
                () => {
                  handleGetUserInfo()
                  router.push('/')
                }
              )
            },
          })
        }
      }
    )
  }

  const handleGetUserInfo = () => {
    getUserInfo((userInfo) => {
      handleGenerateChatToken(userInfo)
    })
  }

  const handleGenerateChatToken = async (userInfo: UserInfo) => {
    generateChatToken({
      token: encodeJWT({ user_id: userInfo?.account?.partner_id }),
      onSuccess: async (data: GenerateChatTokenRes) => {
        const res: any = await authAPI.setChatToken(data)
        if (res?.result?.success) {
          console.log('set chat token success!')
        }
      },
    })
  }

  const checkAccountExist = async (
    phone: string,
    onExist?: () => void,
    onNotExist?: () => void
  ) => {
    const res: any = await userAPI.checkUserAccountExist(phone)
    if (res?.success) {
      onExist?.()
    } else {
      onNotExist?.()
    }
  }

  return (
    <div>
      {otpForm && phoneNumber ? (
        <OtpForm
          phoneNumber={phoneNumber}
          reGenerateRecaptcha={() => handleGenerateOTP(phoneNumber)}
          onSubmit={(val) => handleVerifyOTP(val)}
        />
      ) : (
        <PhoneForm
          onSubmit={handleGenerateOTP}
          label="Số điện thoại"
          className="mb-24"
          firstOption={firstOption}
          secondOption={secondOption}
        />
      )}

      <div id="recaptcha-container"></div>
    </div>
  )
}
