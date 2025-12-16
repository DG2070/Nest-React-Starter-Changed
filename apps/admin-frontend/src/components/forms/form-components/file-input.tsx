import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { getInputProps } from "./getInputProps";
import { InputField, type InputFieldProps } from "./input-field";
import { uploadFile } from "@/lib/utils";
import InfoCard from "@/components/shared/info-card";
type TextInputProps<T extends FieldValues> = InputProps &
  Omit<InputFieldProps<T>, "input"> & {
    horizontal?: boolean;
    isTypeSecond?: boolean;
    fileName?: string;
    info?: string;
  };

export const FileUpload = <T extends FieldValues>(props: TextInputProps<T>) => {
  const [fieldProps, inputProps] = getInputProps(props);
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState<string | null>(
    props.fileName ? props.fileName : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <InputField
      {...fieldProps}
      input={({ field: { onChange, value } }) => (
        <div>
          {" "}
          <Input
            ref={fileInputRef}
            id={fieldProps.name}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                try {
                  setLoading(true);
                  const res = await uploadFile(e.target.files[0]);
                  onChange(res);
                  setFilename(res as string);
                  setLoading(false);
                } catch (error) {
                  console.error(error);
                }
              }
            }}
          />
          {!inputProps.isTypeSecond ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center w-full h-32 border-[1px] border-dashed border-primary  bg-[#E9EBF1] hover:bg-gray-100 cursor-pointer">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Label
                    htmlFor={fieldProps.name}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {!filename && (
                      <div className="w-10 h-10 mb-2 text-gray-400">
                        {loading ? (
                          <svg
                            width="34"
                            height="33"
                            viewBox="0 0 34 33"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 16.5H23M17 10.5V22.5M32 16.5C32 24.7843 25.2843 31.5 17 31.5C8.71573 31.5 2 24.7843 2 16.5C2 8.21573 8.71573 1.5 17 1.5C25.2843 1.5 32 8.21573 32 16.5Z"
                              stroke="#F36026"
                              stroke-width="2.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <animateTransform
                                attributeName="transform"
                                type="rotate"
                                values="0 17 16.5;360 17 16.5"
                                dur="1s"
                                repeatCount="indefinite"
                              />
                            </path>
                          </svg>
                        ) : (
                          <svg
                            width="34"
                            height="33"
                            viewBox="0 0 34 33"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 16.5H23M17 10.5V22.5M32 16.5C32 24.7843 25.2843 31.5 17 31.5C8.71573 31.5 2 24.7843 2 16.5C2 8.21573 8.71573 1.5 17 1.5C25.2843 1.5 32 8.21573 32 16.5Z"
                              stroke="#F36026"
                              stroke-width="2.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    )}
                    <p className="text-[16px]   text-primary font-[500] ">
                      Click To Upload {fieldProps.label}
                    </p>
                    <div className="pt-2">
                      {filename && (
                        <a
                          className="text-sm text-gray-600 "
                          href={filename}
                          target="_blank"
                        >
                          {filename
                            ? filename?.split("_").slice(1).join("_")
                            : ""}
                        </a>
                      )}
                    </div>
                  </Label>

                  {value && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onChange("");
                        setFilename(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              {props.info && <InfoCard info={[{ title: props.info }]} />}
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <Label
                htmlFor={fieldProps.name}
                className="cursor-pointer py-3 pl-3 md:w-[338px]  flex items-center justify-between  rounded-[10px]  border-[1px] border-[#000000]/10 text-center text-text text-[14px] h-[38px] font-[400] "
              >
                <div>Choose a File</div>
                <div className="rounded-l-none text-[14px] text-white h-[38px] rounded-r-[6px] flex items-center cursor-pointer   font-normal p-3 bg-primary">
                  {loading ? "Uploading...": "Browse"}
                </div>
              </Label>
              <div className="flex items-center gap-2 ">
                <div>
                  {filename && (
                    <a
                      className="text-sm text-gray-600 "
                      href={filename}
                      target="_blank"
                    >
                      {filename ? filename?.split("_").slice(1).join("_") : ""}
                    </a>
                  )}
                </div>

                {value && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onChange("");
                      setFilename(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="text-white h-[38px] "
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
};
