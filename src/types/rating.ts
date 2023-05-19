import { URLRes } from './common'
import { Product } from './product'
import { UserGenderType } from './user'
import { Comment } from './comment'

export type StarString = '1' | '2' | '3' | '4' | '5'

export interface StarRating {
  star_rating: StarString
  rating_count: number
}

export interface AttachmentProps {
  product_id: number
  attachments: {
    file: string
    type: 'picture' | 'video'
  }[]
}

export interface DeleteRatingProps {
  history_line_id: number
  product_id: number
}

export interface GetRatingsByStarParams {
  product_tmpl_id: number
  star_ratings: StarString[]
  offset?: number
  limit?: number
}

export interface CreateRatingProps extends CreateRatingReq {
  onSuccess?: () => void
  onError?: () => void
}

export interface CreateRatingReq {
  product_id: number
  star_rating: StarRatingRangeReq
  history_line_id: Array<number>
  content: string
  tag_ids?: Array<number>
  image_ids?: Array<number>
  attachment_ids?: Array<number>
  limit?: number
  offset?: number
}

export type StarRatingRangeReq = 1 | 2 | 3 | 4 | 5

export type StarRatingRange = 0 | 1 | 2 | 3 | 4 | 5

export interface RatingRes {
  history_line_id: number
  sale_order: RatingSaleOrderRes
  product: Product
  comment_rating: Rating
}

export interface RatingSaleOrderRes {
  sale_order_id: number
  sale_name: string
  partner_id: RatingPartner
  company_id: CompanyId
  amount_total: number
  promotion: {}
}

export interface RatingPartner {
  partner_id: number
  partner_name: string
  phone: string
  gender: UserGenderType
  avatar_url: URLRes
}

export interface CompanyId {
  ompany_id: number
  company_name: string
}

export interface Rating extends Comment {}
