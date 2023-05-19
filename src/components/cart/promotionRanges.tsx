import { formatMoneyVND } from '@/helper'
import { PromotionRange } from '@/types'
import { Button } from '../button'
import classNames from 'classnames'

interface PromotionRangeListProps {
  data: PromotionRange[]
  defaultValue?: PromotionRange
  onChange: (val: PromotionRange) => void
}

export const PromotionRanges = ({ data, defaultValue, onChange }: PromotionRangeListProps) => {
  const formatRangeValue = (range: PromotionRange, value: number) => {
    return range.range_condition_type === 'price' ? formatMoneyVND(value) : value
  }

  const handleChange = (range: PromotionRange) => {
    onChange(range)
  }

  return (
    <div className="flex-1 p-16 overflow-y-auto">
      {data.map((item) => {
        const active = defaultValue?.range_id === item.range_id

        return (
          <div
            key={item.range_id}
            className={classNames(
              'h-[70px] flex shadow-shadow-1 mb-12 overflow-hidden border border-solid rounded-[8px]',
              active ? 'bg-primary-100 border-primary' : 'bg-white border-transparent'
            )}
          >
            <div className={'flex-1 p-12 flex flex-col justify-between'}>
              <p className="line-clamp-1 text-sm">{item.range_name}</p>
              <p className="line-clamp-1 text-xs font-normal text-gray">
                Áp dụng cho {item.range_condition_type === 'price' ? 'giá' : 'số lượng'} từ{' '}
                {formatRangeValue(item, item.range_from)}{' '}
                {item.range_to ? `- ${formatRangeValue(item, item.range_to)}` : ''}
              </p>
            </div>
            <div className="h-full w-[70px] bg-primary flex-center">
              <Button
                onClick={() => handleChange(item)}
                textClassName="text-white font-semibold text-base"
                title={!active ? 'Chọn' : 'Huỷ'}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
