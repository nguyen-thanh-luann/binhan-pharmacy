import {
  CreatePost,
  CreatePostCategory,
  CreatePostTagReq,
  GetPostCategoryListParams,
  GetPostDetailParams,
  GetPostListParams,
  HTTPListResV2,
  Post,
  PostCategory,
  PostDetail,
  PostTag,
  QueryList,
  UpdateCategory,
  UpdatePost,
  UpdatePostTagReq,
} from '@/types'
import { AxiosPromise } from 'axios'
import axiosClient from '.'

const postAPI = {
  getPostList: (params: GetPostListParams): Promise<HTTPListResV2<Post[]>> => {
    return axiosClient.get(`/chatDMS/api/post`, { params })
  },

  getPostTagList: (params: QueryList): Promise<HTTPListResV2<PostTag[]>> => {
    return axiosClient.get(`/chatDMS/api/postTag`, { params })
  },

  createPostTag: (params: CreatePostTagReq) => {
    return axiosClient.post(`/chatDMS/api/postTag`,  params)
  },

  updatePostTag: (params: UpdatePostTagReq) => {
    const { id, ...req } = params
    return axiosClient.patch(`/chatDMS/api/postTag/${id}`, req)
  },

  deletePostTag: (id: string) => {
    return axiosClient.delete(`/chatDMS/api/postTag/${id}`)
  },

  restorePostTag: (id: string) => {
    return axiosClient.patch(`/chatDMS/api/postTag/restore/${id}`)
  },

  getPostDetail: ({ post_id }: GetPostDetailParams): AxiosPromise<PostDetail> => {
    return axiosClient.get(`/chatDMS/api/post/${post_id}`)
  },

  getPostCategoryList: (
    params: GetPostCategoryListParams
  ): Promise<HTTPListResV2<PostCategory[]>> => {
    return axiosClient.get(`/chatDMS/api/category`, { params })
  },

  getPrimaryPostCategoryList: (
    params: GetPostCategoryListParams
  ): Promise<HTTPListResV2<PostCategory[]>> => {
    return axiosClient.get(`/chatDMS/api/category/parent`, { params })
  },

  createCategory: (params: CreatePostCategory) => {
    return axiosClient.post(`/chatDMS/api/category`, params)
  },

  updateCategory: (params: UpdateCategory) => {
    const { id, ...req } = params
    return axiosClient.patch(`/chatDMS/api/category/${id}`, req)
  },

  deleteCategory: (id: string) => {
    return axiosClient.delete(`/chatDMS/api/category/${id}`)
  },

  createPost: (params: CreatePost) => {
    return axiosClient.post(`/chatDMS/api/post`, params)
  },

  deletePost: (id: string) => {
    return axiosClient.delete(`/chatDMS/api/post/${id}`)
  },

  updatePost: (params: UpdatePost) => {
    const { id, ...req } = params
    return axiosClient.patch(`/chatDMS/api/post/${id}`, req)
  },
}

export { postAPI }
