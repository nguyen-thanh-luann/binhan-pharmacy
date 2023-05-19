import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button } from '../button'

export const FilterByPrice = () => {
  const router = useRouter()
  const [minValue, setMinValue] = useState<number>(Number(router?.query?.price_min || 0))
  const [maxValue, setMaxValue] = useState<number>(Number(router?.query?.price_max || 0))


  const hanldeFilterPrice = () => {
    router.push({
      query: {
        ...router?.query,
        price_min: minValue,
        price_max: maxValue,
      },
    })
  }

  return (
    <div className="bg-white rounded-[10px] shadow-shadow-1 p-10">
      <p className="text-text-color font-bold text-lg mb-10">Khoảng giá</p>

      <div className="flex gap-12 mb-10">
        <input
          type="number"
          name="min"
          id="min"
          className="border min-w-[80px] border-gray-200 rounded-lg p-8 text-center outline-none"
          placeholder="Từ (vnd)"
          onChange={(e) => {
            setMinValue(Number(e.target.value))
          }}
        />

        <input
          type="number"
          name="max"
          id="max"
          className="border min-w-[80px] border-gray-200 rounded-lg p-8 text-center outline-none"
          placeholder="Đến (vnd)"
          onChange={(e) => {
            setMaxValue(Number(e.target.value))
          }}
        />
      </div>

      <Button
        title="Áp dụng"
        className="bg-primary p-4 rounded-lg w-full"
        textClassName="text-white"
        onClick={hanldeFilterPrice}
      />
    </div>
  )
}
