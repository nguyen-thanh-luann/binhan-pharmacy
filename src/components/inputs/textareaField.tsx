import React from 'react'
import { Control, useController } from 'react-hook-form'

type TextareaFieldProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  control: Control<any>
  name: string
  className?: string
  label?: string
}

export const TextareaField = ({
  className = '',
  label,
  control,
  name,
  defaultValue,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  ref: externalRef,
  value: valueProps,
  ...attributes
}: TextareaFieldProps) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  })

  return (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={name} className={`text`}>
          {label}
          <span className="text-red font-bold">{attributes?.required ? ' * ' : ''}</span>
        </label>
      )}

      <div className="">
        <div className="relative">
          <textarea
            id={name}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            style={{ height: `${name === 'content' && '160px'}` }}
            className={`border border-gray-200 p-8 rounded-md w-full outline-none ${
              error ? 'border-red bg-red-100' : ''
            }`}
            defaultValue={'abc 123'}
            value={valueProps || value}
            {...attributes}
          />
        </div>
        {error ? <p className="text-sm leading-16 text-red ">{error?.message}</p> : null}
      </div>
    </div>
  )
}
