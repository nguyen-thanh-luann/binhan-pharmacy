import classNames from 'classnames'
import React from 'react'
import { Control, useController } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

type InputFieldProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, any> & {
  control: Control<any>
  name: string
  value?: string
  label?: string
  className?: string
  inputClassName?: string
  labelClassName?: string
  messageClassName?: string
}

export const InputField = ({ 
  className = '',
  inputClassName,
  labelClassName,
  messageClassName,
  label,
  control,
  name,
  defaultValue,
  value: valueProps,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  ref: externalRef,
  ...attributes
}: InputFieldProps) => {
  const {
    field: { onChange, value, ref },
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

      <div className={`relative ${label ? 'mt-8' : ''}`}>
        <input
          onChange={onChange}
          onBlur={externalOnBlur}
          ref={ref}
          className={twMerge(
            classNames(
              `border border-gray-200 w-full p-8 text rounded-md outline-none`,
              error ? 'border-red bg-red-100' : '',
              inputClassName
            )
          )}
          id={name}
          {...attributes}
          value={valueProps || value}
          type="text"
        />

        {error ? (
          <p className={twMerge(classNames('text !text-red', messageClassName))}>{error.message}</p>
        ) : null}
      </div>
    </div>
  )
}
