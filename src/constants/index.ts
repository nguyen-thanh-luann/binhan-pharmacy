import { angryIcon, heartIcon, laughIcon, likeIcon, sadIcon, wowIcon } from '@/assets'
import { OptionType } from '@/types'

export * from './regex'
export * from './swrKey'
export * from './socketKey'

export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN_URL
export const ZALO_OA_ID = process.env.NEXT_PUBLIC_ZALO_OA_ID

export const PHONE_SCHEMA = /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/

export const DEFAULT_LIMIT = 30
export const DEFAULT_LIMIT_PRODUCT = 10
export const LIMIT_MESSAGES = 30
export const LIMIT_ROOM_CHAT = 20
export const LIMIT_DRUG_STORES = 20
export const RESEND_OTP_TIMEOUT = 60
export const LIMIT_CART_CATEGORY = 4
export const LIMIT_CART_COMPANY = 4
export const LIMIT_ATTACHMENT = 10
export const LIMIT_PRODUCT_IN_CATEGORY = 30

export const CHAT_POPOVER_HEIGHT = 700
export const HEADER_HEIGHT = 90
export const HEADER_NAV_HEIGHT = 46
export const HEADER_GROUP_HEIGHT = HEADER_HEIGHT + HEADER_NAV_HEIGHT

export const DESKTOP_WIDTH = 1024
export const TABLET_WIDTH = 900
export const MOBILE_WIDTH = 300

export const WEB_TITTLE = 'Hệ thống nhà thuốc BINHAN PHARMACY'
export const WEB_DESCRIPTION =
  'Phân phối đa dạng các dòng sản phẩm chăm sóc sức khỏe trong và ngoài nước. Cam kết 100% sản phẩm chính hãng, xuất xứ rõ ràng, tư vấn tận tình.'
export const CONTACT_PHONE_NUMBER = '093 3691 115'
export const thumbnailImageUrl = 'https://tinyurl.com/bddj6utd'

export const MESSAGE_OPTION_MENU_SIZE = {
  width: 180,
  height: 168,
}

export const MESSAGE_STATUS = {
  pending: 'Đang gửi',
  rejected: 'Gửi lỗi',
  fulfilled: 'Đã gửi',
}

export const MESSAGE_EMOTION_ICON = {
  laugh: laughIcon,
  heart: heartIcon,
  sad: sadIcon,
  wow: wowIcon,
  like: likeIcon,
  angry: angryIcon,
}

export const DATA_GENDER: OptionType<string>[] = [
  { label: 'Nam', value: 'male' },
  { label: 'Nữ', value: 'female' },
  { label: 'Khác', value: 'other' },
]

export const STORE_TYPE: OptionType<string>[] = [
  { label: 'Nhà thuốc', value: 'drugstore' },
  { label: 'Phòng khám', value: 'clinic' },
  { label: 'Shop bán hàng', value: 'store' },
  { label: 'quầy thuốc', value: 'pharmacy' },
  { label: 'trạm y tế', value: 'health_store' },
  { label: 'khác', value: 'orther' },
]

export const PRODUCT_FILTER_TABS: OptionType<string>[] = [
  { label: 'Tất cả', value: 'default' },
  { label: 'Bán chạy', value: 'sold_quantity' },
  { label: 'Sản phẩm mới', value: 'new_product' },
  { label: 'Giá thấp đến cao', value: 'price_increase' },
  { label: 'Giá cao đến thấp', value: 'price_decrease' },
]
