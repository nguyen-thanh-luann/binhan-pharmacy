import {
  CreateAttachmentReq
} from '@/types'
import axiosClient from '.'

const uploadAPI = {
  createAttachment: (params?: CreateAttachmentReq) => {
    return axiosClient.post('/cloud_storage_controller/create_attachment_data', {
      params: {
        ...params,
      },
    })
  },

}

export { uploadAPI }

