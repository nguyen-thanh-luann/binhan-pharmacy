import {
  AttachmentProps,
  CreateCommentParams,
  DeleteRatingProps,
  GetCommentsRatingsParams,
  GetRatingsByStarParams,
  UpdateRatingProps,
} from '@/types'
import axiosClient from '.'
import { DEFAULT_LIMIT } from '@/constants'

const ratingAPI = {
  getRatingTags: (params: { product_id: number; offset?: number; limit?: number }) => {
    return axiosClient.post('/comment_controller/get_rating_tag', {
      params,
    })
  },

  createAttachment: (params: AttachmentProps) => {
    return axiosClient.post('/comment_controller/create_attachment', {
      params,
    })
  },

  getProductsPurchased: (params: { offset?: number; limit?: number }) => {
    return axiosClient.post('/comment_controller/get_purchase_product_history', {
      params,
    })
  },

  updateRatingProduct: (props: UpdateRatingProps) => {
    return axiosClient.post('/comment_controller/update_rating_product', {
      params: props,
    })
  },

  deleteRatingProduct: (params: DeleteRatingProps) => {
    return axiosClient.post('/comment_controller/delete_rating_product', {
      params,
    })
  },

  groupRatingStarCount: (product_tmpl_id: number) => {
    return axiosClient.post('/comment_controller/group_rating_star_count', {
      params: {
        product_tmpl_id,
      },
    })
  },

  getRatingByStar: (params: GetRatingsByStarParams) => {
    return axiosClient.post('/comment_controller/get_rating_by_star_rating', {
      params,
    })
  },

  getRatingsByProduct: ({
    comment_type,
    product_id,
    limit = DEFAULT_LIMIT,
    offset = 0,
  }: GetCommentsRatingsParams) => {
    return axiosClient.get(
      `/comment_controller/rating_by_product?product_id=${product_id}&comment_type=["${comment_type}"]&limit=${limit}&offset=${offset}`
    )
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
}

export default ratingAPI
