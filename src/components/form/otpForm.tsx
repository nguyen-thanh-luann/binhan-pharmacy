import { RESEND_OTP_TIMEOUT } from '@/constants'
import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input'
import { Button } from '../button'

interface OtpFormProps {
  phoneNumber: string
  onSubmit: (otpCode: string) => void
  reGenerateRecaptcha: Function
  buttonTitle?: string
}

export const OtpForm = ({
  phoneNumber,
  onSubmit,
  reGenerateRecaptcha,
  buttonTitle,
}: OtpFormProps) => {
  const [otpVal, setOtpVal] = useState<string>('')
  const [secondsExpire, setSecondsExprire] = useState<number>(RESEND_OTP_TIMEOUT)

  useEffect(() => {
    if (secondsExpire === 0) return
    const interval = setInterval(() => {
      setSecondsExprire(secondsExpire - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsExpire])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit && onSubmit(otpVal)
      }}
      className=""
    >
      <div className="form-item">
        <div className="flex-center">
          <label htmlFor="otpInput" className="text">
            Chúng tôi đã gửi mã xác minh đến <b>{phoneNumber}</b>
          </label>
        </div>

        <div className="my-12 flex-center">
          <OtpInput
            shouldAutoFocus
            value={otpVal}
            onChange={(otp: string) => setOtpVal(otp)}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
            containerStyle="flex gap-8"
            inputStyle="border border-gray-200 bg-gray-100 rounded-[8px] !w-[52px] !h-[52px] outline-none text"
          />
        </div>
      </div>

      <div className="mb-24">
        {secondsExpire === 0 ? (
          <div className="flex flex-col items-center">
            <p className="text mb-12">Bạn không nhận được mã?</p>
            <button
              className="!text-primary text"
              onClick={() => {
                setSecondsExprire(RESEND_OTP_TIMEOUT)
                reGenerateRecaptcha && reGenerateRecaptcha()
              }}
            >
              Gửi lại
            </button>
          </div>
        ) : (
          <p className="text text-center">Vui lòng chờ {secondsExpire} giây để gửi lại</p>
        )}
      </div>

      <Button
        type="submit"
        title={buttonTitle || 'Xác nhận'}
        className={`w-full bg-primary mb-12 p-10 rounded-[10px]`}
        textClassName={`title !text-white`}
      />
    </form>
  )
}
