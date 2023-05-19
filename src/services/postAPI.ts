import {
  CreatePost,
  CreatePostCategory,
  GetPostCategoryListParams,
  GetPostDetailParams,
  GetPostListParams,
  HTTPListRes2,
  ListRes,
  Post,
  PostCategory,
  PostDetail,
  UpdateCategory,
  UpdatePost,
} from '@/types'
import { AxiosPromise } from 'axios'
import axiosClient from '.'

const postAPI = {
  getPostList: (params: GetPostListParams): AxiosPromise<ListRes<Post[]>> => {
    return axiosClient.get(`/chatDMS/api/post`, { params })
  },

  getPostDetail: ({ post_id }: GetPostDetailParams): AxiosPromise<PostDetail> => {
    return axiosClient.get(`/chatDMS/api/post/${post_id}`)
  },

  getPostCategoryList: (
    params: GetPostCategoryListParams
  ): Promise<HTTPListRes2<PostCategory[]>> => {
    return axiosClient.get(`/chatDMS/api/post/category`, { params })
  },

  createCategory: (params: CreatePostCategory) => {
    return axiosClient.post(`/chatDMS/api/category`, params)
  },

  updateCategory: (params: UpdateCategory) => {
    const { id, ...req } = params
    return axiosClient.patch(`/chatDMS/api/category/${id}`, req)
  },

  deleteCategory: (id: string) => {
    return axiosClient.delete(`/chatDMS/category/${id}`)
  },

  createPost: (params: CreatePost) => {
    return axiosClient.post(`/chatDMS/post`, params)
  },

  deletePost: (id: string) => {
    return axiosClient.delete(`/chatDMS/post/${id}`)
  },

  updatePost: (params: UpdatePost) => {
    const { id, ...req } = params
    return axiosClient.patch(`/chatDMS/post/${id}`, req)
  },
}

export { postAPI }
