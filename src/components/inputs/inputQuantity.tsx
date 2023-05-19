import React, { useEffect, useRef, useState } from 'react'
import { useClickOutside, useDebounce } from '@/hooks'
import { MinusIcon, PlusIcon } from '@/assets'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'

interface QuantityInput {
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

export const InputQuantity = ({
  quantity,
  onChangeQuantity,
  disabled,
  className,
  minusBtnClassName,
  plusBtnClassName,
  inputClassName,
  minusIconClassName,
  plusIconClassName,
  onFocus
}: QuantityInput) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputQuantity, setInputQuantity] = useState<number>(quantity)
  const [triggerName, setTriggerName] = useState<'input' | 'button'>()
  const qty = useDebounce(inputQuantity, 500)

  useEffect(() => {
    if (triggerName === 'button') return
    if (qty === 0) {
      setInputQuantity(1)
    }
  }, [qty])

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

    setTriggerName('button')
    switch (type) {
      case 'Descrease':
        if (inputQuantity > 1) {
          setInputQuantity(inputQuantity - 1)
          onChangeQuantity?.(inputQuantity - 1)
        }
        break
      case 'Increase':
        if (inputQuantity < 10000) {
          setInputQuantity((prev) => prev + 1)
          onChangeQuantity?.(inputQuantity + 1)
        }
        break
    }
  }

  const updateQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const re = /^[0-9\b]+$/
    if (!re.test(value) || Number(value) === 0) return
    if (value === '' || re.test(value)) {
      if (+value <= LIMIT) {
        setTriggerName('input')
        setInputQuantity(+value)
        onChangeQuantity?.(+value)
      }
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
        onChange={updateQuantity}
        min={0}
        readOnly={disabled}
        onFocus={focusHandler}
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
