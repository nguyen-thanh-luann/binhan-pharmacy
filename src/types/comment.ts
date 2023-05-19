import { ImageRes } from './common'
import { QueryList } from './http'

export interface GetCommentsRatingsParams extends QueryList {
  product_id: number
  comment_type: ['comment' | 'rating']
}

export interface CreateCommentParams {
  product_id: number
  content: string,
  onSuccess?: () => void
}

export interface CommentAuthor {
  partner_id: number
  partner_name: string
  phone: string
  gender: string
  avatar_url: ImageRes
}

export interface Comment {
  comment_id: number
  author: CommentAuthor
  content: string
  product_id: {
    id: number
    name: string
  }
  date: Date
  time_duration: {
    time_value: number
    time_type: string
  }
  editable: boolean
  deletable: boolean
}
