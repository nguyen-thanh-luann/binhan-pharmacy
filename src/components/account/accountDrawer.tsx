import { UserCircleIcon } from '@/assets'
import { useGuest, useUser } from '@/hooks'
import { selectAuthOption, setAuthOption } from '@/store'
import { AUTH_OPTION } from '@/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import { LoginPasswordScreen, ResetPasswordScreen } from '../auth'
import { LoginOTPScreen } from '../auth/loginOTPScreen'
import { CustomImage } from '../customImage'
import { ModalAuth } from '../modal'
import { AccountDrawerMenu } from './accountDrawerMenu'

interface AccountDrawerProps {
  className?: string
}

export const AccountDrawer = ({ className }: AccountDrawerProps) => {
  //Use deviceCode as a flag to detect user login or not:
  //Have deviceCode => User not login yet
  //Do not have deviceCode => User logged

  const router = useRouter()
  const dispatch = useDispatch()
  const authOption: AUTH_OPTION = useSelector(selectAuthOption)
  const { guestInfo } = useGuest()
  const { userInfo } = useUser({})

  //  console.log(encodeJWT({ user_id: userInfo?.account?.partner_id }))

  const deviceCode = guestInfo?.device_code

  const handleCLoseModal = () => {
    dispatch(setAuthOption(undefined))
  }

  const handleClick = () => {
    if (!deviceCode) {
      router.push('/account/profile')
    } else {
      dispatch(setAuthOption('loginPassword'))
    }
  }

  return (
    <div>
      <div className={twMerge(classNames(`relative group`, className))}>
        <div
          onClick={handleClick}
          className="w-header_tab_width h-header_tab_height flex p-8 gap-8 rounded-[8px] items-center shadow-shadow-1 cursor-pointer group bg-background hover:bg-primary-100"
        >
          <div className="w-20 h-20">
            {deviceCode ? (
              <UserCircleIcon className="text-gray w-20 h-20 group-hover:text-primary" />
            ) : (
              <div>
                <CustomImage
                  src={userInfo?.account?.avatar_url?.url || ''}
                  imageClassName="w-[20px] min-w-[20px] h-[20px] object-cover rounded-full"
                />
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <p className="title !text-gray group-hover:!text-primary line-clamp-1 break-all">
              {!deviceCode
                ? userInfo?.account?.business_operation_name || userInfo?.account?.partner_name
                : 'Đăng nhập'}
            </p>
          </div>
        </div>

        <AccountDrawerMenu
          className={`absolute z-40 left-[-25%] hidden ${!deviceCode ? 'group-hover:block' : ''}`}
        />
      </div>

      {deviceCode ? (
        <ModalAuth visible={authOption !== undefined}>
          <div>
            {authOption === 'loginPassword' ? (
              <LoginPasswordScreen onClose={handleCLoseModal} />
            ) : null}

            {authOption === 'loginOTP' ? <LoginOTPScreen onClose={handleCLoseModal} /> : null}

            {authOption === 'resetPassword' ? (
              <ResetPasswordScreen onClose={handleCLoseModal} />
            ) : null}
          </div>
        </ModalAuth>
      ) : null}
    </div>
  )
}
