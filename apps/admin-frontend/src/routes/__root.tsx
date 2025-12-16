import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { useAuth } from "@/provider/use-auth";
import { Toaster } from "@/components/ui/sonner";
import "@/i18n/i18n.js";
import NotFoundPage from "@/components/shared/not-found-page";
export const Route = createRootRouteWithContext<{
  auth: ReturnType<typeof useAuth>;
}>()({
  component: () => {
    return (
      <>
        <Outlet />
        <Toaster richColors />
      </>
    );
  },
  notFoundComponent: NotFoundPage,
});
