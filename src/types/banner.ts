import { URLRes } from './common'
import { QueryList } from './http'

export interface GetBannerParams extends QueryList {
  banner_size?: '4:1' | '3:1' | '2:1'
}

export interface Banner {
  banner_id: number
  banner_name: string
  banner_cloud_storage_id: URLRes
  description_url: string
}
