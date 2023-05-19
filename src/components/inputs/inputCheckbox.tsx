import { CheckIcon } from "@/assets"
import classNames from "classnames"
import { twMerge } from "tailwind-merge"


interface InputCheck {
  onCheck: Function
  isChecked: boolean
  type?: "radio" | "checkbox"
  className?: string
}

export const InputCheckbox = ({
  onCheck,
  isChecked,
  type = "checkbox",
  className
}: InputCheck) => {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation()
        onCheck && onCheck()
      }}
      className={twMerge(
        classNames(`flex items-center justify-center w-20 h-20 border rounded-md cursor-pointer
      hover:border-primary
      duration-150 ease-in-out
       ${isChecked ? 'bg-primary border-primary' : 'border-gray-400'} ${
          type === 'radio' && isChecked ? '' : ''
        }`, className)
      )}
    >
      {isChecked ? <CheckIcon className="text-white font-bold text-sm" /> : null}
    </span>
  )
}
