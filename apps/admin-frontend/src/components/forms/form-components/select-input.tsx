import {
  Select,
  SelectContent,
  SelectItem,
  type SelectProps,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Control, type FieldValues, type Path } from "react-hook-form";
import { getInputProps } from "./getInputProps";
import { InputField } from "./input-field";

type SelectInputProps<T extends FieldValues> = SelectProps & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  wrapperClassnName?: HTMLDivElement["className"];
  className?: HTMLDivElement["className"];
  options: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }[];
};

export const SelectInput = <T extends FieldValues>(
  props: SelectInputProps<T>,
) => {
  const [fieldProps, inputProps] = getInputProps(props);
  return (
    <InputField
      {...fieldProps}
      input={({ field }) => {
        return (
          <Select
            {...inputProps}
            onValueChange={(text) => {
              field.onChange(text);
              props.onValueChange?.(text);
            }}
            defaultValue={field.value}
            value={field.value}
          >
            <SelectTrigger className={inputProps.className} id={props.name}>
              <SelectValue
                placeholder={inputProps.placeholder || "Choose Option ..."}
                className="text-placeholder"
              ></SelectValue>
            </SelectTrigger>

            <SelectContent>
              {props.options.map((opt) => {
                if (typeof opt.value === "number") {
                }
                return (
                  <SelectItem
                    key={opt.value}
                    value={opt.value.toString()}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );
      }}
    />
  );
};
