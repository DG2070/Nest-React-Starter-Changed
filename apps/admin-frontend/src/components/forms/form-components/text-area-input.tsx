import type { FieldValues } from "react-hook-form";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { getInputProps } from "./getInputProps";
import { InputField, type InputFieldProps } from "./input-field";

type TextAreaInputProps<T extends FieldValues> = TextareaProps &
  Omit<InputFieldProps<T>, "input">;

export const TextAreaInput = <T extends FieldValues>(
  props: TextAreaInputProps<T>,
) => {
  const [fieldProps, inputProps] = getInputProps(props);
  return (
    <InputField
      {...fieldProps}
      input={({ field }) => (
        <Textarea
          {...inputProps}
          name={props.name}
          id={fieldProps.name}
          value={field.value}
          onChange={(e) => {
            field.onChange(e);
          }}
        />
      )}
    />
  );
};
