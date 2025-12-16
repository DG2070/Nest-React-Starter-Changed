import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
  type UseControllerProps,
} from "react-hook-form";

interface FieldSchema {
  label: string;
  type: "text" | "select";
  placeholder?: string;
  options?: {
    label: string;
    value: string;
    disabled?: boolean;
  }[];
}

interface Schema {
  [key: string]: FieldSchema;
}

export type SelectTextObjectArrayInputProps<TFieldValues extends FieldValues> =
  {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    schema: Schema;
    label: string;
    rules?: UseControllerProps<TFieldValues>["rules"];
  };

function SelectTextObjectInput<TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  schema,
  label,
}: SelectTextObjectArrayInputProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  const values = (field.value as Array<Record<string, string>>) || [];

  const addObject = () => {
    const newObject = Object.keys(schema).reduce(
      (acc, key) => {
        acc[key] = "";
        return acc;
      },
      {} as Record<string, string>,
    );

    const updatedValues = [...values, newObject];
    field.onChange(updatedValues);
  };

  const removeObject = (indexToRemove: number) => {
    const updatedValues = values.filter((_, index) => index !== indexToRemove);
    field.onChange(updatedValues);
  };

  const updateObjectField = (
    index: number,
    fieldName: string,
    value: string,
  ) => {
    const updatedValues = [...values];
    updatedValues[index] = {
      ...updatedValues[index],
      [fieldName]: value,
    };
    field.onChange(updatedValues);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="font-medium">{label}</div>
        <Button
          type="button"
          onClick={addObject}
          className="flex items-center gap-2 bg-slate-600"
        >
          <Plus className="size-4" />
          Add New
        </Button>
      </div>

      <div className="space-y-4">
        {values.map((obj, index) => (
          <Card key={index} className="px-2 relative">
            <button
              type="button"
              onClick={() => removeObject(index)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              <X className="size-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Object.keys(schema).map((fieldName) => (
                <div key={fieldName} className="space-y-2">
                  <label className="text-sm font-medium">
                    {schema[fieldName].label}
                  </label>
                  {schema[fieldName].type === "select" ? (
                    <Select
                      value={obj[fieldName] || ""}
                      onValueChange={(value) =>
                        updateObjectField(index, fieldName, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            schema[fieldName].placeholder ||
                            "Select an option..."
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {schema[fieldName].options?.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type="text"
                      value={obj[fieldName] || ""}
                      onChange={(e) =>
                        updateObjectField(index, fieldName, e.target.value)
                      }
                      placeholder={
                        schema[fieldName].placeholder || `Enter ${fieldName}`
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default SelectTextObjectInput;
