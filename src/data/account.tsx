import {
  BellIconOutline,
  DonationIconOutline,
  FeatherOutlineIcon,
  LocationOutlineIcon,
  LockIconOutline,
  LogoutIconOutline,
  MenuSquareDotOutlineIcon,
  NotebookIconOutlinePlus,
  PackageBoxIconOutline,
  StarIconOutline,
  TagIcon,
  UserCircleIcon,
} from '@/assets'

export const accountIconStyle = 'w-[20px] h-[20px]'

export const PublicAccessRule = ['th', 'nvkd', 'npp', 'gsbh', 'asm', ''] // all user

export const UserAccessRule = ['th', 'nvkd', 'gsbh', 'asm', ''] //without 'npp'
export const AdminAccessRule = ['npp']

export const PublicAccountTypePermissions = ['drugstore_account', 'patient_account', '']

export const accountNavData = [
  {
    path: '/account/profile',
    icon: <UserCircleIcon className={accountIconStyle} />,
    title: 'Hồ sơ cá nhân',
    access_rules: PublicAccessRule,
    account_type_permissions: PublicAccountTypePermissions,
  },
  {
    path: '/account/post',
    icon: <NotebookIconOutlinePlus className={accountIconStyle} />,
    title: 'Tin tức',
    access_rules: AdminAccessRule,
    account_type_permissions: PublicAccountTypePermissions,
  },
  {
    path: '/account/add-post',
    icon: <FeatherOutlineIcon className={accountIconStyle} />,
    title: 'Thêm tin tức',
    access_rules: AdminAccessRule,
    account_type_permissions: PublicAccountTypePermissions,
  },
  {
    path: '/account/post-category',
    icon: <MenuSquareDotOutlineIcon className={accountIconStyle} />,
    title: 'Danh mục tin tức',
    access_rules: AdminAccessRule,
    account_type_permissions: PublicAccountTypePermissions,
  },
  {
    path: '/account/post-tags',
    icon: <TagIcon className={accountIconStyle} />,
    title: 'Quản lí tags',
    access_rules: AdminAccessRule,
    account_type_permissions: PublicAccountTypePermissions,
  },
  {
    path: '/account/your-news',
    icon: <BellIconOutline className={accountIconStyle} />,
    title: 'Có thể bạn cần',
    access_rules: UserAccessRule,
    account_type_permissions: ['drugstore_account'],
  },
  {
    path: '/account/your-news',
    icon: <BellIconOutline className={accountIconStyle} />,
    title: 'Khuyến mãi cho bạn',
    access_rules: UserAccessRule,
    account_type_permissions: ['patient_account', ''],
  },
  {
    path: '/purchased-order',
    icon: <DonationIconOutline className={accountIconStyle} />,
    title: 'Đơn hàng',
    access_rules: PublicAccessRule,
    account_type_permissions: PublicAccountTypePermissions,
  },
  {
    path: '/account/rating-product',
    icon: <StarIconOutline className={accountIconStyle} />,
    title: 'Đánh giá của tôi',
    access_rules: PublicAccessRule,
    account_type_permissions: PublicAccountTypePermissions,
  },
  {
    path: '/account/address',
    icon: <LocationOutlineIcon className={accountIconStyle} />,
    title: 'Địa chỉ',
    access_rules: PublicAccessRule,
    account_type_permissions: PublicAccountTypePermissions,
  },
  {
    path: '/account/password',
    icon: <LockIconOutline className={accountIconStyle} />,
    title: 'Mật khẩu',
    access_rules: PublicAccessRule,
    account_type_permissions: PublicAccountTypePermissions,
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
