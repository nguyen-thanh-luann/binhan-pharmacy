import classNames from 'classnames'
import { ReactElement } from 'react'

interface TooltipProps {
  text: string
  children: ReactElement
  viewTooltip?: boolean
  className?: string
  tooltipClassName?: string
}

export const Tooltip = ({
  text,
  children,
  viewTooltip = true,
  className,
  tooltipClassName,
}: TooltipProps) => {
  return (
    <div className={classNames('relative flex flex-col items-center group', className)}>
      {children}

      <div
        className={classNames(
          viewTooltip
            ? 'absolute top-[45px] flex-col items-center hidden group-hover:flex z-[100] animate-fade'
            : 'hidden',
          tooltipClassName
        )}
      >
        <div className="w-12 h-12 -mb-8 rotate-45 bg-primary-10"></div>
        <span className="text-base text-text-color bg-primary-10 shadow-lg p-8 rounded-md max-h-[100px] overflow-scroll scrollbar-hide">
          {text}
        </span>
      </div>
    </div>
  )
}
