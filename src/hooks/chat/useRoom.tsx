import produce from 'immer'
import { useState } from 'react'
import { getLastMessage } from '@/helper'
import { chatAPI } from '@/services'
import { AxiosResponse } from 'axios'
import useSWR, { KeyedMutator } from 'swr'
import { ChangeStatusOfRoom, ListRes, MessageRes, RoomDetailRes, RoomRes } from '@/types'
import { LIMIT_ROOM_CHAT, SWR_KEY } from '@/constants'

type UseRoomRes = {
  data: ListRes<RoomRes[]> | undefined
  hasMore: boolean
  isValidating: boolean
  isFirstLoading: boolean
  isFetchingMore: boolean
  searching: boolean
  mutate: KeyedMutator<ListRes<RoomRes[]>>
  messageUnreadhandler: (_: MessageRes) => void
  changeStatusOfRoom: (_: ChangeStatusOfRoom) => void
  appendLastMessage: (_: MessageRes) => void
  changeOrderAndAppendLastMessage: (_: MessageRes) => void
  clearMessagesUnreadFromRoom: (room_id: string) => void
  fetchMoreRooms: () => void
  addRoom: (room: RoomDetailRes) => void
  deleteRoom: (rId: string) => void
  searchRoom: (keyword: string) => void
  deleteRoomByCompoundingCarId: (rId: number) => void
}

