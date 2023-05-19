import { AxiosResponse } from 'axios'
import { AttachmentId } from './common'
import { ListRes } from './http'
import { IAttachment } from './attachment'

export interface CreateTagMessage {
  role: UserRole
  text: string
}

export type AttachmentRes = Pick<IAttachment, 'thumbnail_url' | 'url' | 'attachment_type'> & {
  id: string
  previewImage?: string
}

export interface ServiceQueryListRes<T> {
  total: number
  data: T
}

export interface ITag {
  _id: string
  text: string
  role: UserRole
  created_at: Date
  updated_at: Date
}

export interface TagRes {
  tag_id: string
  text: string
}

export type CreateAttachment = Pick<IAttachment, 'attachment_type' | 'url' | 'thumbnail_url'> & {
  desc?: string
}

export type UpdateAttachment = Partial<
  Pick<IAttachment, 'attachment_type' | 'url' | 'thumbnail_url' | 'desc' | 'updated_at'>
> & {
  attachment_id: string
}

export interface CreateTagMessage {
  role: UserRole
  text: string
}

export type UpdateTagMessage = Partial<CreateTagMessage> & {
  tag_id: string
}

export interface ImageWithId {
  id: string
  url: string
}

export interface AttachmentResult {
  formData: FormData
  previewImages: ImageWithId[]
}

export type UploadFileType = 'image' | 'video'

export interface UploadSingleFile {
  name: UploadFileType
  file: File
}

export interface UploadMultipleFile {
  params: {
    name: UploadFileType
    files: File[]
  }
  onSuccess?: (data: AttachmentRes) => void
}

export type MessageResponseStatus = 'pending' | 'rejected' | 'fulfilled'

export type ChatAxiosResponse<T> = AxiosResponse & {
  message: string
  success: boolean
  status_code: number
  data: T
}

export interface IUser {
  _id: string
  user_name: string
  role: UserRole
  avatar_id?: string
  password: string
  bio?: string
  phone: string
  user_id: number
  date_of_birth?: string
  blocked_user_ids: number[]
  gender?: Gender
  room_joined_ids: string[]
  messages_unread: {
    room_id: string
    message_ids: string[]
  }[]
  message_unread_count: number
  created_at: Date
  updated_at: Date
  is_online: boolean
  offline_at: Date
  room_blocked_noti_ids: string[]
}

export interface LoginByOTP {
  type: 'firebase' | 'stringee'
  name_user?: string
  firebase_access_token?: string
  stringee_access_token?: string
}

export type UserPopulate = Omit<IUser, 'avatar_id'> & {
  avatar_id: IAttachment
}

export type UserRes = Pick<
  IUser,
  | 'bio'
  | 'created_at'
  | 'date_of_birth'
  | 'gender'
  | 'is_online'
  | 'offline_at'
  | 'role'
  | 'phone'
  | 'user_name'
  | 'updated_at'
> & {
  socket_id: string
  user_id: string
  avatar: AttachmentRes
  room_id?: string
  is_yourself?: boolean
}

export type CreateUserParams = Pick<
  IUser,
  'user_name' | 'date_of_birth' | 'gender' | 'role' | 'bio' | 'phone' | 'user_id'
> & {
  user_id: number
  avatar: string
}

export type UpdateProfile = Partial<
  Pick<IUser, 'user_name' | 'date_of_birth' | 'gender' | 'bio'> & {
    avatar: string
  }
>
export type UpdateProfileService = UpdateProfile & { user: IUser }
export type GetTokenParams = { user_id: string }
export type UserRole = 'customer' | 'car_driver' | 'admin'
export type Gender = 'male' | 'female' | 'no_info' | ''
export type UserLoginRes = UserRes & { access_token: string; refresh_token: string }
export type changeUserStatusParams = Pick<IUser, 'is_online'> & { user_id: string }
export type BlockUserStatus = 'block' | 'unblock'
export type BlockOrUnBlockUserParams = {
  user_id: string
  partner_id: string
  status: BlockUserStatus
}

export interface QueryCommonParams {
  limit?: number
  offset?: number
}

export type getUserBlockListParams = Pick<IUser, 'blocked_user_ids'> & QueryCommonParams

export interface LoginParams {
  phone: string
  password: string
}

export interface CreateChatPasswordParams {
  new_password: string
  confirm_new_password: string
}

export type FriendStatusRes = {
  user_id: string
  room_ids: string[]
}

export interface ResetPasswordRes {
  token: string
  car_account_type: string
  refresh_token: string
}

