import { POST_ROLES_OPTIONS } from '@/constants'
import { convertViToEn } from '@/helper'
import { postFormSchema } from '@/schema'
import { CreatePost, Post } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Button } from '../button'
import { InputField, SelectField, TextareaField } from '../inputs'
import { UploadSignleFile } from '../upload'
import { PostCategoryOptionForm } from './postCategoryOptionForm'

interface createPostFormProps {
  onSubmit?: (params: CreatePost) => void
  defaultValue?: Post
  type?: 'create' | 'update'
  onBack?: () => void
}

export const CreatePostForm = ({
  onSubmit,
  type = 'create',
  defaultValue,
}: createPostFormProps) => {
  const [image, setImage] = useState<string>('')

  const {
    handleSubmit,
    control,
    formState: { isValid },
    setValue,
  } = useForm<CreatePost>({
    resolver: yupResolver(postFormSchema),
    mode: 'all',
  })

  const onSubmitHandler = (data: any) => {
    if (!data?.categories) {
      toast.error('Vui lòng chọn danh mục cho bài viết')
      return
    }

    onSubmit &&
      onSubmit({
        ...data,
        slug: convertViToEn(data?.title.trim().toLowerCase()).replace(/\s+/g, '-'),
        categories: data?.categories,
        role: data?.role?.value !== '' ? data?.role?.value : null,
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="mb-12">
        <p className="text_md mb-12">Hình đại diện</p>

        <Controller
          control={control}
          name="attachment_id"
          defaultValue={defaultValue?.id}
          render={({ field: { onChange } }) => (
            <div className="flex justify-center">
              <UploadSignleFile
                id="attachment_id"
                defaultImage={image || defaultValue?.thumbnail?.url}
                getImage={(val) => {
                  setImage(val?.url)
                  onChange(val?.id)
                }}
              />
            </div>
          )}
        />
      </div>

      <div className="mb-12">
        <PostCategoryOptionForm
          type="multiple"
          onChecked={(data) => {
            setValue('categories', [...data] || [])
          }}
        />
      </div>

      <div className="mb-12">
        <SelectField
          defaultValue={POST_ROLES_OPTIONS?.find((item: any) => item.value === defaultValue?.role)}
          control={control}
          name="role"
          placeholder="Phân loại người xem"
          label="Phân loại"
          options={POST_ROLES_OPTIONS}
        />
      </div>

      <div className="mb-12">
        <InputField
          control={control}
          name="title"
          placeholder="Tiêu đề"
          label="Tiêu đề"
          defaultValue={defaultValue?.title}
          required={true}
        />
      </div>

      <div className="mb-12">
        <TextareaField
          rows={4}
          control={control}
          name="short_content"
          placeholder="Tóm tắt nội dung"
          label="Tóm tắt nội dung"
          defaultValue={defaultValue?.short_content}
          required={true}
        />
      </div>

      <div className="flex justify-center">
        <Button
          title={type === 'create' ? 'Tạo tin tức' : 'Cập nhật'}
          className={classNames(
            `w-[25%] min-w-[150px] py-6 border border-primary rounded-lg`,
            isValid ? '' : 'opacity-50 hover:opacity-50'
          )}
          textClassName="text-base font-bold text-primary"
        />
      </div>
    </form>
  )
}
