import { CreateAttachmentReq } from '@/types'
import axiosClient from '.'

const uploadAPI = {
  createAttachment: (params?: CreateAttachmentReq) => {
    return axiosClient.post('/cloud_storage_controller/create_attachment_data', {
      params: {
        ...params,
      },
    })
  },

  // upload image with chat service
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

  deleteAttachment: (id: string) => {
    return axiosClient.delete(`/chatDMS/api/attachment/${id}`)
  },
}

export { uploadAPI }
