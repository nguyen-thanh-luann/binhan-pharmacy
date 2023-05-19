import { loginSchema } from '@/schema'
import { LoginFormParams } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { InputField, PasswordField } from '../inputs'

interface LoginFormProps {
  className?: string
  firstOption?: ReactNode
  secondOption?: ReactNode
  onSubmit?: (data: LoginFormParams) => void
}

export const LoginForm = ({ className, firstOption, secondOption, onSubmit }: LoginFormProps) => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'all',
  })

  const handleLogin = async (data: any) => {
    onSubmit?.(data)
  }

  return (
    <div className={twMerge(classNames('', className))}>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="mb-12">
          <InputField
            control={control}
            name="phone"
            type="text"
            placeholder={`Số điện thoại`}
            label="Số điện thoại"
            inputClassName="rounded-[10px] p-[12px]"
          />
        </div>

        <div className="mb-12">
          <PasswordField
            control={control}
            name="password"
            placeholder={`Mật khẩu`}
            label="Mật khẩu"
            inputClassName="rounded-[10px]"
          />
        </div>

        {firstOption || secondOption ? (
          <div className="mb-24 flex items-center justify-between">
            {firstOption}

            {secondOption}
          </div>
        ) : null}

        <Button
          type="submit"
          title={`Đăng nhập`}
          className={`w-full bg-primary mb-12 p-10 rounded-[10px]`}
          textClassName={`title !text-white`}
        />
      </form>
    </div>
  )
}
