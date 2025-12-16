import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { type InputProps } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getInputProps } from "./getInputProps";
import { InputField, type InputFieldProps } from "./input-field";
import NepaliDate from "nepali-date-converter";
import { useState } from "react";

type TextInputProps<T extends FieldValues> = Omit<InputProps, "disabled"> &
  Omit<InputFieldProps<T>, "input"> & {
    disabled?: (date: Date) => boolean;
    onBsDateChange?: (bsDate: string) => void;
  };

export const DateInput = <T extends FieldValues>(props: TextInputProps<T>) => {
  const [fieldProps, inputProps] = getInputProps(props);
  return (
    <InputField
      {...fieldProps}
      input={({ field }) => {
        const [open, setOpen] = useState(false);
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 text-secondary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown-buttons"
                selected={field.value}
                onSelect={(date) => {
                  if (date) {
                    field.onChange(date.toUTCString());
                    try {
                      if (props.onBsDateChange) {
                        const nepDate = new NepaliDate(date);
                        const bsDateStr = `${nepDate.getYear()}-${nepDate.getMonth() + 1}-${nepDate.getDate()}`;
                        props.onBsDateChange(bsDateStr);
                      }
                    } catch (error) {
                      console.error("Error converting AD to BS date:", error);
                    }
                  }
                  setOpen(false);
                }}
                disabled={inputProps.disabled}
                initialFocus
                fromYear={1960}
                toYear={2030}
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};
