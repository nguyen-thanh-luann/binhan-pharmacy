import { GetPostDetailParams, GetPostListParams, ListRes, Post, PostDetail } from '@/types'
import { AxiosPromise } from 'axios'
import axiosClient from '.'


const postAPI = {
  getPostList: (params: GetPostListParams): AxiosPromise<ListRes<Post[]>> => {
    return axiosClient.get(
      `/chatDMS/api/post?limit=${params?.limit || ''}&offset=${params?.offset || ''}${
        params?.keyword ? `&keyword=${params?.keyword}` : ''
      }${params?.category_id ? `&category_id=${params?.category_id}` : ''}`
    )
  },

  getPostDetail: ({post_id}: GetPostDetailParams): AxiosPromise<PostDetail> => {
    return axiosClient.get(`/chatDMS/api/post/${post_id}`)
  }
}

export { postAPI }

