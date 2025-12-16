import {type  InputProps } from "@/components/ui/input";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { type FieldValues } from "react-hook-form";
import { getInputProps } from "./getInputProps";
import { InputField, type InputFieldProps } from "./input-field";

type TextInputProps<T extends FieldValues> = InputProps &
  Omit<InputFieldProps<T>, "input">;

export const PhoneNumberInput = <T extends FieldValues>(
  props: TextInputProps<T>,
) => {
  const [fieldProps, inputProps] = getInputProps(props);
  return (
    <InputField
      {...fieldProps}
      input={({ field }) => (
        <PhoneInput
          className="focus:none w-full h-8 rounded-md border-[1px] p-2"
          {...inputProps}
          name={props.name}
          id={fieldProps.name}
          defaultCountry="NP"
          value={field.value}
          onChange={(value) => {
            if (inputProps.type !== "string") {
              return field.onChange(value?.toString());
            }
            field.onChange(value);
          }}
        />
      )}
    />
  );
};