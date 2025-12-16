import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { X } from "lucide-react";
import React from "react";

const Mysheet = ({
  children,
  open,
  setOpen,
  openButton,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: (value: boolean) => void;
  openButton: React.ReactNode;
}) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{openButton}</SheetTrigger>
      <SheetContent className="min-w-[70dvw]" cross={false}>
        <div
          className="p-1 absolute top-2 -left-[33px] bg-primary rounded-l-[12px]"
          onClick={() => setOpen(false)}
        >
          <X className="text-primary-foreground hover:rotate-180 duration-200 cursor-pointer" />
        </div>
        <div className="h-full">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default Mysheet;
