import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon?: LucideIcon;
  label: string;
  isActive?: boolean;
  className?: string;
}

export default function NavItem({
  to,
  icon: Icon,
  label,
  isActive = false,
  className,
}: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center justify-between text-white p-2 ",
        isActive && "bg-secondary",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5" />}

        <span className="text-[16px] ">{label}</span>
      </div>
    </Link>
  );
}
