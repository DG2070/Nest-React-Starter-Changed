import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

interface MyDialogProps {
  title: string;
  children: React.ReactNode;
  openButton: React.ReactNode;
  open: boolean;
  setOpen: (val: boolean) => void;
}

const MyDialog = ({
  title,
  children,
  openButton,
  open,
  setOpen,
}: MyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{openButton}</DialogTrigger>
      <DialogContent cross={false} className=" p-0 min-w-[600px]">
        <div className="flex rounded-t-xl justify-between items-center px-5 py-3 bg-[#E9EBF1]">
          <div className="font-raleway text-primary text-xl font-[600] ">
            {title}
          </div>
          <div>
            <X
              onClick={() => {
                setOpen(false);
              }}
              className="cursor-pointer hover:rotate-180 duration-200 w-4 h-4 text-primary"
            />
          </div>
        </div>
        <div className="px-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default MyDialog;
