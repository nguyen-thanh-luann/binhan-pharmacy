import React, { useEffect, useRef } from 'react'
import { useDebounce, useInputText } from '@/hooks'
import { SearchIcon, TimesIcon } from '@/assets'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'

type SearchFormProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, any> & {
  onSubmit?: (_: string) => void
  onChange?: (_: string) => void
  onChangeWithDebounceValue?: (_: string) => void
  timer?: number
  device?: 'mobile' | 'desktop'
  buttonClassName?: string
  inputClassName?: string
}

export const SearchForm = ({
  onSubmit: onSubmitExternal,
  timer = 500,
  onChangeWithDebounceValue,
  device = 'desktop',
  ...attributes
}: SearchFormProps) => {
  const { onChange, value, clearValue } = useInputText()
  const ref = useRef<HTMLInputElement>(null)
  const valDebounce = useDebounce(value, timer)
  const handleSubmit = () => {
    onSubmitExternal?.(value)
  }

  useEffect(() => {
    onChangeWithDebounceValue?.(valDebounce)
  }, [valDebounce])

  return (
    <form
      className={twMerge(
        classNames(
          'search-form relative flex justify-between items-center rounded-full border border-gray-200 bg-white',
          attributes?.className
        )
      )}
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <SearchIcon className="text-gray ml-12 w-20 h-20" />

      <input
        {...attributes}
        ref={ref}
        className={twMerge(
          classNames('outline-none w-full p-8 rounded-full text !text-gray'),
          attributes.inputClassName
        )}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          const { value } = e.target
          attributes?.onChange?.(value)
        }}
        placeholder={attributes?.placeholder || 'Tìm kiếm sản phẩm'}
      />

      <span
        className={`text-gray-800 my-auto mx-12 text-xs ${
          value ? 'block cursor-pointer' : 'hidden'
        }`}
        onClick={() => {
          clearValue()
          attributes?.onChange?.('')
        }}
      >
        <TimesIcon className="text-gray text-xs" />
      </span>

      <button
        onClick={handleSubmit}
        className={twMerge(
          classNames(
            'relative bg-background group text-gray min-w-fit py-8 px-16 rounded-tr-full rounded-br-full',
            attributes?.buttonClassName
          )
        )}
      >
        <span className="title !text-primary">Tìm kiếm</span>
        <span className="absolute border border-gray-300 rounded-lg left-0 top-0 bottom-0 h-[50%] my-auto"></span>
      </button>
    </form>
  )
}
