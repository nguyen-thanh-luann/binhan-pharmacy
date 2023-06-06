import { useChatAccount, useUser } from '@/hooks'
import { signupPostAdminSchema } from '@/schema'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { Button } from '../button'
import { InputField, PasswordField } from '../inputs'

interface LoginFormProps {
  className?: string
}

export const SignupPostAdminForm = ({ className }: LoginFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(signupPostAdminSchema),
    mode: 'all',
  })

  const { userInfo } = useUser({})
  const { signupNewChatAccount, setChatToken } = useChatAccount()

  const handleLogin = async (data: any) => {
    if (!userInfo || !data) return

    signupNewChatAccount(
      {
        user_id: userInfo?.account?.partner_id || 0,
        password: data.password,
        phone: userInfo?.account?.phone || '',
        role: 'admin',
        user_name: data.name,
        avatar: userInfo?.account?.avatar_url?.url,
      },
      (res) => {
        setChatToken(res)
      }
    )
  }

  return (
    <div className={twMerge(classNames('', className))}>
      <form onSubmit={handleSubmit(handleLogin)}>
        <p className="text-center text-lg font-bold mb-12">Đăng ký tài khoản người dùng</p>
        <div className="mb-12">
          <InputField
            control={control}
            defaultValue={userInfo?.account?.partner_name || ''}
            name="name"
            type="text"
            placeholder={`Họ và tên`}
            label="Tên người dùng"
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

        <div className="mb-12">
          <PasswordField
            control={control}
            name="confirmPassword"
            placeholder={`Nhập lại mật khẩu`}
            label="Nhập lại mật khẩu"
            inputClassName="rounded-[10px]"
          />
        </div>

        <Button
          type="submit"
          title={`Tạo tài khoản`}
          className={classNames(
            'w-full bg-primary mb-12 p-10 rounded-[10px]',
            isValid ? '' : 'opacity-50 cursor-default'
          )}
          textClassName={`title !text-white`}
        />
      </form>
    </div>
  )
}
