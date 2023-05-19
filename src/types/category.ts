import { IconType } from "./common"
import { QueryList } from "./http"

export interface GetCategoryParams extends QueryList {
  category_parent_id?: number
}

export interface CategoryIdName {
  category_id: number
  category_name: string
}

export interface Category {
  category_id: number
  category_name: string
  parent_id?: CategoryIdName
  child_ids?: CategoryIdName[]
  icon?: IconType
  category_icon?: IconType
}

export interface CategoryMinor extends Category {
  descendants_structor?: CategoryIdName[]
}


