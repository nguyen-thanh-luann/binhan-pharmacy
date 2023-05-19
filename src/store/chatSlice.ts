import { WebsocketEmitEvents } from "@/constants"
import { chatAPI } from "@/services"
import {
  MessageAttachment,
  MessageForm,
  MessageFormData,
  MessageReply,
  MessageUnreadCountRes,
  PayloadType, RoomTypingRes, UserRes
} from "@/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Socket } from "socket.io-client"

export const fetchMessageUnreadCount = createAsyncThunk(
  "chat/fetchMessageUnreadCount",
  async () => (await chatAPI.getMessageUnreadCount())?.data
)

interface ChatSlice {
  currentTyping: RoomTypingRes | undefined
  socket: Socket<any> | undefined
  messageFormData: MessageFormData[]
  profile: UserRes | undefined
  messageUnreadCount: MessageUnreadCountRes | undefined
  currentMessageEmotionId: string | undefined
  currentDetailMessageId: string | undefined
  currentProfileId: string | undefined
  currentRoomId: string | undefined
  currentPreviewImages: string[] | undefined
  currentMessageFormDataIndex: number
}

const initialState: ChatSlice = {
  currentTyping: undefined,
  messageUnreadCount: undefined,
  socket: undefined,
  messageFormData: [],
  profile: undefined,
  currentMessageEmotionId: undefined,
  currentDetailMessageId: undefined,
  currentProfileId: undefined,
  currentRoomId: undefined,
  currentPreviewImages: undefined,
  currentMessageFormDataIndex: -1,
}


const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentTyping: (state, { payload }: PayloadType<RoomTypingRes | undefined>) => {
      state.currentTyping = payload
    },

    setMessageUnreadCount: (state, { payload }: { payload: MessageUnreadCountRes | undefined }) => {
      state.messageUnreadCount = payload
    },

    updateMessageUnreadCount: (
      state,
      { payload }: { payload: { room_id: string; type: "increase" | "decrease" } }
    ) => {
      if (!state?.messageUnreadCount?.room_ids) return
      const { room_id, type } = payload

      if (type === "decrease") {
        const data = state.messageUnreadCount?.room_ids?.filter((id) => id !== room_id)
        state.messageUnreadCount.room_ids = data
        state.messageUnreadCount.message_unread_count = data?.length
      } else {
        const isDuplicate = state.messageUnreadCount?.room_ids?.includes(room_id)
        if (isDuplicate) return

        state.messageUnreadCount.room_ids.push(room_id)
        state.messageUnreadCount.message_unread_count += 1
      }
    },

    setCurrentMessageEmotionId: (state, { payload }: PayloadType<string | undefined>) => {
      state.currentMessageEmotionId = payload
    },

    setCurrentPreviewImages: (state, { payload }: PayloadType<string[] | undefined>) => {
      state.currentPreviewImages = payload
    },

    setCurrentRoomId: (state, { payload }: PayloadType<string | undefined>) => {
      
      if (payload === state.currentRoomId) return

      if (state.currentTyping?.room_id === payload) {
        state.currentTyping = undefined
      }

      if (state.currentRoomId) {
        state.socket?.emit(WebsocketEmitEvents.LEAVE_ROOM, state.currentRoomId)
      }

      state.currentRoomId = payload

      if (payload) {
        //Sự kiện dùng để tham gia vào phòng chat
        state.socket?.emit(WebsocketEmitEvents.JOIN_ROOM, payload)

        const index = (state?.messageFormData || [])?.findIndex((item) => item.room_id === payload)

        if (index === -1) {
          state.currentMessageFormDataIndex = state?.messageFormData?.length || 0

          state.messageFormData.push({
            room_id: payload,
            text: "",
          })
        } else {
          state.currentMessageFormDataIndex = index
        }
      } else {
        state.currentMessageFormDataIndex = -1
      }
    },

    setCurrentProfileId: (state, { payload }: PayloadType<string | undefined>) => {
      state.currentProfileId = payload
    },

    setcurrentDetailMessageId: (state, { payload }: PayloadType<string | undefined>) => {
      state.currentDetailMessageId = payload
    },

    setSocketInstance: (state, { payload }: PayloadType<Socket<any> | undefined>) => {
      state.socket = payload as any
    },

    setMessageDataInRoom: (state: any, { payload }: PayloadType<MessageForm>) => {
      const index = state.currentMessageFormDataIndex
      if (index === -1) return

      state.messageFormData[index] = { ...state.messageFormData[index], ...payload }
    },

    resetMessageDataInRoom: (state: any) => {
      const index = state.currentMessageFormDataIndex
      if (index === -1) return

      state.messageFormData[index] = {
        room_id: state.messageFormData[index].room_id,
        text: "",
      }
    },

    addMessageAttachment: (state: any, { payload }: PayloadType<MessageAttachment[]>) => {
      const index = state.currentMessageFormDataIndex
      if (index === -1) return

      if (!state?.messageFormData[index]?.attachments?.length) {
        state.messageFormData[index].attachments = payload
      } else {
        ;(state.messageFormData[index].attachments as any[]) = [
          ...(state.messageFormData[index]?.attachments || []),
          ...payload,
        ]
      }
    },

    setMessageReply: (state: any, { payload }: PayloadType<MessageReply | undefined>) => {
      const index = state.currentMessageFormDataIndex
      if (index === -1) return

      state.messageFormData[index].reply_to = payload
    },

    setMessageText: (state: any, { payload }: PayloadType<string>) => {
      const index = state.currentMessageFormDataIndex
      if (index !== -1) {
        state.messageFormData[index].text = payload
      }
    },

    deleteMessageAttachment: (state: any, { payload }: PayloadType<{ imageId: string }>) => {
      if (!state.currentRoomId) return
      const index = state.currentMessageFormDataIndex
      if (index === -1) return

      state.messageFormData[index].attachments = (
        state?.messageFormData[index]?.attachments as MessageAttachment[]
      )?.filter((item) => item.id !== payload.imageId)
    },

    resetChatState: (state) => {
      state.currentTyping = undefined
      state.socket = undefined
      state.messageFormData = []
      state.profile = undefined
      state.messageUnreadCount = undefined
      state.currentMessageEmotionId = undefined
      state.currentDetailMessageId = undefined
      state.currentProfileId = undefined
      state.currentRoomId = undefined
      state.currentPreviewImages = undefined
      state.currentMessageFormDataIndex = -1
    },
  },


})

export default chatSlice.reducer
export const {
  setCurrentTyping,
  setSocketInstance,
  resetMessageDataInRoom,
  setMessageDataInRoom,
  addMessageAttachment,
  deleteMessageAttachment,
  setMessageText,
  setMessageReply,
  setCurrentMessageEmotionId,
  setcurrentDetailMessageId,
  setCurrentProfileId,
  setCurrentRoomId,
  setCurrentPreviewImages,
  setMessageUnreadCount,
  updateMessageUnreadCount,
  resetChatState,
} = chatSlice.actions
