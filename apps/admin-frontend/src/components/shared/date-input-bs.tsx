import "nepali-datepicker-reactjs/dist/index.css";
import { Button } from "../ui/button";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { CalendarIcon } from "lucide-react";
import { FormItem } from "../ui/form";
import { Label } from "../ui/label";
import NepaliDate from "nepali-date-converter";
import { useEffect } from "react";

const DateInputBS = ({
  value,
  label,
  required,
  onChange,
  adDate,
}: {
  value: string;
  label: string;
  required?: boolean;
  onChange?: (bsDate: string) => void;
  adDate?: string | Date;
}) => {
  // Convert AD date to BS when adDate changes
  useEffect(() => {
    if (adDate && !value) {
      const jsDate = adDate instanceof Date ? adDate : new Date(adDate);
      const nepDate = new NepaliDate(jsDate);
      const bsDateStr = `${nepDate.getYear()}-${nepDate.getMonth() + 1}-${nepDate.getDate()}`;
      onChange?.(bsDateStr);
    }
  }, [adDate, onChange, value]);

  return (
    <FormItem className="w-full">
      {label && (
        <div className="flex items-center gap-1 w-full ">
          <Label className="text-[14px] inline-flex text-text items-center justify-between font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}

            {required && <span className="text-red-500 font-bold"> *</span>}
          </Label>
        </div>
      )}
      <Button
        type="button"
        variant={"outline"}
        className="w-full flex justify-between"
      >
        <NepaliDatePicker
          value={value}
          inputClassName="w-full focus:outline-none cursor-pointer"
          options={{ calenderLocale: "ne", valueLocale: "en" }}
          className="w-full text-start"
          onChange={(bsDate) => {
            onChange?.(bsDate);
          }}
        />
        <CalendarIcon className="h-4 w-4 text-secondary -ml-4" />
      </Button>
    </FormItem>
  );
};

export default DateInputBS;
