import { POST_ROLES_OPTIONS } from '@/constants'
import { convertViToEn } from '@/helper'
import { postFormSchema } from '@/schema'
import { CreatePost, OptionType, PostDetail } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '../button'
import { InputField, SelectField, TextareaField } from '../inputs'
import { UploadSignleFile } from '../upload'

interface createPostFormProps {
  onSubmit?: (params: CreatePost) => void
  defaultValue?: PostDetail
  categoryOptions?: OptionType<string>[]
  type?: 'create' | 'update'
}

export const CreatePostForm = ({
  onSubmit,
  categoryOptions,
  type = 'create',
  defaultValue,
}: createPostFormProps) => {
  const [image, setImage] = useState<string>('')

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<CreatePost>({
    resolver: yupResolver(postFormSchema),
    mode: 'all',
  })

  const onSubmitHandler = (data: any) => {
    onSubmit &&
      onSubmit({
        ...data,
        slug: convertViToEn(data?.title.trim().toLowerCase()).replace(/\s+/g, '-'),
        category: data?.cacategory_id?.value,
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
        <Controller
          control={control}
          name="category_id"
          defaultValue={defaultValue?.category_id}
          render={({ field: { onChange } }) => (
            <SelectField
              control={control}
              name="category"
              placeholder="Danh mục"
              label="Danh mục"
              required={true}
              options={categoryOptions}
              defaultValue={categoryOptions?.find(
                (item) => item?.value === defaultValue?.category_id
              )}
              onChange={(val: any) => val?.value && onChange(val.value)}
            />
          )}
          rules={{ required: true }}
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
