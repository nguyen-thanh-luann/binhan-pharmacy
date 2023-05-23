import {
  DonationIconOutline,
  HomeIconOutline,
  MenuSquareDotOutlineIcon,
  UserCircleIcon,
} from '@/assets'

const iconStyle = 'w-[20px] h-[20px]'

export const bottomNavData = [
  {
    path: '/',
    title: 'Trang chủ',
    icon: <HomeIconOutline className={iconStyle} />,
  },
  {
    path: '/search',
    title: 'Sản phẩm',
    icon: <MenuSquareDotOutlineIcon className={iconStyle} />,
  },
  {
    path: '/quick_order',
    title: 'Đặt hàng hộ',
    icon: <DonationIconOutline className={iconStyle} />,
  },
  {
    path: '/account/profile',
    title: 'Tài khoản',
    icon: <UserCircleIcon className={iconStyle} />,
  },
]
