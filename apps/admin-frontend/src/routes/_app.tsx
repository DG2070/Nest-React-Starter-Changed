import LoadingSpinner from "@/components/shared/loader";
import { useAuth } from "@/provider/use-auth";
import {
  createFileRoute,
  Navigate,
  Outlet,
  redirect
} from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  beforeLoad({ context, location }) {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: App,
});

function App() {
  const { isAuthenticated, loading } = useAuth();
  const currentLocation = window.location.pathname
  if (!isAuthenticated) {
    return <Navigate to="/login" search={{ redirect: currentLocation }} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return <Outlet />;
}
