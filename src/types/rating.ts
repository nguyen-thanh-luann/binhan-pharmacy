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
  product_tmpl_id: number;
  star_ratings: StarString[];
  offset?: number;
  limit?: number
}

export interface UpdateRatingProps {
  product_id: number
  star_rating: RatingRangePost
  content: string
  tag_ids?: Array<number>
  image_ids?: Array<number>
  attachment_ids?: Array<number>
  limit?: number
  offset?: number
}

export type RatingRangePost = 1 | 2 | 3 | 4 | 5

export type RatingRange = 0 | 1 | 2 | 3 | 4 | 5


