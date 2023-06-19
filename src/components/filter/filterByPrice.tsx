import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { Button } from '../button'
import { InputRange } from '../inputs'
import { roundingNumber } from '@/helper'

interface FilterByPriceProps {
  className?: string
  price_max?: number
  price_min?: number
}

interface Price {
  min: number
  max: number
}

export const FilterByPrice = ({
  className,
  price_max = 100000,
  price_min = 0,
}: FilterByPriceProps) => {
  const router = useRouter()

  const priceMax = roundingNumber(price_max, 'upper', 50000)
  const priceMin = roundingNumber(price_min, 'lower', 50000)
  

  const prices = useRef<Price>({
    min: priceMin,
    max: priceMax,
  })

  const hanldeFilterPrice = () => {
    if (!prices) return

    router.push({
      query: {
        ...router?.query,
        price_min: prices?.current?.min,
        price_max: prices?.current?.max,
      },
    })
  }

  return (
    <div className={classNames('bg-white rounded-[10px] shadow-shadow-1 p-10', className)}>
      <p className="text-text-color font-bold text-lg mb-10">Khoảng giá</p>

      <InputRange
        max={priceMax}
        min={priceMin}
        onChange={({ min, max }: { min: number; max: number }) => {
          prices.current = { max, min }
        }}
      />

      <Button
        title="Áp dụng"
        className="bg-primary p-4 rounded-lg w-full"
        textClassName="text-white"
        onClick={hanldeFilterPrice}
      />
    </div>
  )
}
