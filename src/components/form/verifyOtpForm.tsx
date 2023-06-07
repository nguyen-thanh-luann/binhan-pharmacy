import { useAuth, useChatAccount, useGuest, useUser } from '@/hooks'
import { userAPI } from '@/services'
import { setBackdropVisible } from '@/store'
import { VERIFY_OTP_TYPE } from '@/types'
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
  const { guestInfo } = useGuest()
  const deviceCode = guestInfo?.device_code || ''
  const { loginPhoneNumber } = useAuth()
  const { updateUser, addGuestCartToShoppingCart, mutateAccountData, userInfo } = useUser({})
  const { autoSignupChatServer } = useChatAccount()
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

  const handleGenerateOTP = async (phoneNumber: string) => {
    if (!phoneNumber) return

    setPhoneNumber(phoneNumber)

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
        `+84${phoneNumber.slice(1)}`,
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

    //tài khoản tồn tại:
    //+ type !== UserMedicineAccountType -> login => update 'usermedicine'
    //+ type === UserMedicinAccountType -> login

    //tài khoản k tồn tại:
    //login => update 'usermedicine'

    checkAccountExist(
      phoneNumber,
      // account exist handler
      () => {
        if (type === 'login') {
          if (
            userInfo?.account?.medicine_account_type === 'drugstore_account' ||
            userInfo?.account?.medicine_account_type === 'patient_account'
          ) {
            directLogin(otpInput)
          } else {
            loginAndUpdateMedicineType(otpInput)
          }
        }
      },
      // account not exist handler (signup and update accounttype as patient_account)
      () => {
        if (type === 'login') {
          loginAndUpdateMedicineType(otpInput)
        }
      }
    )
  }

  const directLogin = (otpInput: string) => {
    loginPhoneNumber({
      otpInput,
      handleSuccess: () => {
        mutateAccountData()
        // merge cart data of guest to user's cart
        addGuestCartToShoppingCart(deviceCode)
        autoSignupChatServer()
        router.push('/')
      },
    })
  }

  const loginAndUpdateMedicineType = (otpInput: string) => {
    loginPhoneNumber({
      otpInput,
      handleSuccess: () => {
        updateUser(
          {
            medicine_account_type: 'patient_account',
          },
          () => {
            mutateAccountData()
            // merge cart data of guest to user's cart
            addGuestCartToShoppingCart(deviceCode)
            autoSignupChatServer()
            router.push('/')
          }
        )
      },
    })
  }

  const checkAccountExist = async (
    phone: string,
    onExist?: () => void,
    onNotExist?: () => void
  ) => {
    try {
      const res: any = await userAPI.checkUserAccountExist(phone)
      if (res?.success) {
        onExist?.()
      } else {
        onNotExist?.()
      }
    } catch (err) {
      console.log(err)
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
