import type React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookDashed,
  ChevronLeft,
  ChevronRight,
  Menu,
  SettingsIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { companyDetails } from "./config/company-details.config";
import { Cookies } from "react-cookie";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AdminSidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const cookies = new Cookies();
  // const { logout } = useAuth();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(
    cookies.get("isCollapsed") || false
  );

  const toggleCollapse = () => {
    cookies.set("isCollapsed", !isCollapsed);
    setIsCollapsed(!isCollapsed);
  };

  const NavItemsList = [
    {
      title: t("Dashboard"),
      url: "/dashboard",
      icon: BookDashed,
    },
    {
      title: t("User"),
      url: "/user",
      icon: User,
    },
    {
      sectionName: t("settings"),
      items: [
        {
          title: t("Setting"),
          url: "/setting",
          icon: SettingsIcon,
        },
      ],
    },
    // {
    //   title: t("Logout"),
    //   icon: LogOut,
    //   function: () => {
    //     logout();
    //   },
    // },
  ];

  const NavItem = ({
    item,
    onClick,
    isSubItem = false,
  }: {
    item: any;
    onClick: () => void;
    isSubItem?: boolean;
  }) => {
    const location = useRouterState();
    const isActive = location?.location?.pathname?.startsWith(item.url);
    return (
      <Link
        to={item.url}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium transition-all duration-200 hover:bg-white/10",
          isSubItem ? "ml-6 py-2" : "",
          isActive
            ? "bg-white/20 text-white shadow-sm"
            : "text-white/80 hover:text-white",
          isCollapsed && !isSubItem ? "justify-center px-2" : ""
        )}
      >
        <item.icon
          className={cn(
            "h-4 w-4 flex-shrink-0",
            isCollapsed && !isSubItem ? "h-5 w-5" : ""
          )}
        />
        {(!isCollapsed || isSubItem) && <span>{item.title}</span>}
      </Link>
    );
  };

  const SectionLabel = ({ children }: { children: React.ReactNode }) =>
    !isCollapsed && (
      <div className="px-3 py-2 text-xs font-semibold text-white/60 uppercase tracking-wider">
        {children}
      </div>
    );

  const renderNavContent = () => (
    <div className="flex flex-col h-full">
      {!isCollapsed ? (
        <div className="flex items-center justify-center p-2 border-b border-white/10">
          <div className="bg-white rounded-lg py-1 shadow-lg w-[150px]">
            <img
              src={companyDetails?.logo}
              alt={companyDetails?.name}
              className="w-full h-[100px] object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-2 border-b border-white/10">
          <div className="bg-white rounded-lg py-1 shadow-lg w-[50px]">
            <img
              src={companyDetails?.logo}
              alt={companyDetails?.name}
              className="w-full h-[50px] object-contain"
            />
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 py-6  overflow-y-auto">
        {NavItemsList.map((item: any, idx: number) => {
          return (
            <div key={idx}>
              {item?.function ? (
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium transition-all duration-200 hover:bg-white/10 text-white/80 hover:text-white",
                    isCollapsed ? "justify-center px-2" : ""
                  )}
                  onClick={item.function}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      isCollapsed ? "h-5 w-5" : ""
                    )}
                  />
                  {!isCollapsed && <span>{item.title}</span>}
                </div>
              ) : item.sectionName ? (
                <div>
                  <SectionLabel>{item.sectionName}</SectionLabel>
                  <div className="space-y-1">
                    {item?.items?.map((subItem: any) => (
                      <NavItem
                        key={subItem.title}
                        item={subItem}
                        onClick={() => setIsOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <NavItem
                  key={item.title}
                  item={item}
                  onClick={() => setIsOpen(false)}
                />
              )}
            </div>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/60 text-center">
            {companyDetails?.name}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className="w-72 p-0 bg-gradient-to-b from-primary to-primary border-r-0"
        >
          <div className="h-full">{renderNavContent()}</div>
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "hidden lg:flex flex-col h-screen bg-gradient-to-b from-primary  transition-all duration-300 relative shadow-xl",
          isCollapsed ? "w-16" : "w-72"
        )}
      >
        {renderNavContent()}

        <Button
          onClick={toggleCollapse}
          size="sm"
          variant="secondary"
          className="absolute bg-secondary text-black -right-3 top-5 h-6 w-6 rounded-full p-0 shadow-lg hover:shadow-xl hover:bg-secondary/80 transition-all duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        variant="outline"
        className="lg:hidden fixed top-3 left-4 z-50 h-10 w-10 p-0 bg-secondary text-white shadow-lg"
      >
        <Menu className="size-6 " />
      </Button>
    </>
  );
};

export default AdminSidebar;
