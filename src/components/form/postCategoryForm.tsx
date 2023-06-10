import { POST_ROLES_OPTIONS } from '@/constants'
import { convertViToEn } from '@/helper'
import { categoryFormSchema } from '@/schema'
import { CreatePostCategory, PostCategory } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '../button'
import { InputField, SelectField, TextareaField } from '../inputs'
import { UploadSignleFile } from '../upload'
import { PostCategoryOptionForm } from './postCategoryOptionForm'

interface PostCategoryFormProps {
  onSubmit?: (params: CreatePostCategory) => void
  defaultPostCategory?: PostCategory
}

export const PostCategoryForm = ({ onSubmit, defaultPostCategory }: PostCategoryFormProps) => {
  const [image, setImage] = useState<string>('')

  const {
    handleSubmit,
    formState: { isValid },
    control,
    setValue,
  } = useForm<CreatePostCategory>({
    resolver: yupResolver(categoryFormSchema),
    mode: 'all',
  })

  const onSubmitHandler = (data: any) => {
    onSubmit &&
      onSubmit({
        ...data,
        slug: convertViToEn(data.name.trim().toLowerCase()).replace(/\s+/g, '-'),
        role: data?.role?.value !== '' ? data?.role?.value : null,
        parent_id: data?.parent_id || undefined,
      })
  }

  return (
    <form className="" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="">
        <div className="mb-12">
          <p className="text-md mb-12">Hình đại diện</p>

          <Controller
            control={control}
            name="attachment_id"
            render={({ field: { onChange } }) => (
              <div className="flex justify-center">
                <UploadSignleFile
                  id="attachment_id"
                  defaultImage={image}
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
          <InputField
            defaultValue={defaultPostCategory?.name}
            control={control}
            name="name"
            placeholder="Tên danh mục"
            labelClassName="!text-md"
            label="Tên danh mục"
            required={true}
          />
        </div>

        <div className="mb-12">
          <PostCategoryOptionForm
            type="single"
            onChecked={(data) => {

              setValue('parent_id', data?.[0]?.toString() || '')
            }}
          />
        </div>

        <div className="mb-12">
          <SelectField
            defaultValue={POST_ROLES_OPTIONS?.find(
              (item: any) => item.value === defaultPostCategory?.role
            )}
            control={control}
            name="role"
            placeholder="Phân loại người xem"
            label="Phân loại"
            labelClassName="!text-md"
            options={POST_ROLES_OPTIONS}
          />
        </div>

        <div className="mb-12">
          <TextareaField
            rows={4}
            control={control}
            name="desc"
            placeholder="Nhập mô tả"
            label="Mô tả"
            labelClassName="!text-md"
            defaultValue={defaultPostCategory?.desc}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          title={!defaultPostCategory ? 'Tạo mới' : 'Cập nhật'}
          className={classNames(
            `w-[50%] md:w-[20%] py-6 border border-primary`,
            isValid ? '' : 'cursor-default opacity-50 hover:opacity-50'
          )}
          textClassName={`text-primary`}
        />
      </div>
    </form>
  )
}
