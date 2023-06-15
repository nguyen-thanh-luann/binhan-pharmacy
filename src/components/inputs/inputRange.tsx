import { formatMoneyVND } from '@/helper'
import classnames from 'classnames'
import { ChangeEvent, FC, memo, useCallback, useEffect, useRef, useState } from 'react'

interface MultiRangeSliderProps {
  min: number
  max: number
  onChange: Function
}

export const InputRange: FC<MultiRangeSliderProps> = memo(function InputRangeChild({
  min,
  max,
  onChange,
}) {
  const [minVal, setMinVal] = useState(min)
  const [maxVal, setMaxVal] = useState(max)
  const minValRef = useRef<HTMLInputElement>(null)
  const maxValRef = useRef<HTMLInputElement>(null)
  const range = useRef<HTMLDivElement>(null)

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  )

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal) < 0 ? 0 : getPercent(minVal)
      const maxPercent =
        getPercent(+maxValRef.current.value) > 100 ? 100 : getPercent(+maxValRef.current.value) // Precede with '+' to convert the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`
        range.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [minVal, getPercent])

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent =
        getPercent(+minValRef.current.value) < 0 ? 0 : getPercent(+minValRef.current.value)

      const maxPercent = getPercent(maxVal) > 100 ? 100 : getPercent(maxVal)

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [maxVal, getPercent])

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal })
  }, [minVal, maxVal, onChange])

  return (
    <div className="input__range-container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+event.target.value, maxVal - 1)
          setMinVal(value)
          event.target.value = value.toString()
        }}
        className={classnames('thumb z-100', {
          'z-50': minVal > max - 100,
        })}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+event.target.value, minVal + 1)
          setMaxVal(value)
          event.target.value = value.toString()
        }}
        className="thumb z-100"
      />

      <div className="relative w-[250px]">
        <div className="absolute rounded-[3px] h-[0.5rem] bg-slate-400 w-[250px]"></div>
        <div
          ref={range}
          className="absolute bg-primary z-50 h-[0.5rem] rounded-[3px] min-w-fit max-w-[100%]"
        ></div>
        <div className="absolute left-[4px] mt-12">{formatMoneyVND(minVal)}</div>
        <div className="absolute right-[4px] mt-12">{formatMoneyVND(maxVal)}</div>
      </div>
    </div>
  )
})
