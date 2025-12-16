import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  type SelectProps,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import React from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

type MultiSelectInputProps<T extends FieldValues> = Omit<
  SelectProps,
  "onValueChange" | "value" | "defaultValue"
> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  labelright?: React.ReactElement;
  placeholder?: string;
  description?: string;
  wrapperClassnName?: HTMLDivElement["className"];
  className?: HTMLDivElement["className"];
  tagClassName?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }[];
  onArrayChange?: (values: string[]) => void;
};

export const MultiSelectInput = <T extends FieldValues>(
  props: MultiSelectInputProps<T>,
) => {
  const {
    control,
    name,
    label,
    required,
    labelright,

    placeholder = "Select options...",
    description,
    wrapperClassnName,
    className,
    tagClassName = "px-3 py-1  text-text rounded-full border text-sm flex items-center gap-2",
    options,
    onArrayChange,
    ...selectProps
  } = props;

  const [selectValue, setSelectValue] = React.useState<string>("");

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: [] as any,
  });

  const values = (field.value as string[]) || [];

  const handleAddValue = (newValue: string) => {
    if (values.includes(newValue)) return;

    const updatedValues = [...values, newValue];
    field.onChange(updatedValues);
    onArrayChange?.(updatedValues);
    setSelectValue("");
  };

  const handleRemoveValue = (valueToRemove: string) => {
    const updatedValues = values.filter((value) => value !== valueToRemove);
    field.onChange(updatedValues);
    onArrayChange?.(updatedValues);
  };

  return (
    <div className="space-y-2 w-full">
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

      <div className="space-y-2">
        <Select
          {...selectProps}
          value={selectValue}
          onValueChange={(value) => {
            handleAddValue(value);
          }}
        >
          <SelectTrigger className={className} id={name}>
            <SelectValue
              placeholder={placeholder}
              className="text-placeholder"
            />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled || values.includes(opt.value)}
              >
                <div className="flex items-center">
                  {opt.icon && <span className="mr-2">{opt.icon}</span>}
                  <span>{opt.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {values.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {values.map((value) => {
              const option = options.find((opt) => opt.value === value);

              return (
                <div key={value} className={tagClassName}>
                  <span>{option?.label || value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(value)}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default MultiSelectInput;
