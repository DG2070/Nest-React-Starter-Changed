import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar-admin";
import { useAuth } from "@/provider/use-auth";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_app/_admin")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.auth.roles.includes("user")) {
      return <Navigate to="/" />;
    }
  },
});

function RouteComponent() {
  const auth = useAuth();
  if (auth.roles.includes("user")) {
    return <Navigate to="/" />;
  }
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex bg-primary font-raleway max-h-screen max-w-screen overflow-hidden">
      <div><Sidebar isOpen={isOpen} setIsOpen={setIsOpen} /></div>
      <div
        className="flex flex-col overflow-scroll w-full" 
      >
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
