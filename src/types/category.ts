import { IconType } from './common'
import { QueryList } from './http'

export interface GetCategoryParams extends QueryList {
  category_parent_id?: number
  position_view?: 'main_menu' | 'left_menu'
}

export interface CategoryIdName {
  category_id: number
  category_name: string
}

export interface Category {
  category_id: number
  category_name: string
  parent_id?: CategoryIdName
  child_ids?: CategoryChild[]
  icon?: IconType
  category_icon?: IconType
}

export interface CategoryChild extends CategoryIdName {
  icon: IconType
}

export interface CategoryMinor extends Category {
  descendants_structor?: CategoryIdName[]
}
