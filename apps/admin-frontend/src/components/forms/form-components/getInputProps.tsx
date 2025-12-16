import { type FieldValues } from "react-hook-form";
import { type InputFieldProps } from "./input-field";

export function getInputProps<T extends FieldValues, U>(
  props: Omit<InputFieldProps<T>, "input"> & U,
) {
  const { name, label, description, control, labelright, required, ...extras } =
    props;

  const fieldProps = {
    name,
    labelright,
    label,
    description,
    control,
    required,
  } as unknown as InputFieldProps<T>;

  return [fieldProps, extras] as const;
}
