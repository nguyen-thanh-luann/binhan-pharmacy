import { setAuthOption } from '@/store'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import { VerifyOtpForm } from '../form'

interface UserRegisterProps {
  className?: string
}

export const UserRegister = ({ className }: UserRegisterProps) => {
  const dispatch = useDispatch()

  return (
    <div className={twMerge(classNames(``, className))}>
      <VerifyOtpForm
        type='login'
        firstOption={<div></div>}
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
    </div>
  )
}