export const useRoom = (roomId?: string): UseRoomRes => {
  const { isValidating, mutate, data, error } = useSWR<ListRes<RoomRes[]>>(
    SWR_KEY.get_room_list,
    () =>
      chatAPI
        .getRoomList({ limit: LIMIT_ROOM_CHAT })
        .then((res: AxiosResponse<ListRes<RoomRes[]>>) => {
          setHasMore(res.data?.has_more || false)
          return res.data
        })
  )

  const [hasMore, setHasMore] = useState<boolean>(false)
  const [isFetchingMore, setFetchingMore] = useState<boolean>(false)
  const [searching, setSearching] = useState<boolean>(false)

  const messageUnreadhandler = (params: MessageRes) => {
    if (!data?.data?.length) return

    const index = getRoomIndex(params.room_id)
    if (index === -1) return

    if (roomId !== params.room_id) {
      const lastMessage = getLastMessage(params)
      mutate(
        produce(data, (draft: any) => {
          const room = { ...draft.data[index], last_message: params }
          if (data?.data?.[0]?.id === params?.room_id) {
            draft.data[index] = {
              ...room,
              message_unread_count: room.message_unread_count + 1,
              last_message: lastMessage,
            }
          } else {
            const newRooms = draft.data.filter((item: any) => item.room_id !== params.room_id)
            draft.data = [
              {
                ...room,
                message_unread_count: room.message_unread_count + 1,
                last_message: lastMessage,
              },
              ...newRooms,
            ]
          }
        }),
        false
      )
    }
  }

  const roomDetailResToRoomListRes = (params: RoomDetailRes): RoomRes => {
    return {
      is_online: params.is_online,
      member_count: params.member_count,
      message_unread_count: 0,
      id: params.id,
      name: params.name,
      room_type: params.room_type,
      last_message: null,
      avatar: params?.room_avatar?.thumbnail_url,
      offline_at: new Date(),
      top_members: params?.members?.data?.map((item) => ({
        avatar: item.avatar.thumbnail_url,
        user_name: item.user_name,
        user_id: item.user_id,
        phone: item?.phone,
        offline_at: '',
      })),
    }
  }

  const addRoom = (room: RoomDetailRes) => {
    mutate(
      produce(data, (draft) => {
        ;(draft?.data || []).unshift(roomDetailResToRoomListRes(room))
      }),
      false
    )
  }

  const deleteRoom = (rId: string) => {
    if (!data?.data?.length) return

    mutate(
      produce(data, (draft) => {
        draft.data = draft.data.filter(({ id }) => id !== rId)
      }),
      false
    )
  }

  const deleteRoomByCompoundingCarId = (cId: number) => {
    if (!data?.data?.length) return

    mutate(
      produce(data, (draft: any) => {
        draft.data = draft.data.filter(({ compounding_car_id }: any) => compounding_car_id !== cId)
      }),
      false
    )
  }

  const fetchMoreRooms = async () => {
    if (!data?.data?.length) return

    try {
      setFetchingMore(true)
      const res: AxiosResponse<ListRes<RoomRes[]>> = await chatAPI.getRoomList({
        limit: LIMIT_ROOM_CHAT,
        offset: (data?.offset || 0) + LIMIT_ROOM_CHAT,
      })
      const dataRes = res?.data
      setFetchingMore(false)
      setHasMore(dataRes?.has_more || false)
      mutate(
        produce(data, (draft: any) => {
          ;(draft.has_more = dataRes.has_more), (draft.limit = dataRes.limit)
          draft.offset = dataRes.offset
          draft.data = draft.data.concat(dataRes.data)
        }),
        false
      )
    } catch (error) {
      setFetchingMore(false)
    }
  }

  const searchRoom = async (keyword: string) => {
    try {
      setSearching(true)
      const res: AxiosResponse<ListRes<RoomRes[]>> = await chatAPI.getRoomList({
        keyword,
      })

      const dataRes = res?.data
      setSearching(false)

      mutate(
        produce(data, (draft: any) => {
          ;(draft.has_more = dataRes.has_more), (draft.limit = dataRes.limit)
          draft.offset = dataRes.offset
          draft.data = dataRes.data
        }),
        false
      )
    } catch (error) {
      console.log(error)
      setSearching(false)
    }
  }

  const getRoomIndex = (roomId: string): number => {
    const index =
      data && data?.data?.length > 0 ? data.data.findIndex((item) => item.id === roomId) : -1

    if (index === -1) {
      mutate()
    }
    return index
  }

  const clearMessagesUnreadFromRoom = async (roomId: string) => {
    if (!data?.data?.length) return
    const index = getRoomIndex(roomId)
    if (index === -1) return

    const room = { ...data.data[index] }
    if (!room.message_unread_count || room.message_unread_count <= 0) return

    mutate(
      produce(data, (draft: any) => {
        draft.data[index].message_unread_count = 0
      }),
      false
    )
  }

  const appendLastMessage = (params: MessageRes) => {
    if (!data?.data?.length) return

    mutate(
      produce(data, (draft: any) => {
        const index = getRoomIndex(params.room_id)
        if (index === -1) return
        draft.data[index].last_message = getLastMessage(params)
      }),
      false
    )
  }

  const changeOrderAndAppendLastMessage = (params: MessageRes) => {
    if (!data?.data?.length) return

    const index = getRoomIndex(params.room_id)
    if (index === -1) return

    const last_message = getLastMessage(params)

    if (data?.data?.[0]?.id === params.room_id) {
      mutate(
        produce(data, (draft: any) => {
          draft.data[index].last_message = last_message
        }),
        false
      )
    } else {
      mutate(
        produce(data, (draft: any) => {
          const newRooms = draft.data.filter((item: any) => item.id !== params.room_id)
          draft.data = [{ ...draft.data[index], last_message }, ...newRooms]
        }),
        false
      )
    }
  }

  const changeStatusOfRoom = (params: ChangeStatusOfRoom) => {
    if (!data?.data?.length) return

    if (params.type === 'login') {
      mutate(
        produce(data, (draft) => {
          draft.data = draft.data.map((item) => {
            return params.room_ids.includes(item.id) ? { ...item, is_online: true } : item
          })
        }),
        false
      )
    } else {
      mutate(
        produce(data, (draft) => {
          draft.data = draft.data.map((item) => {
            if (!params.room_ids.includes(item.id)) {
              return item
            }
            if (
              item.room_type === 'single' ||
              (item?.top_members || [])?.filter((item: any) => item?.is_online)?.length <= 2
            ) {
              return { ...item, is_online: false }
            }
            return item
          })
        }),
        false
      )
    }
  }

  return {
    data,
    hasMore,
    isFetchingMore,
    isFirstLoading: error === undefined && data === undefined,
    isValidating,
    searching,
    mutate,
    fetchMoreRooms,
    appendLastMessage,
    changeStatusOfRoom,
    messageUnreadhandler,
    changeOrderAndAppendLastMessage,
    clearMessagesUnreadFromRoom,
    addRoom,
    deleteRoom,
    deleteRoomByCompoundingCarId,
    searchRoom,
  }
}
