import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/provider/use-auth";
import { Navigate } from "@tanstack/react-router";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_app/_user")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.auth.roles.includes("admin")) {
      return <Navigate to="/dashboard" />;
    }
  },
});

function RouteComponent() {
  const auth = useAuth();
  if (auth.roles.includes("admin")) {
    return <Navigate to="/dashboard" />;
  }
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex bg-primary font-raleway max-h-screen max-w-screen overflow-hidden">
      <div>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className="flex flex-col overflow-scroll w-full">
        <div className="bg-primary ">
          <Header />
        </div>
        <div className=" bg-card-primary px-[8px] py-[20px] h-[94dvh]  overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
