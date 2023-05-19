import { QueryList } from './http'

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
  parent_id: number
  updated_at: Date
}

export interface CreatePostCategory {
  slug: string
  name: string
  parent_id?: string
  attachment_id?: string
  desc: string
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
  category_id: string
  slug: string
  tags?: string[] | undefined
}

export interface UpdatePost extends CreatePost {
  id: string
}
