import {
  AttachmentProps,
  Comment,
  CreateCommentParams,
  CreateRatingReq,
  DeleteRatingProps,
  GetCommentsRatingsParams,
  GetRatingsByStarParams,
  HTTPResponseV2,
  QueryList,
  Rating,
  RatingRes,
} from '@/types'
import axiosClient from '.'

const ratingAPI = {
  getRatingTags: (params: { product_id: number; offset?: number; limit?: number }) => {
    return axiosClient.get('/comment_controller/rating_tag', {
      params,
    })
  },

  createAttachment: (params: AttachmentProps) => {
    return axiosClient.post('/comment_controller/create_attachment', {
      params,
    })
  },

  getProductsPurchased: (params: QueryList): Promise<HTTPResponseV2<RatingRes[]>> => {
    return axiosClient.get('/comment_controller/purchase_product_history', {
      params,
    })
  },

  updateRatingProduct: (props: CreateRatingReq) => {
    return axiosClient.post('/comment_controller/update_rating_product', {
      params: props,
    })
  },

  groupRatingStarCount: (product_id: number) => {
    return axiosClient.get(`/comment_controller/group_rating_star_count?product_id=${product_id}`)
  },

  getRatingByStar: (params: GetRatingsByStarParams) => {
    return axiosClient.post('/comment_controller/get_rating_by_star_rating', {
      params,
    })
  },

  getRatingsByProduct: (
    params: GetCommentsRatingsParams
  ): Promise<HTTPResponseV2<Comment[] | Rating[]>> => {
    return axiosClient.get('/comment_controller/rating_by_product', {
      params: {
        ...params,
        comment_type: `[${params?.comment_type.map((item) => `"${item}"`).join(', ')}]`,
        star_rating: params?.star_rating ? `[${params?.star_rating?.join(', ')}]` : undefined,
      },
    })
  },

  createComment: ({ product_id, content }: CreateCommentParams) => {
    return axiosClient.post(`/comment_controller/create_comment_product`, {
      params: {
        product_id,
        content,
      },
    })
  },

  deleteComment: (comment_id: number) => {
    return axiosClient.delete(`/comment_controller/delete_comment_product?comment_id=${comment_id}`)
  },

  deleteRating: (params: DeleteRatingProps) => {
    return axiosClient.delete(`/comment_controller/rating_product`, { params })
  },
}

export default ratingAPI
