import { Input, type InputProps } from "@/components/ui/input";
import { X } from "lucide-react";
import React from "react";
import {
  type FieldValues,
  type Path,
  type PathValue,
  useController,
  type UseControllerProps,
} from "react-hook-form";

type ArrayInputProps<T extends FieldValues> = InputProps &
  UseControllerProps<T> & {
    onArrayChange?: (values: string[]) => void;
    placeholder?: string;
    label: string;
  };

export const ArrayInput = <T extends FieldValues>(
  props: ArrayInputProps<T>,
) => {
  const {
    control,
    name,
    rules,
    label,
    shouldUnregister,
    defaultValue = [] as PathValue<T, Path<T>>,
    onArrayChange,
    placeholder = "Type and press Enter to add",
    ...inputProps
  } = props;

  const {
    field,
    fieldState: { error },
  } = useController<T>({
    name,
    control,
    rules,
    shouldUnregister,
    defaultValue: defaultValue as PathValue<T, Path<T>>,
  });
  const values = (field.value as string[]) || [];

  const handleAddValue = (newValue: string) => {
    if (newValue.trim()) {
      const updatedValues = [...values, newValue.trim()];
      field.onChange(updatedValues);
      onArrayChange?.(updatedValues);
    }
  };

  const handleRemoveValue = (indexToRemove: number) => {
    const updatedValues = values.filter((_, index) => index !== indexToRemove);
    field.onChange(updatedValues);
    onArrayChange?.(updatedValues);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddValue((e.target as HTMLInputElement).value);
      (e.target as HTMLInputElement).value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div>{label}</div>
      <div className="space-y-4">
        <Input
          {...inputProps}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />

        {values.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {values.map((value, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-secondary-300 text-white rounded-full border text-sm flex items-center gap-2"
              >
                <span>{value}</span>
                <button
                  type="button"
                  className="text-white hover:text-gray-600"
                  onClick={() => handleRemoveValue(index)}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default ArrayInput;
