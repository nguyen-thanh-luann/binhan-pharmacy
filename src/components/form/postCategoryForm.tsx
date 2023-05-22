import { convertViToEn } from '@/helper'
import { categoryFormSchema } from '@/schema'
import { RootState } from '@/store'
import { CreatePostCategory, OptionType } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Button } from '../button'
import { InputField, SelectField } from '../inputs'

interface PostCategoryFormProps {
  onSubmit?: (params: CreatePostCategory) => void
  categoryOptions?: OptionType<number>[]
}

export const PostCategoryForm = ({ onSubmit, categoryOptions }: PostCategoryFormProps) => {
  const currentPostCategory = useSelector(
    (state: RootState) => state?.postCategory?.currentPostCategory
  )

  const {
    handleSubmit,
    formState: { isValid },
    control,
  } = useForm<CreatePostCategory>({
    resolver: yupResolver(categoryFormSchema),
    mode: 'all',
  })

  const onSubmitHandler = (data: CreatePostCategory) => {
    onSubmit &&
      onSubmit({
        ...data,
        slug: convertViToEn(data.slug.trim().toLowerCase()).replace(/\s+/g, '-'),
      })
  }

  return (
    <form className="p-12" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="">
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
          <InputField
            defaultValue={currentPostCategory?.slug}
            control={control}
            name="slug"
            placeholder="Slug"
            label="Slug"
            required={true}
          />
        </div>

        <div className="mb-12">
          <SelectField
            defaultValue={categoryOptions?.find(
              (item: any) => item.value === currentPostCategory?._id
            )}
            control={control}
            name="parent_id"
            placeholder="Danh mục cha"
            label="Danh mục cha"
            options={categoryOptions}
          />
        </div>

        <div className="mb-12">
          <InputField
            control={control}
            name="desc"
            placeholder="Mô tả"
            label="Mô tả"
            defaultValue={currentPostCategory?.desc}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          title={!currentPostCategory ? 'Tạo mới' : 'Cập nhật'}
          className={`w-[50%] md:w-[20%] py-6 ${
            isValid ? '' : 'cursor-default opacity-50 hover:opacity-50'
          }`}
          textClassName={`text-white title_md`}
        />
      </div>
    </form>
  )
}
