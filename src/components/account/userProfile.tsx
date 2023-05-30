import { EmailIcon, PenIconSolid, TelePhoneIcon } from '@/assets'
import { Button, CustomImage, InputField, RadioField } from '@/components'
import { DATA_GENDER, LIMIT_ATTACHMENT } from '@/constants'
import { useAttachment, useCreateAttachment, useUser } from '@/hooks'
import { userInfoSchema } from '@/schema'
import { CreateAttachmentRes, UserInfo } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'

interface UserProfileProps {
  data: UserInfo | undefined
  className?: string
}

export const UserProfile = ({ data, className }: UserProfileProps) => {
  const { updateUser } = useUser({})
  const { getBase64Images } = useAttachment({ limit: LIMIT_ATTACHMENT })
  const { createAttachment } = useCreateAttachment()

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(userInfoSchema),
    mode: 'all',
  })

  const handleEditUser = (newUserInfo: any) => {
    updateUser(
      {
        email: newUserInfo?.email || '',
        partner_name: newUserInfo?.name || '',
        gender: newUserInfo?.gender || '',
      },
      () => {
        toast.success('Cập nhật thông tin thành công!')
      }
    )
  }

  const handleChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files) return
    getBase64Images(e.target.files, (images) => {
      if (!images?.[0]) return

      createAttachment({
        file: images?.[0].replace(/^data:image\/\w+;base64,/, ''),
        onSuccess(res: CreateAttachmentRes[]) {
          updateUser(
            {
              avatar_url: res[0]?.id || 0,
            },
            () => {
              toast.success('Cập nhật ảnh đại diện thành công!')
            }
          )
        },
      })
    })
  }

  return (
    <div className={twMerge(classNames(`w-[90%] md:w-[70%] mx-auto`, className))}>
      <div className="flex flex-col md:flex-row items-center gap-24 mb-24">
        <div className="min-w-[120px] h-[120px] rounded-full relative">
          <input onChange={handleChangeAvatar} type="file" name="" hidden id="user-avatar" />

          <label htmlFor="user-avatar" className="cursor-pointer">
            <div className="relative">
              <CustomImage
                src={`${data?.account?.avatar_url?.url || ''}`}
                imageClassName="object-cover rounded-full w-[120px] h-[120px]"
              />

              <PenIconSolid className="absolute bottom-0 right-0 text-primary" />
            </div>
          </label>
        </div>
        <div className="w-full">
          <p className="text-lg font-bold mb-12">{data?.account?.partner_name}</p>

          <div className="flex items-center gap-12 mb-12">
            <TelePhoneIcon className="font-medium text-base" />
            <p className="text-md font-medium">{data?.account?.phone}</p>
          </div>

          <div className="flex items-center gap-12 mb-12">
            <EmailIcon className="font-medium text-base" />
            <p className="text-md font-medium">{data?.account?.email}</p>
          </div>
        </div>
      </div>

      <div>
        <form onSubmit={handleSubmit(handleEditUser)}>
          <div className="mb-18">
            <InputField
              control={control}
              name="name"
              label="Họ và tên"
              defaultValue={data?.account?.partner_name || ''}
            />
          </div>

          <div className="mb-18">
            <InputField
              control={control}
              name="email"
              label="Email"
              defaultValue={data?.account?.email || ''}
            />
          </div>

          <div className="mb-18">
            <label className="text font-bold">Giới tính</label>

            <div className="mt-8">
              <RadioField
                data={DATA_GENDER}
                control={control}
                defaultValue={data?.account?.gender}
                name="gender"
              />
            </div>
          </div>

          <div className="flex-center">
            <Button
              title="Cập nhật thông tin"
              className={`rounded-full bg-primary py-12 px-24 ${
                isValid ? '' : 'opacity-50 cursor-default'
              }`}
              textClassName={`text-base text-white`}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
