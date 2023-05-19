import { URLRes } from './common'
import { QueryList } from './http'

export interface GetBannerParams extends QueryList {
  aspect?: string //yêu cầu api bổ sung cái này
}

export interface Banner {
  banner_id: number
  banner_name: string
  banner_cloud_storage_id: URLRes
  description_url: string
}
