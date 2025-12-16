import { type InputProps } from "@/components/ui/input";
import { type FieldValues } from "react-hook-form";
import { InputField, type InputFieldProps } from "./input-field";
import { getInputProps } from "./getInputProps";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type RadioProps<T extends FieldValues> = InputProps &
  Omit<InputFieldProps<T>, "input"> & {
    options: {
      label: string;
      value: string;
    }[];
  };

export const RadioInput = <T extends FieldValues>(props: RadioProps<T>) => {
  const [fieldProps, inputProps] = getInputProps(props);

  return (
    <div>
      <InputField
        {...fieldProps}
        input={({ field }) => (
          <RadioGroup
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(inputProps as any)}
            name={props.name}
            value={field.value}
            className="flex items-center  flex-wrap"
            onValueChange={(value: string) => {
              field.onChange(value);
            }}
          >
            {props.options.map((item, index) => (
              <div className="flex items-center f gap-2" key={index}>
                <RadioGroupItem
                  value={item.value}
                  className=" border-secondary"
                />
                <label
                  htmlFor={item.value}
                  className="text-text font-normal text-[14px]"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  );
};
