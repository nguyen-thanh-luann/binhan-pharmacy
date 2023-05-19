type AttachmentType = 'image' | 'video' | 'voice'

export interface IAttachment {
  _id: string
  url: string
  thumbnail_url: string
  desc: string
  attachment_type: AttachmentType
  created_at: Date
  updated_at: Date
}

export type RatingAttachmentRes = Pick<IAttachment, 'thumbnail_url' | 'url' | 'attachment_type'> & {
  attachment_id: number
  image_id: number
  image_url: string
}

export type CreateAttachmentType = 'image/png' | 'image/jpeg' | 'video/mp4' | 'application/pdf'

export interface CreateAttachmentParams {
  type: CreateAttachmentType
  file: string
}

export interface CreateAttachmentReq {
  attachments: CreateAttachmentParams[]
}

export interface CreateAttachmentRes {
  id: number
  url: string
  name: string
  data_type: CreateAttachmentType
}
