import { cn, uploadFile } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInputProps } from "./getInputProps";
import { InputField, type InputFieldProps } from "./input-field";
type TextInputProps<T extends FieldValues> = InputProps &
  Omit<InputFieldProps<T>, "input"> & {
    defaultImageUrl?: string;
    horizontal?: boolean;
  };

export const ImageInput = <T extends FieldValues>(props: TextInputProps<T>) => {
  const [fieldProps, inputProps] = getInputProps(props);
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(
    inputProps.defaultImageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearFile = (onChange: (file: File | null) => void) => {
    setPreview("");
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    setPreview(inputProps.defaultImageUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultImageUrl]);

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  return (
    <InputField
      {...fieldProps}
      input={({ field: { onChange, value } }) => (
        <div
          className={cn(
            "flex flex-col items-start md:items-end gap-2",
            inputProps.horizontal && "flex-col md:flex-row",
          )}
        >
          <div className="w-[183px] h-[135px] rounded-[6px] bg-[#C0C0C0]/50 flex items-center justify-center overflow-hidden">
            {preview && (
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor={fieldProps.name}
                className="cursor-pointer p-3  flex items-center  rounded-[10px]  border-[1px]  border-[#000000]/10 text-center text-text text-[16px] h-[38px]  font-normal"
              >
                {loading ? "Uploading..." : "Upload" }
              </Label>
              <Input
                id={fieldProps.name}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    try {
                      setLoading(true)
                      const res = await uploadFile(e.target.files[0]).then(()=>{setLoading(false)})
                      onChange(res);
                      handleFile(e.target.files[0]);
                    } catch (error) {
                      console.error(error);
                    }
                  }
                }}
              />
              {value && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onChange("");
                    handleClearFile(onChange);
                  }}
                  className="text-white  h-[38px]"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
};
