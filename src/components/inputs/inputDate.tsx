import classNames from "classnames";
import React from "react";
import { Control, useController } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type InputDateProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, any> & {
  control: Control
  name: string
  className?: string
  label?: string
  inputClassName?: string
  labelClassName?: string
  messageClassName?: string
}

export const InputDate = ({
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
}: InputDateProps) => {
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

      <div className="">
        <div className="relative">
          <input
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            value={value}
            className={twMerge(
              classNames(
                `border border-gray-200 w-full p-8 text rounded-md outline-none ${
                  error ? 'border-red bg-red-100' : ''
                }`,
                inputClassName
              )
            )}
            id={name}
            {...attributes}
            type="date"
          />
        </div>

        {error ? <p className="text-md text-red">{error.message}</p> : null}
      </div>
    </div>
  )
}
