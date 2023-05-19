import { useEffect, useRef } from 'react'
import { useBreakpoint } from '@/hooks'
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';

interface TabsProps {
  list: { label: string; value: string }[]
  tabActive: string
  onChange?: (params: string) => void
  className?: string
  labelClassName?: string
  tabActiveClassName?: string
}

const Tabs = ({
  tabActive,
  list,
  onChange,
  className = '',
  labelClassName = '',
  tabActiveClassName
}: TabsProps) => {
  const lineRef = useRef<HTMLSpanElement>(null)
  const width = useBreakpoint()

  useEffect(() => {
    getTabActive(list.findIndex((item) => item.value === tabActive))
  }, [list, tabActive, width])

  const getTabActive = (index: number) => {
    const tabItem: HTMLLIElement | null = document.querySelector(`.tabs-item-${index}`)

    if (!tabItem || !lineRef.current) return

    const offsetLeft = tabItem.offsetLeft || 0
    const offsetWidth = tabItem.offsetWidth || 0
    lineRef.current.style.left = offsetLeft + 'px'
    lineRef.current.style.width = offsetWidth + 'px'
  }

  return (
    <ul className={twMerge(classNames(`flex items-center duration-150 ease-in-out`, className))}>
      {list.map(({ label, value }, index) => (
        <li
          className={twMerge(
            classNames(`select-none whitespace-nowrap cursor-pointer duration-150 ease-in-out tabs-item-${index} text-md
          ${value === tabActive ? tabActiveClassName : ''}`, labelClassName)
          )}
          key={index}
          onClick={() => {
            onChange?.(value)
          }}
        >
          {label}
        </li>
      ))}
    </ul>
  )
}

export { Tabs }
