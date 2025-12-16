import { type FieldValues } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { type InputProps } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { type InputFieldProps } from "./input-field";

type TextInputProps<T extends FieldValues> = InputProps &
  Omit<InputFieldProps<T>, "input">;

export const SwitchInput = <T extends FieldValues>(
  props: TextInputProps<T>,
) => {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center space-x-2">
            <Switch
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label
              htmlFor={props.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {props.label}
            </label>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
