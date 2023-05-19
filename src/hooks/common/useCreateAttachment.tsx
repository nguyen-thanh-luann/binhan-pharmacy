import { CreateAttachmentRes, CreateAttachmentType } from '@/types'
import { useAsync } from './useAsync'
import { uploadAPI } from '@/services'

interface useCreateAttachmentProps {
  type?: CreateAttachmentType
  file: string
  onSuccess?: (res: CreateAttachmentRes[]) => void
}

export const useCreateAttachment = () => {
  const { asyncHandler } = useAsync()

  const createAttachment = ({
    file,
    type = 'image/png',
    onSuccess: handleSuccess,
  }: useCreateAttachmentProps) => {
    asyncHandler({
      fetcher: uploadAPI.createAttachment({
        attachments: [
          {
            type,
            file,
          },
        ],
      }),
      onSuccess: (res: CreateAttachmentRes[]) => {
        handleSuccess?.(res)
      },
      config: {
        showSuccessMsg: false,
        errorMsg: 'Có lỗi khi tải ảnh lên!',
      },
    })
  }

  return {
    createAttachment,
  }
}
