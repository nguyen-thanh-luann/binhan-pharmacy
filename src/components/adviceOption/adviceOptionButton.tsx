import classNames from 'classnames'
import React, { ReactNode, useState } from 'react'

interface AdviceOptionButtonProps {
  children: ReactNode
  className?: string
}

export const AdviceOptionButton = ({ className, children }: AdviceOptionButtonProps) => {
  const [expand, setExpand] = useState<boolean>(false)

  const hanldeToggle = () => {
    console.log('toggle toggle')

    setExpand(true)
  }

  return (
    <div
      onClick={hanldeToggle}
      className={classNames('fixed bottom-[12px] right-[12px] z-[100]', className)}
    >
      <div className={classNames(expand ? 'flex' : 'hidden')}>{children}</div>

      <div
        className={classNames(
          'w-fit p-8 rounded-full border cursor-pointer',
          expand ? 'border-primary' : 'border-gray'
        )} 
      >
        {expand ? <p>Y</p> : <p>X</p>}
      </div>
    </div>
  )
}
