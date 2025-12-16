import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker, type DropdownProps } from "react-day-picker";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rounded-lg pb-2", className)}
      classNames={{
        months: "flex flex-col sm:flex-row  sm:space-x-4  sm:space-y-0",
        month: "",
        caption:
          "flex justify-between  relative items-center font-[700] py-1 px-2 border-b ",
        caption_label: " hidden ",
        caption_dropdowns: "flex justify-center   gap-1  ",
        nav: "space-x-1 flex items-center ",
        nav_button: cn(
          "h-6 w-6 text-white bg-text flex rounded-full items-center justify-center"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full  border-collapse",
        head_row: "flex",
        head_cell: "rounded-md w-9  text-text font-normal text-[14px] mt-1",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-6 w-9 p-1 rounded-full font-[700] aria-selected:opacity-100 text-[14px] text-text hover:bg-primary/20"
        ),
        day_selected:
          "bg-secondary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-primary/20 text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",

        ...classNames,
      }}
      components={{
        Dropdown: ({ value, onChange, children }: DropdownProps) => {
          const options = React.Children.toArray(
            children
          ) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[];
          const selected = options.find((child) => child.props.value === value);
          const handleChange = (value: string) => {
            const changeEvent = {
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange?.(changeEvent);
          };
          return (
            <Select
              value={value?.toString()}
              onValueChange={(value) => {
                handleChange(value);
              }}
            >
              <SelectTrigger className="border-0 p-0  text-text text-[14px] font-[700] focus:ring-0 focus:ring-offset-0  ">
                <SelectValue className="text-text !font-[700] !text-[14px]">
                  {selected?.props?.children}
                </SelectValue>
              </SelectTrigger>
              <SelectContent position="popper">
                <ScrollArea className="h-80">
                  {options.map((option, id: number) => (
                    <SelectItem
                      key={`${option.props.value}-${id}`}
                      value={option.props.value?.toString() ?? ""}
                    >
                      {option.props.children}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          );
        },
        IconLeft: () => <ChevronLeft className="h-4 w-4 " />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
