import { AccountType } from './auth'
import { QueryList } from './http'

export interface GetPostCategoryListParams extends QueryList {
  parent_id?: string
}

export interface GetPostListParams extends QueryList {
  category_id?: string
  parent_id?: string
  keyword?: string
  role?: AccountType
  tag_ids?: string[] | undefined
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
  tags: PostTagRes[]
  categories: PostCategoryRes[]
  created_at: Date
  role?: AccountType
}

export interface PostCategoryRes {
  category_id: string
  category_name: string
}

export interface PostTagRes {
  tag_id: string
  tag_content: string
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
  role: AccountType
}

export interface PostCategory {
  id: string
  slug: string
  image: {
    thumbnail_url: string
    height: string
    width: string
  }
  created_at: string
  desc: string
  name: string
  parent_id: string
  updated_at: Date
  children: PostCategory[]
  children_count: number
  role: AccountType
}

export interface CreatePostCategory {
  slug: string
  name: string
  parent_id?: string
  attachment_id?: string
  desc: string
  role?: AccountType
}

export interface UpdateCategory extends CreatePostCategory {
  id: string
}

export interface CreatePost {
  title: string
  sub_title?: string
  content: string
  attachment_id: string
  short_content: string
  category_ids: string[]
  slug: string
  tag_ids?: string[] | undefined
  role?: AccountType
}

export interface UpdatePost extends CreatePost {
  id: string
}
