import { Diamond } from "lucide-react";

export default function FormGroupLabel({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center gap-[10px] mb-4">
      <div className="text-[20px] text-primary font-[600] ">{label}</div>
      <div className="flex items-center w-full flex-1">
        <Diamond className="w-4 h-4 text-secondary" fill="currentColor" />
        <div className="w-full h-[1px] bg-secondary -mx-1" />
        <Diamond className="w-4 h-4 text-secondary" fill="currentColor" />
      </div>
    </div>
  );
}
