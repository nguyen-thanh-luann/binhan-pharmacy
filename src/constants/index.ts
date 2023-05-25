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
export const LIMIT_MESSAGES = 30
export const LIMIT_ROOM_CHAT = 20
export const LIMIT_DRUG_STORES = 20
export const RESEND_OTP_TIMEOUT = 60
export const LIMIT_CART_CATEGORY = 4
export const LIMIT_CART_COMPANY = 4
export const LIMIT_ATTACHMENT = 5
export const LIMIT_PRODUCT_IN_CATEGORY = 30

export const CHAT_POPOVER_HEIGHT = 700
export const HEADER_HEIGHT = 90
export const HEADER_NAV_HEIGHT = 46
export const HEADER_GROUP_HEIGHT = HEADER_HEIGHT + HEADER_NAV_HEIGHT

export const DESKTOP_WIDTH = 1024
export const TABLET_WIDTH = 900
export const MOBILE_WIDTH = 300

export const WEB_TITTLE = 'Nhà thuốc Bình An'
export const WEB_DESCRIPTION = 'Nhà thuốc Bình An - chuyên cup cấp thuốc sỉ và lẻ'
export const CONTACT_PHONE_NUMBER = '02963958186'
export const thumbnailImageUrl = 'https://tinyurl.com/bddj6utd'
export const POPUP_NOTIFICATION = `Sàn giao dịch thương mại điện tử duocbinhan.vn được thiết lập để các thành viên tham gia mua bán sỉ các sản phẩm dược phẩm, vật tư y tế, mỹ phẩm và các sản phẩm được phép lưu hành tại Việt Nam.
 Thành viên tham gia Sàn Giao Dịch là các công ty, tổ chức, nhà thuốc, quầy thuốc, phòng khám được cấp quyền phân phối dược phẩm, vật tư y tế và các sản phẩm khác; và phải có người phụ trách chuyên môn theo quy định của pháp luật. Các thông tin về giá cả, thông tin sản phẩm thuốc đăng tải lên Sàn Giao Dịch nhằm mục đích cung cấp thông tin cho thành viên có quyền mua hàng có thể xác định các đặc tính của hàng hóa để đưa ra quyết định mua. 
Việc sử dụng thuốc kê đơn hay chữa bệnh phải tuyệt đối tuân thủ theo sự hướng dẫn của người có chuyên môn về y dược. Sàn Giao Dịch không chịu trách nhiệm cho bất cứ hậu quả nào xảy ra do tự ý dùng thuốc dựa trên các thông tin trên và các trường hợp thành viên mua thuốc cho mục đích tiêu dùng.`

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
  { label: 'Phổ biến', value: 'default' },
  { label: 'Bán chạy', value: 'sold_quantity' },
  { label: 'Sản phẩm mới', value: 'new_product' },
  { label: 'Giá thấp đến cao', value: 'price_increase' },
  { label: 'Giá cao đến thấp', value: 'price_decrease' },
]
