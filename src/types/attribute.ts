import { IconType } from './common'
import { QueryList } from './http'

export interface GetListAttributeMinorParams extends QueryList {
  attribute_parent_id?: number
  view_state?: 'home' | 'product'
  // Home: Lấy thuộc tính chỉ hiển thị trên trang Home
  // product: Lấy thuộc tính được hiển thị trên trang tìm kiếm sản phẩm
}

export interface AttributeMinor {
  attribute_id: number
  attribute_name: string
  attribute_icon: IconType
  sequence: number
  value_ids: AttributeMinorValue[]
  filterable: boolean
}

export interface AttributeMinorValue {
  value_id: number
  code: string
  value_name: string
  value_icon: IconType
}

export interface VisceraAttribute extends AttributeMinorValue {}

export interface VisceraAttributeRes extends AttributeMinor {
  value_ids: VisceraAttribute[]
}

export interface AttributeReq {
  attribute_id: number
  attribute_value_ids: Array<number>
}
