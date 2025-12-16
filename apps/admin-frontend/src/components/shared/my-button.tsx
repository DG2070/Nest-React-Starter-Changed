import { ArrowLeft, ArrowRight, LucideLoader, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface MyButtonProps {
  label?: string;
  plusIcon?: boolean;
  arrowLeftIcon?: boolean;
  arrowRightIcon?: boolean;
  deleteIcon?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "saved"
    | "secondary";
  type?: "button" | "submit" | "reset";
}

export default function MyButton({
  label,
  type = "submit",
  plusIcon,
  arrowLeftIcon,
  arrowRightIcon,
  deleteIcon,
  onClick,
  className,
  disabled,
  loading,
  loadingLabel,
  variant = "default",
}: MyButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(
        " pointer-cursor",
        variant === "default"
          ? "bg-secondary hover:bg-secondary/80 text-white"
          : "",
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {loading ? (
        <div className="flex items-center  gap-2 justify-center">
          <LucideLoader className="w-4 h-4 animate-spin" />
          {loadingLabel && (
            <div className="text-[16px] font-normal ">{loadingLabel}</div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {plusIcon && <Plus />}
          {arrowLeftIcon && <ArrowLeft />}
          {deleteIcon && <Trash />}
          {label && <span className="text-[16px] font-normal ">{label}</span>}
          {arrowRightIcon && <ArrowRight />}
        </div>
      )}
    </Button>
  );
}
