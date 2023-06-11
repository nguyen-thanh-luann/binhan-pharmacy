import { postTagFormSchema } from '@/schema'
import { CreatePostTagReq, PostTag } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import { Button } from '../button'
import { TextareaField } from '../inputs'

interface createTagFormProps {
  onSubmit?: (params: CreatePostTagReq) => void
  defaultValue?: PostTag
  type?: 'create' | 'update'
  isActive?: boolean
  onActive?: () => void
}

export const CreateTagForm = ({ onSubmit, type = 'create', defaultValue }: createTagFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<CreatePostTagReq>({
    resolver: yupResolver(postTagFormSchema),
    mode: 'all',
  })

  const onSubmitHandler = (data: any) => {
    onSubmit && onSubmit(data)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-12">
          <TextareaField
            rows={3}
            control={control}
            name="content"
            placeholder="Nội dung"
            label="Nhập nội dung"
            labelClassName="!text-md"
            defaultValue={defaultValue?.content}
            required={true}
          />
        </div>

        <div className="flex justify-center">
          <Button
            title={type === 'create' ? 'Thêm tag' : 'Cập nhật'}
            className={classNames(
              `w-[25%] min-w-[150px] py-6 border border-primary rounded-lg`,
              isValid ? '' : 'opacity-50 hover:opacity-50'
            )}
            textClassName="text-base font-bold text-primary"
          />
        </div>
      </form>
    </div>
  )
}
