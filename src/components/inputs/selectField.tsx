import { OptionType } from "@/types";
import { Control, useController } from "react-hook-form";
import Select, { Props } from "react-select";

type SelectFieldProps = Props & {
	name: string;
	control: Control<any>;
	onChange?: (_: OptionType<any>) => void;
  label?: string;
};

export const SelectField = ({
	name,
	control,
  label,
	onChange: onChangeProps,
	...attributes
}: SelectFieldProps) => {
	const {
		field: { onChange, onBlur, value, ref },
		fieldState: { error },
	} = useController({
		name,
		control,
	});

	return (
    <div>
      {label ? (
        <label htmlFor={name} className={`text`}>
          {label}
          <span className="text-red font-bold">{attributes?.required ? ' * ' : ''}</span>
        </label>
      ) : null}
      <Select
        ref={ref}
        id={name}
        className={attributes?.className}
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
};
