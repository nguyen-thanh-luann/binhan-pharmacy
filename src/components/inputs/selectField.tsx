import { OptionType } from '@/types'
import classNames from 'classnames'
import { Control, useController } from 'react-hook-form'
import Select, { Props } from 'react-select'

type SelectFieldProps = Props & {
  name: string
  control: Control<any>
  onChange?: (_: OptionType<any>) => void
  label?: string
  labelClassName?: string
  // isMulti?: boolean
}

export const SelectField = ({
  name,
  control,
  label,
  labelClassName,
  onChange: onChangeProps,
  ...attributes
}: SelectFieldProps) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  return (
    <div>
      {label ? (
        <label htmlFor={name} className={classNames(`text`, labelClassName)}>
          {label}
          <span className="text-red font-bold">{attributes?.required ? ' * ' : ''}</span>
        </label>
      ) : null}
      <Select
        ref={ref}
        id={name}
        className={classNames(attributes?.className, label ? 'mt-8' : '')}
        styles={attributes?.styles}
        onBlur={onBlur}
        onChange={(val) => {
          onChangeProps?.(val)
          onChange(val)
        }}
        value={value}
        {...attributes}
      />
      {error?.message && <div className="text !text-red">{error.message}</div>}
    </div>
  )
}
