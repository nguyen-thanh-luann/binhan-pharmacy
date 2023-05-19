import classNames from 'classnames'

interface CouponItemProps {
  label: string
  active?: boolean
  disabled?: boolean
  className?: string
}

const concaveClassName = 'w-[10px] h-[10px] border border-solid border-primary rounded-full absolute top-1/2 transform -translate-y-1/2 bg-white '

export const CouponItem = ({ className, label }: CouponItemProps) => {
  return (
    <div
      className={classNames(
        className,
        'px-12 py-4 w-fit h-fit bg-background relative rounded-[5px] overflow-hidden'
      )}
    >
      <span className="absolute inset-0 border border-solid border-primary rounded-[5px]" />
      <span className={classNames(concaveClassName, 'left-[-4px]')}/>
      <span className={classNames(concaveClassName, 'right-[-4px]')}/>
      <span className="text-xs font-semibold line-clamp-1 text-primary">{label}</span>
    </div>
  )
}
