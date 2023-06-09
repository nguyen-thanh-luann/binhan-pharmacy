import { POST_ROLES_OPTIONS } from '@/constants'
import { convertViToEn } from '@/helper'
import { categoryFormSchema } from '@/schema'
import { selectPostCategoryForm } from '@/store'
import { CreatePostCategory, OptionType } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Button } from '../button'
import { InputField, SelectField, TextareaField } from '../inputs'
import { UploadSignleFile } from '../upload'
import { PostCategoryOptionForm } from './postCategoryOptionForm'

interface PostCategoryFormProps {
  onSubmit?: (params: CreatePostCategory) => void
  categoryOptions?: OptionType<string>[]
}

export const PostCategoryForm = ({ onSubmit, categoryOptions }: PostCategoryFormProps) => {
  const currentPostCategory = useSelector(selectPostCategoryForm)

  const [image, setImage] = useState<string>('')

  const {
    handleSubmit,
    formState: { isValid },
    control,
  } = useForm<CreatePostCategory>({
    resolver: yupResolver(categoryFormSchema),
    mode: 'all',
  })

  const onSubmitHandler = (data: any) => {
    onSubmit &&
      onSubmit({
        ...data,
        slug: convertViToEn(data.name.trim().toLowerCase()).replace(/\s+/g, '-'),
        parent_id: data?.parent_id?.value || undefined,
        role: data?.role?.value !== '' ? data?.role?.value : null,
      })
  }

  return (
    <form className="" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="">
        <div className="mb-12">
          <p className="text_md mb-12">Hình đại diện</p>

          <Controller
            control={control}
            name="attachment_id"
            // defaultValue={defaultValue?.id}
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
            defaultValue={currentPostCategory?.name}
            control={control}
            name="name"
            placeholder="Tên danh mục"
            label="Tên danh mục"
            required={true}
          />
        </div>

        <div className="mb-12">
          <PostCategoryOptionForm />
        </div>

        <div className="mb-12">
          <SelectField
            defaultValue={POST_ROLES_OPTIONS?.find(
              (item: any) => item.value === currentPostCategory?.role
            )}
            control={control}
            name="role"
            placeholder="Phân loại người xem"
            label="Phân loại"
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
            defaultValue={currentPostCategory?.desc}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          title={!currentPostCategory ? 'Tạo mới' : 'Cập nhật'}
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
