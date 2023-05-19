import {
  LocationOutlineIcon,
  PackageBoxIconOutline,
  UserCircleIcon,
  LogoutIconOutline,
  LockIconOutline,
  StarIconOutline,
} from '@/assets'

export const accountIconStyle = 'w-[20px] h-[20px]'

export const accountNavData = [
  {
    path: '/account/profile',
    icon: <UserCircleIcon className={accountIconStyle} />,
    title: 'Hồ sơ cá nhân',
  },
  {
    path: '/purchased-order',
    icon: <PackageBoxIconOutline className={accountIconStyle} />,
    title: 'Đơn hàng',
  },
  {
    path: '/account/rating-product',
    icon: <StarIconOutline className={accountIconStyle} />,
    title: 'Đánh giá của tôi',
  },
  {
    path: '/account/address',
    icon: <LocationOutlineIcon className={accountIconStyle} />,
    title: 'Địa chỉ',
  },
  {
    path: '/account/password',
    icon: <LockIconOutline className={accountIconStyle} />,
    title: 'Mật khẩu',
  },
]

const iconClassName = 'w-[20px] h-[20px]'

export const AccountMenuData = [
  {
    title: 'Trang cá nhân',
    icon: <UserCircleIcon className={iconClassName} />,
    path: '/account/profile',
  },
  {
    title: 'Đơn hàng',
    icon: <PackageBoxIconOutline className={iconClassName} />,
    path: '/purchased-order',
  },
  {
    title: 'Đăng xuất',
    icon: <LogoutIconOutline className={iconClassName} />,
    path: 'logout',
  },
]