export interface IUser {
  _id: string
  user_name: string
  role: UserRole
  avatar_id?: string
  password: string
  bio?: string
  phone: string
  user_id: number
  date_of_birth?: string
  blocked_user_ids: number[]
  gender?: Gender
  room_joined_ids: string[]
  messages_unread: {
    room_id: string
    message_ids: string[]
  }[]
  message_unread_count: number
  created_at: Date
  updated_at: Date
  is_online: boolean
  offline_at: Date
  room_blocked_noti_ids: string[]
}

export interface IRoom {
  _id: string
  room_name: string
  room_avatar_id: string
  room_type: RoomType
  member_ids: RoomMember[]
  leader_id: string
  last_message_id?: string
  pinned_message_ids: string[]
  members_leaved: MemberLeaved
  message_ids: string[]
  is_expired: boolean
  created_at: Date
  deleted_at: Date
  updated_at: Date
}

export interface RoomRes {
  id: string
  name: string | null
  avatar?: string | null
  type?: string
  is_online: boolean
  offline_at: Date
  message_unread_count: number
  member_count: number
  last_message?: LastMessage | null
  top_members?: {
    user_id: string
    user_name: string
    avatar: string
    offline_at: string
    phone: string
  }[]
  room_type: RoomType
}

export interface AuthorMessage {
  author_id: string
  author_name: string
  author_avatar: AttachmentRes
}

export type RoomDetailRes = Omit<
  RoomRes,
  'message_unread_count' | 'last_message' | 'room_avatar'
> & {
  room_avatar: AttachmentRes | null
  offline_at: Date | null
  messages: ListRes<MessageRes[]>
  members: ListRes<RoomMemberRes[]>
}

export type RoomType = 'group' | 'single' | 'admin'

export interface RoomMember {
  user_id: string
  joined_at: number
}

export interface MemberLeaved {
  user_id: string
  leaved_at: number
}

export interface RoomMemberWithId {
  _id: string
  member_ids: RoomMember[]
}

export type LastMessage = {
  id: string
  text: string
  created_at: Date
  user_id: string
  user_name: string
  is_author: boolean
}

export interface CreateSingleChat {
  partner_id: number | string
}

export interface CreateGroupChat {
  room_name: string
  room_avatar_id?: AttachmentId
  member_ids: number[]
}

export type CreateGroupChatServicesParams = Pick<
  CreateGroupChat,
  'room_avatar_id' | 'room_name'
> & {
  member_ids: string[]
}

export type CreateSingleChatServices = {
  partner: IUser
  user: IUser
}

export interface QueryRoomParams extends QueryCommonParams {
  keyword?: string
}

export interface QueryMembersInRoomParams extends QueryCommonParams {
  keyword?: string
}

export interface QueryRoomServiceParams extends QueryRoomParams {
  room_ids: string[]
  current_user: IUser
}

export interface QueryMembersInRoomService extends QueryCommonParams {
  room_id: string
}

export type RoomMemberRes = Pick<
  IUser,
  'bio' | 'gender' | 'date_of_birth' | 'is_online' | 'user_name' | 'phone'
> & {
  user_id: string
  avatar: AttachmentRes
}

export interface ClearUnreadMessage {
  room_id: string
}

export type ChangeStatusOfRoom = FriendStatusRes & { type: 'login' | 'logout' }

export interface RoomFunctionHandler {
  messageUnreadhandler: (_: MessageRes) => void
  changeStatusOfRoom: (_: ChangeStatusOfRoom) => void
  appendLastMessage: (_: MessageRes) => void
  changeOrderAndAppendLastMessage: (_: MessageRes) => void
  clearMessagesUnreadFromRoom: (id: string) => void
  addRoom: (room: RoomDetailRes) => void
  deleteRoomByCompoundingCarId: (c_id: number) => void
  deleteRoom: (c_id: string) => void
}

export interface RoomDetailFunctionHandler {
  appendMessage: (_: MessageRes) => void
  changeStatusOfRoom: (_: ChangeStatusOfRoom) => void
  changeMesageStatus: (_: MessageRes) => void
  mutateWithMessageRes: (_: MessageRes) => void
  mutatePartnerReactionMessage: (_: MessageRes) => void
  confirmReadAllMessage: (rId: string) => void
}

export interface AddMessageUnreadToRoomRes {
  message_unread_count: number
}

export interface ClearMessageUnread {
  room_id: string
}

export interface AddMessageUnread {
  message_id: string
}

export interface RoomTypingRes {
  user_id: string
  user_name: string
  room_id: string
}

export type UpdateRoomInfoForm = Partial<Pick<IRoom, 'room_name' | 'room_avatar_id'>>

