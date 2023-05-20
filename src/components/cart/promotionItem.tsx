import { ClockOutline, RightIcon, logoSm } from '@/assets'
import { ToggleSelectedPromotion } from '@/hooks'
import { PromotionRange, PromotionRes } from '@/types'
import classNames from 'classnames'
import { Button } from '../button'
import { Image } from '../image'

interface PromotionItemProps {
  data: PromotionRes
  active?: boolean
  disabled?: boolean
  className?: string
  onToggle?: (data: Omit<ToggleSelectedPromotion, 'promotionIndex'>) => void
  onViewDetail?: (id: number) => void
  onPress?: (data: PromotionRes) => void
}

export const PromotionItem = ({
  data,
  active,
  disabled,
  className,
  onToggle,
}: PromotionItemProps) => {
  return (
    <div
      // onClick={!disabled ? () => onPress?.(data) : undefined}
      className={classNames(
        'relative h-[108px] shadow-shadow-1 rounded-[10px] p-12 overflow-hidden border border-solid',
        active ? 'bg-primary-100 border-primary' : 'border-transparent bg-white',
        disabled ? 'opacity-50 pointer-events-none select-none' : '',
        className
      )}
    >
      <div className="flex h-full">
        <div className="w-[80px] flex-center">
          <Image alt="" src={logoSm} className="w-full" />
        </div>

        <div className="mx-12 h-full border-r-[0.8px] border-dashed border-r-border-1"></div>

        <div className="flex flex-col justify-between h-full flex-1">
          <p className="text-base font-bold text-primary line-clamp-1 mb-4">
            {data.promotion_name}
          </p>
          <p className="text-sm line-clamp-1 mr-[40px]">
            {data?.promotion_brief || data?.promotion_code}
          </p>
          <div className="flex items-end justify-between flex-1">
            <div className="flex-1 mr-12">
              <p className="flex items-center">
                <ClockOutline className="text-gray" />
                <span className="text-xs ml-4 text-gray">{data.date_end}</span>
              </p>
            </div>
            <Button
              icon={
                (data?.range_ids as PromotionRange[])?.length > 1 ? (
                  <RightIcon className="text-primary text-sm mr-[-6px]" />
                ) : undefined
              }
              onClick={!disabled ? () => onToggle?.(data) : undefined}
              title={
                active
                  ? (data?.range_ids as PromotionRange[])?.length > 1
                    ? 'Thay đổi'
                    : 'Bỏ chọn'
                  : 'Áp dụng'
              }
              className="px-8 bg-primary-200 h-[38px] rounded-[10px] flex-row-reverse"
              textClassName={classNames(
                'text-base text-primary',
                (data.range_ids as PromotionRange[])?.length > 2 ? 'mr-4' : ''
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
