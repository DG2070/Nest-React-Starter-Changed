import { type InputProps } from "@/components/ui/input";
import { type  FieldValues } from "react-hook-form";
import { InputField, type InputFieldProps } from "./input-field";
import { getInputProps } from "./getInputProps";
import { Checkbox } from "@/components/ui/checkbox";

type CheckBoxProps<T extends FieldValues> = InputProps &
  Omit<InputFieldProps<T>, "input"> & {
    options: {
      label: string;
      value: string | number;
    }[];
  };

export const MultipleCheckBoxInput = <T extends FieldValues>(
  props: CheckBoxProps<T>,
) => {
  const [fieldProps, _inputProps] = getInputProps(props);
  return (
    <div>
      <InputField
        {...fieldProps}
        input={({ field }) => (
          <div className="grid grid-cols-2 gap-1">
            {props.options.map((item) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={field.value?.includes(item.value)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([...(field.value || []), item.value])
                      : field.onChange(
                          field.value?.filter(
                            (value: string | number) => value !== item.value,
                          ),
                        );
                  }}
                />
                <label>{item.label}</label>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};