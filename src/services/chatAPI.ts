import {
  changeUserStatusParams,
  ChatAxiosResponse,
  CreateGroupChat,
  CreateSingleChat,
  CreateUserParams,
  LikeMessage,
  LoginFormParams,
  MessageUnreadCountRes,
  QueryCommonParams,
  SendMessage,
  UpdateRoomInfo,
  UserRes,
} from '@/types'
import { AxiosResponse } from 'axios'
import axiosClient from '.'

const chatAPI = {
  createUser: (params: CreateUserParams): Promise<ChatAxiosResponse<UserRes>> => {
    return axiosClient.post('/chatDMS/api/user', params)
  },

  createSingleChat: (params: CreateSingleChat) => {
    return axiosClient.post('/chatDMS/api/room/single', params)
  },

  createGroupChat: (params: CreateGroupChat) => {
    return axiosClient.post('/chatDMS/api/room/group', params)
  },

  getMessageUnreadCount: (): Promise<AxiosResponse<MessageUnreadCountRes>> => {
    return axiosClient.get('/chatDMS/api/message/message_unread_count')
  },

  getRoomList: ({ limit = 30, offset = 0, keyword }: QueryCommonParams & { keyword?: string }) => {
    return axiosClient.get(
      `/chatDMS/api/room?limit=${limit}&offset=${offset}${`&keyword=${keyword ? keyword : ''}`}`
    )
  },

  getRoomDetail: (roomId: string) => {
    return axiosClient.get(`/chatDMS/api/room/${roomId}`)
  },

  getMessagesPinnedInRoom: ({
    limit = 30,
    offset = 0,
    room_id,
  }: QueryCommonParams & { room_id: string }) => {
    return axiosClient.get(
      `/chatDMS/api/room/${room_id}/messages_pinned?limit=${limit}&offset=${offset}`
    )
  },

  getMessagesInRoom: ({
    limit = 30,
    offset = 0,
    room_id,
  }: QueryCommonParams & { room_id: string }) => {
    return axiosClient.get(`/chatDMS/api/room/${room_id}/messages?limit=${limit}&offset=${offset}`)
  },

  getMembersInRoom: ({
    limit = 30,
    offset = 0,
    room_id,
  }: QueryCommonParams & { room_id: string }) => {
    return axiosClient.get(`/chatDMS/api/room/${room_id}/members?limit=${limit}&offset=${offset}`)
  },

  sendMessage: (params: SendMessage) => {
    return axiosClient.post('/chatDMS/api/message', params)
  },

  getMessageById: (msgId: string) => {
    return axiosClient.get(`/chatDMS/api/message/${msgId}`)
  },

  getTagMessageList: ({ limit = 30, offset = 0 }: QueryCommonParams) => {
    return axiosClient.get(`/chatDMS/api/tag?limit=${limit}&offset=${offset}`)
  },

  changeUserStatus: (params: changeUserStatusParams) => {
    return axiosClient.patch('/chatDMS/api/status', params)
  },
  getUserData: () => {
    return axiosClient.get('/chatDMS/api/user')
  },

  softDeleteRoomByCompoundingCarId: (
    compounding_car_id: number
  ): Promise<ChatAxiosResponse<{ compounding_car_id: number }>> => {
    return axiosClient.delete(`/chatDMS/api/room/compounding_car_id/${compounding_car_id}`)
  },

  restoreRoom: (room_id: string) => {
    return axiosClient.post(`/chatDMS/api/room/restore/${room_id}`)
  },

  confirmReadAllMessageInRoom: (room_id: string) => {
    return axiosClient.patch(`/chatDMS/api/message/read_all`, { room_id })
  },

  login: (params: LoginFormParams) => {
    return axiosClient.post(`/chatDMS/api/user/login`, params)
  },

  logout: () => {
    return axiosClient.post(`/chatDMS/api/user/logout`)
  },

  refreshToken: () => {
    return axiosClient.post(`/chatDMS/api/user/refresh`)
  },

  likeMessage: (params: LikeMessage) => {
    return axiosClient.post(`/chatDMS/api/message/like`, params)
  },

  unlikeMessage: (messageId: string) => {
    return axiosClient.delete(`/chatDMS/api/message/unlike/${messageId}`)
  },

  getUsersLikedMessage: (messageId: string) => {
    return axiosClient.get(`/chatDMS/api/message/users/like/${messageId}`)
  },

  getUsersReadMessage: (messageId: string) => {
    return axiosClient.get(`/chatDMS/api/message/users/read/${messageId}`)
  },

  uploadSingleImage: (formData: FormData) => {
    return axiosClient.post(`/chatDMS/api/attachment/single`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  uploadMultipleImage: (formData: FormData) => {
    return axiosClient.post(`/chatDMS/api/attachment/multiple`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  uploadMultipleVideo: (formData: FormData) => {
    return axiosClient.post(`/chatDMS/api/attachment/video/multiple`, formData)
  },

  uploadSingleVideo: (formData: FormData) => {
    return axiosClient.post(`/attachment/video/single`, formData)
  },

  deleteAttachment: (id: string) => {
    return axiosClient.delete(`/chatDMS/api/attachment/${id}`)
  },

  getDetailMessage: (id: string) => {
    return axiosClient.get(`/chatDMS/api/message/detail/${id}`)
  },

  leaveRoomByCompoundingCarId: (compounding_car_id: number) => {
    return axiosClient.delete(`/chatDMS/api/room/compounding_car_id/${compounding_car_id}/leave`)
  },

  joinRoomByCompoundingCarId: (compounding_car_id: number) => {
    return axiosClient.post(`/chatDMS/api/room/compounding_car_id/${compounding_car_id}/join`)
  },

  updateRoomInfo: (params: UpdateRoomInfo) => {
    const { room_id, ...rest } = params
    return axiosClient.patch(`/chatDMS/api/room/info/${room_id}`, rest)
  },
}

export { chatAPI }
