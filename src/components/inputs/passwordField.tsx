import { EyeIconOutline, EyeInvisibleIconOutline } from '@/assets'
import classNames from 'classnames'
import React, { useState } from 'react'
import { Control, useController } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

type PasswordFieldProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  any
> & {
  control: Control<any>
  name: string
  label?: string
  className?: string
  inputClassName?: string
  labelClassName?: string
  messageClassName?: string
}

export const PasswordField = ({
  className = '',
  inputClassName,
  labelClassName,
  messageClassName,
  label,
  control,
  name,
  defaultValue,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  ref: externalRef,
  value: externalValue,
  ...attributes
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  })

  return (
    <div className={twMerge(classNames('', className))}>
      {label && (
        <label htmlFor={name} className={twMerge(classNames('text', labelClassName))}>
          {label}
          <span className="text-red font-bold">{attributes?.required ? ' * ' : ''}</span>
        </label>
      )}

      <div className={classNames('relative flex-center', label ? 'mt-8' : '')}>
        <input
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          value={value}
          className={twMerge(
            classNames(
              `flex-1 text rounded-md outline-none border border-gray-200 p-12 pr-24`,
              inputClassName,
              error ? 'border-red bg-red-100' : ''
            )
          )}
          id={name}
          type={showPassword ? 'text' : 'password'}
          {...attributes}
        />

        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-10 top-[50%] translate-y-[-50%] cursor-pointer"
        >
          {!showPassword ? (
            <EyeInvisibleIconOutline className="w-12 h-12" />
          ) : (
            <EyeIconOutline className="w-12 h-12" />
          )}
        </span>
      </div>

      {error ? <p className="text !text-red">{error?.message}</p> : null}
    </div>
  )
}
