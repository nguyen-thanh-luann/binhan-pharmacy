import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { Button } from '../button'
import { InputRange } from '../inputs'

interface FilterByPriceProps {
  className?: string
  price_max?: number
  price_min?: number
}

interface Price {
  min: number
  max: number
}

export const FilterByPrice = ({ className, price_max = 0, price_min = 0 }: FilterByPriceProps) => {
  const router = useRouter()
  const prices = useRef<Price>()

  const hanldeFilterPrice = () => {
    if (!prices.current) return

    router.push({
      query: {
        ...router?.query,
        price_min: prices.current.min,
        price_max: prices.current.max,
      },
    })
  }

  return (
    <div className={classNames('bg-white rounded-[10px] shadow-shadow-1 p-10', className)}>
      <p className="text-text-color font-bold text-lg mb-10">Khoảng giá</p>

      <InputRange
        max={price_max}
        min={price_min}
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
