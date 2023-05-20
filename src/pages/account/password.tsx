import { Breadcrumb, Button, PasswordField } from '@/components'
import { useUser } from '@/hooks'
import { changePasswordSchema, createPasswordSchema } from '@/schema'
import { userAPI } from '@/services'
import { AccountContainer, Main } from '@/templates'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

const PasswordPage = () => {
  const router = useRouter()
  const { userInfo, checkHasPassword, getUserInfo } = useUser({ shouldFetch: false })
  const [hasPassword, setHasPassword] = useState<boolean>(false)

  useEffect(() => {
    checkHasPassword((res) => {
      setHasPassword(res?.has_password)
    })
  }, [userInfo])

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: yupResolver(hasPassword ? changePasswordSchema : createPasswordSchema),
    mode: 'all',
  })

  const resetForm = () => {
    reset({
      password: '',
      newPassword: '',
      reNewPassword: '',
    })
  }

  const handleChangePassword = async (data: any) => {
    if (hasPassword) {
      try {
        // change password
        const res: any = await userAPI.changePassword({
          old_password: data.password,
          password: data.newPassword,
          re_password: data.reNewPassword,
        })

        if (res?.success) {
          toast.success('Cập nhật mật khẩu thành công!')
          resetForm()
          router.push('/account/profile')
        } else {
          toast.error(res?.message || 'Có lỗi xảy ra!')
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        // create new password when account does not have a password
        const res: any = await userAPI.createPassword({
          password: data.newPassword,
          re_password: data.reNewPassword,
        })

        if (res?.success) {
          toast.success('Tạo mật khẩu thành công!')
          resetForm()
          getUserInfo()
          router.push('/account/profile')
        } else {
          toast.error(res?.message || 'Có lỗi xảy ra!')
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <Main title={'Tài khoản'} description="">
      <div className="container">
        <Breadcrumb
          breadcrumbList={[
            {
              path: '/',
              name: 'Mật khẩu',
            },
          ]}
        />
      </div>

      <AccountContainer className="container mb-32">
        <div className="bg-white p-24 rounded-[10px] shadow-shadow-1">
          <p className="text-xl capitalize font-semibold border-b border-gray-200 pb-12 mb-24">
            {hasPassword ? 'Cập nhật mật khẩu' : 'Tạo mật khẩu'}
          </p>

          <div className="w-[90%] md:w-[50%] mx-auto">
            <form onSubmit={handleSubmit(handleChangePassword)}>
              {hasPassword ? (
                <div className="mb-12">
                  <PasswordField control={control} name="password" label="Mật khẩu hiện tại" />
                </div>
              ) : null}

              <div className="mb-12">
                <PasswordField control={control} name="newPassword" label="Mật khẩu mới" />
              </div>

              <div className="mb-12">
                <PasswordField
                  control={control}
                  name="reNewPassword"
                  label="Nhập lại Mật khẩu mới"
                />
              </div>

              <Button
                type="submit"
                title={hasPassword ? 'Cập nhật' : 'Tạo'}
                className={`bg-primary w-full py-8 ${isValid ? '' : 'opacity-50 cursor-default'}`}
                textClassName="text-white font-bold"
              />
            </form>
          </div>
        </div>
      </AccountContainer>
    </Main>
  )
}

export default PasswordPage
