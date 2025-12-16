import { cn } from "@/lib/utils";

interface MyCardProps {
  children: React.ReactNode;
  borderColor?: "secondary" | "primary";
  backgroundColor?: "white" | "primary";
  className?: string;
}
export function MyCard({
  children,
  borderColor = "secondary",
  backgroundColor = "white",
  className,
}: MyCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg py-[22px] px-[10px] flex flex-col gap-[13px] border",
        borderColor === "secondary" ? " border-secondary" : "border-primary",
        backgroundColor === "primary" ? "bg-card-primary" : "white",
        className,
      )}
    >
      {children}
    </div>
  );
}
