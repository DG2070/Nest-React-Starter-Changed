import {
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from "input-otp";
import type { FieldValues } from "react-hook-form";
import { type InputProps } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { getInputProps } from "./getInputProps";
import { InputField, type InputFieldProps } from "./input-field";

type OTPInputProps<T extends FieldValues> = Omit<
  InputFieldProps<T>,
  "input"
> & {
  length: number;
  pattern?: "digits" | "chars" | "digitsAndChars";
} & Omit<
    InputProps,
    | "maxLength"
    | "value"
    | "onChange"
    | "textAlign"
    | "onComplete"
    | "pushPasswordManagerStrategy"
    | "containerClassName"
    | "noScriptCSSFallback"
  >;

export const OTPInput = <T extends FieldValues>(props: OTPInputProps<T>) => {
  const [fieldProps, inputProps] = getInputProps(props);

  let pattern = REGEXP_ONLY_DIGITS;
  if (props.pattern === "chars") {
    pattern = REGEXP_ONLY_CHARS;
  } else if (props.pattern === "digitsAndChars") {
    pattern = REGEXP_ONLY_DIGITS_AND_CHARS;
  }

  return (
    <InputField
      {...fieldProps}
      input={({ field }) => (
        <InputOTP
          maxLength={inputProps.length}
          {...field}
          {...inputProps}
          pattern={pattern}
        >
          {[...Array(inputProps.length)].map((_, index) => (
            <InputOTPGroup key={index}>
              <InputOTPSlot index={index} />
            </InputOTPGroup>
          ))}
        </InputOTP>
      )}
    />
  );
};
