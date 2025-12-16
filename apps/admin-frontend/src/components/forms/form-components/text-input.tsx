import { Input, type InputProps } from "@/components/ui/input";
import { type FieldValues } from "react-hook-form";
import { getInputProps } from "./getInputProps";
import { InputField, type InputFieldProps } from "./input-field";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type TextInputProps<T extends FieldValues> = InputProps &
  Omit<InputFieldProps<T>, "input"> & { isPassword?: boolean };

export const TextInput = <T extends FieldValues>(props: TextInputProps<T>) => {
  const [fieldProps, inputProps] = getInputProps(props);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <InputField
      {...fieldProps}
      input={({ field }) => (
        <div className="relative">
          <Input
            type={
              inputProps.type === "password"
                ? showPassword
                  ? (inputProps.type = "text")
                  : (inputProps.type = "password")
                : inputProps.type
            }
            {...inputProps}
            name={props.name}
            id={fieldProps.name}
            required={props.required}
            value={field.value}
            onChange={(e) => {
              if (inputProps.type == "number") {
                return field.onChange(parseInt(e.target.value));
              }
              field.onChange(e);
            }}
          />
          {props.isPassword && (
            <div className="absolute right-0 top-0">
              <Button variant="link" size="icon" type="button">
                <Eye
                  className={showPassword ? "hidden" : "h-4 w-4"}
                  onClick={() => setShowPassword(true)}
                />
                <EyeOff
                  onClick={() => setShowPassword(false)}
                  className={showPassword ? "h-4 w-4" : "hidden"}
                />
              </Button>
            </div>
          )}
        </div>
      )}
    />
  );
};
