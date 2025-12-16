import { useAuth } from "@/provider/use-auth";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { companyDetails } from "./config/company-details.config";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Cookies } from "react-cookie";

export default function Header() {
  const { logout, user } = useAuth();
  const cookies = new Cookies();
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: any) => {
    i18n.changeLanguage(lng);
  };
  return (
    <div className="py-2 px-8 w-full flex justify-between items-center bg-amber-700  border-l">
      <div className="hidden sm:flex text-text-white text-lg font-medium flex-col ">
        <div className="ext-white text-xl font-bold">
          {companyDetails?.name}
        </div>
        <div className="text-white text-sm ">
          {t("Hi")}, {(user as any)?.name || user?.email}
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <select
          onChange={(e) => {
            cookies.set("langauge", e.target.value);
            changeLanguage(e.target.value);
          }}
          className="bg-transparent text-text-white border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
          value={i18n.language}
        >
          <option value="en" className="bg-gray-800 text-xl">
            🇺🇲
          </option>
          <option value="np" className="bg-gray-800">
            🇳🇵
          </option>
        </select>
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarFallback>
                {(user as any)?.name?.[0] || "NA"}
              </AvatarFallback>
              <AvatarImage src={(user as any)?.image} />
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="space-y-2">
            <div>{(user as any)?.name}</div>
            <div>{(user as any)?.email}</div>
            <hr />
            <div
              className="flex items-center gap-1 mt-2 hover:bg-gray-200 p-2 rounded cursor-pointer"
              onClick={logout}
            >
              <LogOut className="size-4" />
              <div>{t("Logout")}</div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
