import React, { ReactNode } from 'react'
import { Button } from '../button'
import { phoneNumberSchema } from '@/schema'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputField } from '../inputs'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'

interface LoginOtpFormProps {
  onSubmit: (phoneNumber: string) => void
  className?: string
  label?: string
  placeHolder?: string
  buttonTitle?: string
  firstOption?: ReactNode
  secondOption?: ReactNode
}

export const PhoneForm = ({
  onSubmit,
  className,
  label,
  placeHolder,
  buttonTitle,
  firstOption,
  secondOption,
}: LoginOtpFormProps) => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(phoneNumberSchema),
    mode: 'all',
  })

  const handleSubmitForm = (data: any) => {
    onSubmit(data.phoneNumber)
  }

  return (
    <div className={twMerge(classNames('', className))}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="mb-12">
          {label ? (
            <InputField
              control={control}
              name="phoneNumber"
              type="text"
              label={label}
              placeholder={placeHolder || 'Số điện thoại'}
              inputClassName="rounded-[10px] p-12"
            />
          ) : (
            <InputField
              control={control}
              name="phoneNumber"
              type="text"
              placeholder={placeHolder || 'Số điện thoại'}
              inputClassName="rounded-[10px] p-12"
            />
          )}
        </div>

        {firstOption || secondOption ? (
          <div className="mb-24 flex items-center justify-between">
            {firstOption}

            {secondOption}
          </div>
        ) : null}

        <Button
          type="submit"
          title={buttonTitle || 'Tiếp tục'}
          className={`w-full bg-primary rounded-[10px] p-10`}
          textClassName="title !text-white"
        />
      </form>
    </div>
  )
}
