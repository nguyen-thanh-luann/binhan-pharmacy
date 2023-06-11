export interface PostTag {
  id: string
  content: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreatePostTagReq {
  content: string
}

export interface UpdatePostTagReq extends CreatePostTagReq {
  id: string
}
