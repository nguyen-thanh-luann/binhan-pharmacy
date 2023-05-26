import { MinusIcon, PlusIcon } from '@/assets'
import { useClickOutside } from '@/hooks'
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface QuantityInputV2 {
  quantity: number
  onChangeQuantity?: Function
  onFocus?: Function
  disabled?: boolean
  className?: string
  minusBtnClassName?: string
  plusBtnClassName?: string
  inputClassName?: string
  minusIconClassName?: string
  plusIconClassName?: string
}

const LIMIT = 1000

export const InputQuantityV2 = ({
  quantity,
  onChangeQuantity,
  disabled,
  className,
  minusBtnClassName,
  plusBtnClassName,
  inputClassName,
  minusIconClassName,
  plusIconClassName,
  onFocus,
}: QuantityInputV2) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputQuantity, setInputQuantity] = useState<number>(quantity) //main value to update quantity
  const [tempQuantity, setTempQuantity] = useState<number>(inputQuantity) //use this value to compare with inputQuantity -> detect value is change or not

  useEffect(() => {
    setInputQuantity(quantity)
  }, [quantity])

  useClickOutside([inputRef], () => {
    if (inputQuantity <= 0) {
      setInputQuantity(1)
      onChangeQuantity?.(1)
    }
  })

  const handleChangeQuantity = (type: String) => {
    if (disabled) return
    switch (type) {
      case 'Descrease':
        if (inputQuantity > 1) {
          setInputQuantity(inputQuantity - 1)
          setTempQuantity(inputQuantity - 1)
          onChangeQuantity?.(inputQuantity - 1)
        }
        break
      case 'Increase':
        if (inputQuantity < 10000) {
          setInputQuantity((prev) => prev + 1)
          setTempQuantity((prev) => prev + 1)
          onChangeQuantity?.(inputQuantity + 1)
        }
        break
    }
  }

  const hanldeInputchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempQuantity(inputQuantity)
    const newInputValue = cleanInputQuantity(e.target.value)
    if (newInputValue > LIMIT) return
    setInputQuantity(cleanInputQuantity(e.target.value))
  }

  const cleanInputQuantity = (value: string): number => {
    const regex = /^[0-9\b]+$/

    if (!regex.test(value) || Number(value) === 0) return 0

    return Number(value)
  }

  const updateQuantity = () => {
    if (tempQuantity === inputQuantity) return

    if (inputQuantity <= LIMIT) {
      onChangeQuantity?.(inputQuantity)
      setTempQuantity(inputQuantity)
    }
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
        onClick={() => handleChangeQuantity('Descrease')}
        className={twMerge(
          classNames(
            `w-[28px] h-[28px] bg-primary text-white p-2 rounded-md active:opacity-80 ${
              disabled ? '!cursor-default' : ''
            }`,
            minusBtnClassName
          )
        )}
      >
        <MinusIcon className={twMerge(classNames(`mx-auto`), minusIconClassName)} />
      </button>

      <input
        ref={inputRef}
        className={twMerge(classNames(`w-40`, inputClassName))}
        type="number"
        value={inputQuantity}
        onChange={hanldeInputchange}
        onKeyDown={(e) => {
          if (e.code === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            updateQuantity()
          }
        }}
        min={0}
        readOnly={disabled}
        onFocus={focusHandler}
        onBlur={updateQuantity}
      />

      <button
        onClick={() => handleChangeQuantity('Increase')}
        className={twMerge(
          classNames(
            `w-[28px] h-[28px] bg-primary p-2 rounded-md active:opacity-80 ${
              disabled ? '!cursor-default' : ''
            }`,
            plusBtnClassName
          )
        )}
      >
        <PlusIcon className={twMerge(classNames('mx-auto'), plusIconClassName)} />
      </button>
    </div>
  )
}
