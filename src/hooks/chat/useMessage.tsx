import { LIMIT_MESSAGES, SWR_KEY } from '@/constants'
import { isArrayHasValue } from '@/helper'
import { chatAPI } from '@/services'
import { RootState } from '@/store'
import {
  AttachmentRes,
  LikeMessage,
  LikeMessageRes,
  ListRes,
  MessageAttachment,
  MessageRes,
  mutateMessageReaction,
  SendMessage,
  SendMessageData,
  UnlikeMessage,
  UnlikeMessageRes,
  UseParams,
} from '@/types'
import { AxiosResponse } from 'axios'
import produce from 'immer'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'
import { v4 as uuidv4 } from 'uuid'

interface IUseMessage {
  data: ListRes<MessageRes[]> | undefined
  isFetchingMore: boolean
  isValidating: boolean
  isFirstLoading: boolean
  getMoreMessages: Function
  sendMessage: (params: UseParams<SendMessageData, MessageRes>) => void
  resendMessage: (message: MessageRes) => void
  likeMessage: (params: LikeMessage, cb?: (params: LikeMessageRes) => void) => void
  unlikeMessage: (params: UnlikeMessage, cb?: (params: UnlikeMessage) => void) => void
}

interface UseMessageProps {
  roomId: string
}

export const useMessage = ({ roomId }: UseMessageProps): IUseMessage => {
  const userInfo = useSelector((state: RootState) => state.chat.profile)
  const [isFetchingMore, setFetchingMore] = useState<boolean>(false)

  const { data, mutate, isValidating, error } = useSWR<ListRes<MessageRes[]>>(
    `${SWR_KEY.get_messages_in_room}${roomId ? roomId : ''}`,
    () =>
      chatAPI.getMessagesInRoom({ room_id: roomId || '' }).then((res) => {
        return res?.data || []
      })
  )

  const sendMessage = async (_: UseParams<SendMessageData, MessageRes>) => {
    const { onSuccess, params, onError } = _
    const messageRes = createMessageRes(params)
    appendMessage(messageRes)
    setTimeout(() => {
      document.querySelector(`.message-item-${messageRes.id}`)?.scrollIntoView()
    }, 0)

    try {
      const messageParams = await getMessage(params)

      const res: any = await chatAPI.sendMessage(messageParams)

      if (res?.success) {
        appendMessage({ ...res.data, status: 'fulfilled' })
        onSuccess?.(res.data)
      } else {
        appendMessage({ ...messageRes, status: 'rejected' })
        onError?.()
      }
    } catch (error) {
      appendMessage({ ...messageRes, status: 'rejected' })
      onError?.()
      console.log(error)
    }
  }

  const getMessage = async (data: SendMessageData): Promise<SendMessage> => {
    let attachment_ids: string[] = []

    if (data.attachments?.length) {
      const { attachments } = data

      if ((attachments as MessageAttachment[])?.[0]?.file) {
        const formData = new FormData()

        ;(attachments as MessageAttachment[]).forEach((item) => {
          ;(formData as FormData).append('file', item.file)
        })

        // get attachments from API response
        try {
          const res: any =
            attachments?.length > 1
              ? await chatAPI.uploadMultipleImage(formData)
              : await chatAPI.uploadSingleImage(formData)

          if (res?.success) {
            //response from api upload multiple is an array
            //response from api upload signle is an object

            if (res?.data?.length > 1) {
              res?.data?.forEach((item: AttachmentRes) => attachment_ids.push(item?.id))
            } else {
              attachment_ids.push(res?.data?.id) || []
            }
          }
        } catch (error) {
          console.log(error)
        }
      } else if ((attachments as AttachmentRes[])?.[0]?.id) {
        attachment_ids = (attachments as AttachmentRes[]).map((item) => item.id)
      }
    }

    return {
      room_id: data.room_id,
      attachment_ids: attachment_ids.length > 0 ? attachment_ids : undefined,
      reply_to: data?.reply_to
        ? {
            message_id: data?.reply_to?.message_id,
            id: data?.reply_to?.message_id || '',
            attachment_id: data.reply_to?.attachment?.id,
          }
        : undefined,
      text: data?.text || null,
      product_id: data?.product_id || null,
      promotion_id: data?.promotion_id || null,
      order_id: data?.order_id || null,
    }
  }

  const appendMessage = (params: MessageRes) => {
    if (!data) return

    mutate(
      produce(data, (draft) => {
        ;(draft?.data || []).unshift(params)
        draft.offset += 1
        draft.total += 1
      }),
      false
    )
  }

  const createMessageRes = (data: SendMessageData): MessageRes => {
    let attachments: AttachmentRes[] = []
    if (data?.attachments?.length) {
      const { attachments: attachmentData } = data
      if ((attachmentData as AttachmentRes[])?.[0]?.id) {
        attachments = attachmentData as AttachmentRes[]
      } else if ((attachmentData as MessageAttachment[])?.[0]?.file) {
        // attachments = (attachmentData as MessageAttachment[]).map((item) => ({
        //   url: item.previewImage,
        //   thumbnail_url: item.previewImage,
        //   attachment_id: uuidv4(),
        //   attachment_type: 'image',
        // }))

        console.log('problem here...')
      }
    }

    return {
      attachments,
      created_at: new Date(),
      is_author: true,
      is_read: false,
      reaction_count: 0,
      id: uuidv4(),
      text: data?.text || null,
      room_id: data.room_id,
      reply_to: data?.reply_to || null,
      product_id: data?.product_id || null,
      promotion_id: data?.promotion_id || null,
      order_id: data?.order_id || null,
      status: 'pending',
      reactions: [],
      your_reaction: null,
      author_id: userInfo?.user_id || '',
      author_name: userInfo?.user_name || '',
      author_avatar: {
        id: userInfo?.avatar?.attachment_id || '',
        attachment_type: 'image',
        thumbnail_url: userInfo?.avatar?.thumbnail_url || '',
        url: userInfo?.avatar?.url || '',
      },
    }
  }

  const getMoreMessages = async () => {
    if (isFetchingMore || !roomId || !data) return
    try {
      setFetchingMore(true)
      const res: AxiosResponse<ListRes<MessageRes[]>> = await chatAPI.getMessagesInRoom({
        offset: (data?.offset || 0) + LIMIT_MESSAGES,
        limit: LIMIT_MESSAGES,
        room_id: roomId,
      })

      setFetchingMore(false)

      const messagesData = res?.data

      mutate(
        produce(data, (draft) => {
          draft.offset += LIMIT_MESSAGES
          draft.has_more = messagesData.has_more
          draft.data = [...draft.data, ...(messagesData?.data || [])]
        }),
        false
      )

      const lastMessageId = messagesData?.data?.[messagesData?.data?.length - 1]?.id

      if (lastMessageId)
        setTimeout(() => {
          document.querySelector(`.message-item-${lastMessageId}`)?.scrollIntoView()
        }, 0)
    } catch (error) {
      console.log(error)
      setTimeout(() => {
        setFetchingMore(false)
      }, 100)
    }
  }

  const resendMessage = (params: MessageRes) => {
    const args: SendMessageData = {
      attachments: params?.attachments || [],
      product_id: params?.product_id || null,
      promotion_id: params?.promotion_id || null,
      order_id: params?.order_id || null,
      reply_to: params?.reply_to?.message_id
        ? {
            author_id: params?.author_id || '',
            author_name: params?.author_name || '',
            id: params?.id || '',
            message_id: params?.reply_to?.message_id || '',
            created_at: params.reply_to.created_at,
            text: params.reply_to.text,
            attachment: params.reply_to?.attachment,
            author_avatar: params?.author_avatar,
          }
        : undefined,

      text: params?.text || undefined,
      room_id: params.room_id,
    }

    deleteMessageFromList(params.id)

    sendMessage({ params: args, onSuccess: () => {} })
  }

  const deleteMessageFromList = (id: string) => {
    if (!data?.data?.length) return
    mutate(
      produce(data, (draft) => {
        draft.data = draft.data.filter((item) => item.id !== id)
      }),
      false
    )
  }

  const findMessageIndex = (message_id: string): number => {
    const index =
      data && data?.data?.length > 0 ? data?.data.findIndex((item) => item.id === message_id) : -1

    if (index === -1) {
      mutate()
    }

    return index
  }

  const mutateMessageReaction = ({
    messageId,
    reaction,
    is_author,
    type,
  }: mutateMessageReaction) => {
    if (!isArrayHasValue(data?.data || [])) return

    const index = findMessageIndex(messageId)
    if (index === -1) return

    const message = data?.data[index]

    console.log('run mutate')

    mutate(
      produce(data, (draft: any) => {
        const messageDraft = draft.data[index]

        if (type === 'add') {
          if (!message?.your_reaction) {
            messageDraft.reaction_count += 1
            messageDraft?.reactions.push(reaction)
            messageDraft.your_reaction = reaction
          } else if (message.your_reaction && message.your_reaction !== reaction) {
            messageDraft.your_reaction = reaction

            const _index = message.reactions?.findIndex((e) => e === message.your_reaction)
            if (_index !== -1) {
              messageDraft.reactions[_index] = reaction
            }
          }
        } else {
          if (message?.reaction_count || 0 > 0) {
            messageDraft.reaction_count -= 1
          }

          const _index = message?.reactions?.findIndex((e) => e === reaction) || -1
          if (_index !== -1) {
            messageDraft.reactions = messageDraft.reactions
              .slice(0, _index)
              .concat(messageDraft.reactions.slice(_index + 1))
          }

          if (is_author) {
            messageDraft.your_reaction = null
          }
        }
      }),
      false
    )
  }

  const unlikeMessage = async (params: UnlikeMessage, cb?: (_: UnlikeMessageRes) => void) => {
    mutateMessageReaction({
      messageId: params.message_id,
      reaction: params.reaction,
      is_author: true,
      type: 'delete',
    })

    const res: any = await chatAPI.unlikeMessage(params.message_id)

    if (res?.success) {
      cb?.(res.data)
    }
  }

  const likeMessage = async (params: LikeMessage, cb?: (_: LikeMessageRes) => void) => {
    mutateMessageReaction({
      messageId: params.message_id,
      reaction: params.emotion,
      is_author: true,
      type: 'add',
    })

    const res: any = await chatAPI.likeMessage(params)

    if (res?.success) {
      cb?.(res.data)
    }
  }

  return {
    data,
    sendMessage,
    isFetchingMore,
    isValidating,
    isFirstLoading: error === undefined && data === undefined,
    getMoreMessages,
    resendMessage,
    likeMessage,
    unlikeMessage,
  }
}
