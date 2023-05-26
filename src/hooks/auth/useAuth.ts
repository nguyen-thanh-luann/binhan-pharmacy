import { SWR_KEY } from '@/constants'
import { userAPI } from '@/services'
import { RootState, resetChatState, resetOrderData, setBackdropVisible } from '@/store'
import {
  GenerateChatTokenParams,
  LoginFormParams,
  LoginRes,
  UseAuthResetPasswordParams,
  UseParams,
  otpProps,
} from '@/types'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useSWRConfig } from 'swr'
import { useAsync } from '../common/useAsync'

export const useAuth = () => {
  const { asyncHandler } = useAsync()
  const { mutate: swrConfigMutate } = useSWRConfig()
  const dispatch = useDispatch()

  const socket: any = useSelector((state: RootState) => state.chat.socket)

  const loginWithPassword = async (_params: UseParams<LoginFormParams, LoginRes>) => {
    const { onSuccess, params, onError } = _params
    asyncHandler({
      fetcher: userAPI.login(params),
      onSuccess: (res: LoginRes) => {
        onSuccess?.(res)
        dispatch(resetChatState())
        dispatch(resetOrderData())
      },
      onError,
      config: {
        showSuccessMsg: false,
      },
    })
  }

  const logout = async (cb?: Function) => {
    try {
      const res: any = await userAPI.logout()
      if (res?.result?.code !== 200) return
      cb?.()
      dispatch(resetChatState())
      dispatch(resetOrderData())
      //reset user infomation
      swrConfigMutate(SWR_KEY.get_user_information)
      socket?.disconect()
    } catch (error) {
      console.log(error)
    }
  }

  const loginPhoneNumber = async (props: otpProps) => {
    const { handleSuccess, handleError, otpInput } = props
    dispatch(setBackdropVisible(true))

    try {
      OTPVerifier({
        otpInput,
        handleSuccess: async (firebaseToken) => {
          asyncHandler({
            fetcher: userAPI.loginPhoneNumber({
              firebase_access_token: firebaseToken,
              type: 'firebase',
            }),
            onSuccess: handleSuccess,
            onError: handleError?.(),
            config: {
              showSuccessMsg: false,
            },
          })
        },
        handleError: () => handleError && handleError(),
      })
    } catch (err) {
      console.log(err)
    }
  }

  const resetPassword = async (props: UseAuthResetPasswordParams) => {
    const { handleSuccess, handleError, otpInput, password, re_password } = props
    dispatch(setBackdropVisible(true))

    try {
      OTPVerifier({
        otpInput,
        handleSuccess: async (firebaseToken) => {
          asyncHandler({
            fetcher: userAPI.resetPassword({
              firebase_access_token: firebaseToken,
              password,
              re_password,
            }),
            onSuccess: handleSuccess,
            onError: handleError?.(),
            config: {
              showSuccessMsg: false,
            },
          })
        },
        handleError: () => handleError && handleError(),
      })
    } catch (err) {
      console.log(err)
    }
  }

  const OTPVerifier = async (props: otpProps) => {
    const { otpInput, handleSuccess, handleError } = props
    const confirmationResult = window.confirmationResult
    dispatch(setBackdropVisible(true))

    try {
      const responseToken = await confirmationResult.confirm(otpInput)
      const firebaseToken = responseToken?._tokenResponse?.idToken
      dispatch(setBackdropVisible(false))

      if (firebaseToken) {
        handleSuccess(firebaseToken)
      } else {
        toast.error('Vui lòng nhập đúng mã OTP')
      }
    } catch (error) {
      dispatch(setBackdropVisible(false))
      handleError && handleError()
      toast.error('Vui lòng nhập đúng mã OTP')
    }
  }

  const generateChatToken = async ({
    onError,
    onSuccess,
    token: _token,
  }: GenerateChatTokenParams) => {
    if (!_token) return
    // console.log('generateChatToken req: ', _token)

    try {
      const res: any = await userAPI.generateChatToken({
        token: _token,
      })

      if (res?.result?.success) {
        onSuccess?.(res?.result?.data)
      } else {
        onError?.()
      }
    } catch (error) {
      onError?.()
    }
  }

  return {
    loginWithPassword,
    logout,
    loginPhoneNumber,
    generateChatToken,
    resetPassword,
  }
}
