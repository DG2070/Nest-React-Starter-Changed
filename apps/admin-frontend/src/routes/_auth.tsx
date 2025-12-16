import { useAuth } from "@/provider/use-auth";
import {
  createFileRoute,
  Navigate,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { z } from "zod";

const authSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth")({
  validateSearch: authSearchSchema,
  beforeLoad({ context, search }) {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: search.redirect || "/",
      });
    }
  },
  component: Auth,
});

function Auth() {
  const { isAuthenticated } = useAuth();
  const search = Route.useSearch();

  if (isAuthenticated) {
    return <Navigate to={search.redirect || "/"} />;
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Outlet />
    </div>
  );
}