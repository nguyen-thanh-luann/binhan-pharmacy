import { uploadAPI } from '@/services'
import { useState } from 'react'

interface useUploadRes {
  uploadSingleImage: (params: File, cb?: Function) => void
  isUploading?: boolean
}

export const useUpload = (): useUploadRes => {
  const [isUploading, setUploading] = useState<boolean>(false)

  const uploadSingleImage = async (params: File, handleSuccess?: Function) => {
    const formData = new FormData()
    formData.append('file', params)
    try {
      setUploading(true)

      const res = await uploadAPI.uploadSingleImage(formData)

      setUploading(false)
      handleSuccess?.(res?.data)
    } catch (err) {
      console.log(err)
      setUploading(false)
    }
  }
  return {
    uploadSingleImage,
    isUploading,
  }
}
