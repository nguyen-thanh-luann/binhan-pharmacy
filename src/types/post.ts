import { QueryList } from "./http"

export interface GetPostCategoryListParams extends QueryList {
  parent_id?: string
}

export interface GetPostListParams extends QueryList {
  category_id?: string
}

export interface GetPostDetailParams {
  post_id: string
}


export interface PostImage {
  id: string
  url: string
  thumbnail_url: string
  type: string
  height: number
  width: number

}

export interface Post {
  id: string
  author_id: string
  author_name: string
  slug: string
  title: string
  thumbnail: PostImage
  content: string
  short_content: string
  tags: []
  category_id: string
  category_name: string
  created_at: Date
}


export type PostDetail = Pick<
  Post,
  'slug' | 'title' | 'thumbnail' | 'short_content' | 'content' | 'tags'
> & {
  id: string
  author_id: string
  author_name: string
  category_id?: string
  category_name?: string
}