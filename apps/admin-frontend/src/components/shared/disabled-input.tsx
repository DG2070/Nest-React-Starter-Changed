import { FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
interface DiasbledInputProp {
  label: string;
  required?: boolean;
  value: string | undefined;
}
const DiasbledInput = ({ label, required, value }: DiasbledInputProp) => {
  return (
    <FormItem className="w-full">
      {label && (
        <div className="flex items-center gap-1 w-full ">
          <Label className="text-[14px] inline-flex text-text    items-center justify-between font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}

            {required && <span className="text-red-500 font-bold"> *</span>}
          </Label>
        </div>
      )}

      <Input disabled value={value} />
    </FormItem>
  );
};

export default DiasbledInput;
