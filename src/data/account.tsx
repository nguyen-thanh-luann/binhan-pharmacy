import {
  LocationOutlineIcon,
  PackageBoxIconOutline,
  UserCircleIcon,
  LogoutIconOutline,
  LockIconOutline,
  StarIconOutline,
  NotebookIconOutline,
  NotebookIconOutlinePlus,
} from '@/assets'

export const accountIconStyle = 'w-[20px] h-[20px]'

export const PublicAccessRule = ['th', 'nvkd', 'npp', 'gsbh', 'asm']
export const AdminAccessRule = ['npp']

export const accountNavData = [
  {
    path: '/account/profile',
    icon: <UserCircleIcon className={accountIconStyle} />,
    title: 'Hồ sơ cá nhân',
    access_rules: PublicAccessRule,
  },
  {
    path: '/account/post',
    icon: <NotebookIconOutlinePlus className={accountIconStyle} />,
    title: 'Tin tức',
    // access_rules: AdminAccessRule,
    access_rules: PublicAccessRule,
  },
  {
    path: '/account/add-post',
    icon: <NotebookIconOutlinePlus className={accountIconStyle} />,
    title: 'Thêm tin tức',
    // access_rules: AdminAccessRule,
    access_rules: PublicAccessRule,
  },
  {
    path: '/account/post-category',
    icon: <NotebookIconOutline className={accountIconStyle} />,
    title: 'Danh mục tin tức',
    // access_rules: AdminAccessRule,
    access_rules: PublicAccessRule,
  },
  {
    path: '/purchased-order',
    icon: <PackageBoxIconOutline className={accountIconStyle} />,
    title: 'Đơn hàng',
    access_rules: PublicAccessRule,
  },
  {
    path: '/account/rating-product',
    icon: <StarIconOutline className={accountIconStyle} />,
    title: 'Đánh giá của tôi',
    access_rules: PublicAccessRule,
  },
  {
    path: '/account/address',
    icon: <LocationOutlineIcon className={accountIconStyle} />,
    title: 'Địa chỉ',
    access_rules: PublicAccessRule,
  },
  {
    path: '/account/password',
    icon: <LockIconOutline className={accountIconStyle} />,
    title: 'Mật khẩu',
    access_rules: PublicAccessRule,
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