export type UpdateRoomInfo = UpdateRoomInfoForm & {
  room_id: string
}

export interface RoomInfoRes {
  room_id: string
  room_name: string | null
  room_avatar?: AttachmentRes | null
  room_type: RoomType
  member_count: number
}

export interface TopMemberRes {
  user_id: string
  user_avatar: string
  user_name: string
  is_online: boolean
}

export interface ReadByUserId {
  user_id: string
  created_at?: Date
}

export type MessageEmotionType = 'like' | 'angry' | 'sad' | 'laugh' | 'heart' | 'wow'

export interface LikedByUserId {
  user_id: string
  emotion: MessageEmotionType
  created_at?: Date
}

export interface IMessage {
  id: string
  room_id: string
  text: string | null
  product_id: {
    product_tmpl_id: number
    product_prod_id: number
  } | null
  order_id: number | null

  user_id: string
  promotion_id: number | null
  attachment_ids: IAttachment[]
  reply_to: {
    message_id: string
    attachment_id?: string
  }
  read_by_user_ids: ReadByUserId[]
  is_hidden: boolean
  is_deleted: boolean
  is_edited: boolean
  liked_by_user_ids: LikedByUserId[]
  deleted_at: Date | null
  created_at: Date
  updated_at: Date | null
  status?: MessageResponseStatus
}

export interface MessageUnreadCountRes {
  message_unread_count: number
  room_ids: string[]
}

export type MessageRes = Pick<
  IMessage,
  'room_id' | 'created_at' | 'product_id' | 'promotion_id' | 'order_id' | 'id'
> & {
  is_author: boolean
  author_id: string
  author_name: string
  author_avatar: AttachmentRes
  reaction_count: number
  reactions: MessageEmotionType[]
  your_reaction: MessageEmotionType | null
  attachments: AttachmentRes[]
  text: string | null
  reply_to?: MessageReply | null
  is_read: boolean
  status?: MessageResponseStatus
}

export type UserReactionRes = Omit<UserRes, 'avatar'> & {
  reaction: MessageReactionType
  avatar: string
}

export type UsersLikedMessageRes = {
  [key: string]: UserReactionRes[]
}

export interface AuthorMessage {
  author_id: string
  author_name: string
  author_avatar: AttachmentRes
}

export interface MessageUser {
  user_id: string
  user_name: string
  user_avatar: string
}

export type MessageReply = {
  author_id: string
  author_name: string
  author_avatar: AttachmentRes
  id: string
  message_id: string
  attachment?: {
    id: string
    url: string
  }
  text: string
  created_at: Date
}

export type MessageReactionType = 'like' | 'angry' | 'sad' | 'laugh' | 'heart' | 'wow'

export type SendMessage = Pick<
  IMessage,
  'text' | 'room_id' | 'product_id' | 'order_id' | 'promotion_id'
> & {
  attachment_ids?: string[]
  reply_to?: {
    id: string
    message_id?: string
    attachment_id?: string
  }
}

export type SendMessageData = MessageFormData & {
  reply_to?: MessageReply
}

export type SendMessageForm = Partial<
  Pick<SendMessage, 'attachment_ids' | 'product_id' | 'promotion_id' | 'order_id' | 'text'>
>

export interface SendMessageServiceParams {
  room_id: string
  user: IUser
  message: SendMessage
}

export interface GetMessagesInRoom extends QueryCommonParams {
  room_id: string
}

export interface LikeMessage {
  message_id: string
  emotion: MessageReactionType
}

export interface LikeMessageRes extends LikeMessage {
  user_id: string
  room_id: string
}

export interface UnlikeMessageRes extends UnlikeMessage {
  room_id: string
  user_id: string
}

export interface UnlikeMessage {
  message_id: string
  reaction: MessageReactionType
}

export interface mutateMessageReaction {
  messageId: string
  reaction: MessageReactionType
  is_author: boolean
  type: 'add' | 'delete'
}

export type MessageAttachment = {
  file: File
  previewImage: string
  id: string
}

export interface MessageProductId {
  product_tmpl_id: number
  product_prod_id: number
}

export interface MessageForm {
  attachments?: MessageAttachment[] | AttachmentRes[]
  text?: string | undefined
  product_id?: MessageProductId | null
  promotion_id?: number | null
  order_id?: number | null
}

export type MessageFormData = MessageForm & {
  room_id: string
  reply_to?: MessageReply
}

export type UserItemRes = {
  user_id: string
  is_online: string
  user_name: string
  user_avatar: string
}

export type MessageDetailRes = MessageRes & {
  read_by: UserItemRes[]
  un_read_by: UserItemRes[]
}
