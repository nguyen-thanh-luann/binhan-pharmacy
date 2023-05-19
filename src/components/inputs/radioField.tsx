import React from 'react'
import { OptionType } from '@/types'
import { Control, useController } from 'react-hook-form'
import { InputCheckbox } from './inputCheckbox'

type RadioFieldProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, any> & {
  control: Control<any>
  name: string
  className?: string
  label?: string
  data: OptionType<string>[]
  defaultValue?: string | undefined
}

export const RadioField = ({
  className = '',
  label,
  control,
  name,
  defaultValue,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  ref: externalRef,
  value: externalValue,
  data,
  ...attributes
}: RadioFieldProps) => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  })

  const handleChange = (val: OptionType<string>) => {
    onChange(val.value)
  }

  return (
    <div ref={ref} className="flex gap-12 items-center justify-start flex-wrap">
      {data.map((item) => (
        <div key={item.value} className="flex items-center mr-12 min-w-fit">
          <InputCheckbox
            type="radio"
            isChecked={value === item.value}
            onCheck={() => handleChange(item)}
            className='rounded-full'
          />
          <p onClick={() => handleChange(item)} className="text-base ml-8 cursor-pointer">
            {item.label}
          </p>
        </div>
      ))}
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {attributes?.required ? '(*)' : ''}
        </label>
      )}

      {error ? <p className="text !text-red">{error?.message}</p> : null}
    </div>
  )
}
