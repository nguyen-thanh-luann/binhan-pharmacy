import {
  angryIcon,
  heartIcon,
  laughIcon,
  likeIcon,
  sadIcon,
  wowIcon,
  thumbnailImage,
} from '@/assets'
import { OptionType } from '@/types'

export * from './regex'
export * from './swrKey'
export * from './socketKey'

export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN_URL
export const ZALO_OA_ID = process.env.NEXT_PUBLIC_ZALO_OA_ID
export const FACEBOOK_PAGE_ID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID
export const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
export const TINYMCE_EDITOR_KEY = process.env.NEXT_PUBLIC_TINY_EDITOR_KEY

export const PHONE_SCHEMA = /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/

export const DEFAULT_LIMIT = 30
export const DEFAULT_POST_LIMIT = 8
export const DEFAULT_LIMIT_PRODUCT = 30
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
export const thumbnailImageUrl = thumbnailImage?.default?.src || ''

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
  { label: 'Quầy thuốc', value: 'pharmacy' },
  { label: 'Trạm y tế', value: 'health_store' },
  { label: 'Khác', value: 'orther' },
]

export const PRODUCT_FILTER_TABS: OptionType<string>[] = [
  { label: 'Tất cả', value: 'default' },
  { label: 'Bán chạy', value: 'sold_quantity' },
  { label: 'Sản phẩm mới', value: 'new_product' },
  { label: 'Giá thấp đến cao', value: 'price_increase' },
  { label: 'Giá cao đến thấp', value: 'price_decrease' },
]

export const POST_ROLES_OPTIONS = [
  {
    label: 'Công khai',
    value: '',
  },
  {
    label: 'Riêng tư',
    value: 'npp',
  },
  {
    label: 'Người dùng',
    value: 'th',
  },
]

export const VNPAY_STATUS_NAME = {
  '00': '	Giao dịch thành công',
  '07': '	Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
  '09': '	Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
  '10': '	Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  '11': '	Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
  '12': '	Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
  '13': '	Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
  '24': '	Giao dịch không thành công do: Khách hàng hủy giao dịch',
  '51': '	Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
  '65': '	Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
  '75': '	Ngân hàng thanh toán đang bảo trì.',
  '79': '	Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
  '99': '	Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
} as any
