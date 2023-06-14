import { MinusIcon, PlusIcon } from '@/assets'
import classNames from 'classnames'
import React, { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface CustomInputQuantityProps {
  defaultValue?: number
  maxValue?: number
  onFocus?: Function
  onChangeQuantity?: Function
  disabled?: boolean
  className?: string
  minusBtnClassName?: string
  plusBtnClassName?: string
  inputClassName?: string
  minusIconClassName?: string
  plusIconClassName?: string
}

export const CustomInputQuantity = ({
  defaultValue = 1,
  maxValue = 999,
  onFocus,
  className,
  disabled,
  inputClassName,
  minusBtnClassName,
  minusIconClassName,
  onChangeQuantity,
  plusBtnClassName,
  plusIconClassName,
}: CustomInputQuantityProps) => {
  const [value, setValue] = useState<number>(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDecrease = () => {
    if (disabled) return
    onChangeQuantity?.(Math.max(1, value - 1))
    setValue((prevValue) => Math.max(1, prevValue - 1))
  }

  const handleIncrease = () => {
    if (disabled) return
    onChangeQuantity?.(value + 1)
    setValue((prevValue) => prevValue + 1)
  }

  const handleBlur = () => {
    if (disabled) return

    if (value > maxValue) {
      setValue(maxValue)
      return
    }

    setValue(Math.max(1, value))
    onChangeQuantity?.(Math.max(1, value))
  }

  const hanldeInputchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const newValue = Number(e.target.value)

    if (value <= 0) {
      setValue(Number(Math.max(1, newValue)))
      return
    }

    if (newValue > maxValue) {
      setValue(maxValue)
      return
    }

    setValue(newValue)
  }

  const focusHandler = () => {
    inputRef.current?.select()
    onFocus?.()
  }

  return (
    <div
      className={twMerge(
        classNames(
          `w-fit flex items-center ${disabled ? '!cursor-default opacity-50' : ''}`,
          className
        )
      )}
    >
      <button
        className={twMerge(
          classNames(
            `w-[28px] h-[28px] bg-primary text-white p-2 rounded-md active:opacity-80 ${
              disabled ? '!cursor-default' : ''
            }`,
            minusBtnClassName
          )
        )}
        onClick={handleDecrease}
      >
        <MinusIcon className={twMerge(classNames(`mx-auto text-white`), minusIconClassName)} />
      </button>

      <input
        ref={inputRef}
        type="number"
        value={Number(value).toString(10)}
        onChange={hanldeInputchange}
        onBlur={handleBlur}
        onFocus={focusHandler}
        className={classNames(
          'w-[40px] text-center outline-none line-clamp-1',
          inputClassName,
          disabled ? '!cursor-default' : ''
        )}
        onKeyDown={(e) => {
          if (e.code === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onChangeQuantity?.(value)
          }
        }}
      />

      <button
        className={twMerge(
          classNames(
            `w-[28px] h-[28px] bg-primary p-2 rounded-md active:opacity-80 ${
              disabled ? '!cursor-default' : ''
            }`,
            plusBtnClassName
          )
        )}
        onClick={handleIncrease}
      >
        <PlusIcon className={twMerge(classNames('mx-auto text-white'), plusIconClassName)} />
      </button>
    </div>
  )
}
