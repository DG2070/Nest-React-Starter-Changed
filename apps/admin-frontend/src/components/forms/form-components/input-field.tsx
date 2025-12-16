import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type UseFormStateReturn,
} from "react-hook-form";

export type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  labelright?: React.ReactElement;
  description?: string;
  required?: boolean;
  input: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<T>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
  }) => React.ReactElement;
};

export const InputField = <T extends FieldValues>({
  name,
  label,
  description,
  labelright,
  control,
  input,
  required,
}: InputFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => (
        <FormItem className="w-full">
          {label && (
            <div className="flex items-center gap-1 w-full ">
              <Label
                htmlFor={name}
                className="text-[14px] inline-flex text-text    items-center justify-between font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
                {labelright}

                {required && <span className="text-red-500 font-bold"> *</span>}
              </Label>
            </div>
          )}

          <FormControl>{input({ field, fieldState, formState })}</FormControl>

          {description && (
            <FormDescription className="text-sm text-muted-foreground">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
