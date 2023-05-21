import React, { useEffect, useRef } from 'react'
import { useDebounce, useInputText } from '@/hooks'
import { SearchIcon, TimesIcon } from '@/assets'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'

type SearchFieldProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  any
> & {
  onSubmit?: (_: string) => void
  onChange?: (_: string) => void
  onChangeWithDebounceValue?: (_: string) => void
  timer?: number
  showSearchIcon?: boolean
  inputRef?: any
  onInputChange?: Function
}

export const SearchField = ({
  onSubmit: onSubmitExternal,
  timer = 500,
  showSearchIcon = true,
  onChangeWithDebounceValue,
  inputRef,
  onInputChange,
  ...attributes
}: SearchFieldProps) => {
  const { clearValue, onChange, value } = useInputText()
  const ref = useRef<HTMLInputElement>(null)
  const valDebounce = useDebounce(value, timer)

  const handleSubmit = () => {
    onSubmitExternal?.(value)
  }

  useEffect(() => {
    onChangeWithDebounceValue?.(valDebounce)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valDebounce])

  return (
    <div
      className={twMerge(
        classNames(
          `flex justify-between items-center border-1 border-gray-200 rounded-md p-4`,
          attributes?.className
        )
      )}
    >
      <input
        {...attributes}
        ref={inputRef || ref}
        className="outline-none w-full rounded-lg"
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
        className={`text-gray-800 my-auto mx-8 ${value ? 'block cursor-pointer' : 'hidden'}`}
        onClick={() => {
          clearValue()
          attributes?.onChange?.('')
        }}
      >
        <TimesIcon className="text-gray text-xs" />
      </span>

      {showSearchIcon && (
        <button onClick={handleSubmit} className="">
          <SearchIcon className="text-gray text-base" />
        </button>
      )}
    </div>
  )
}
