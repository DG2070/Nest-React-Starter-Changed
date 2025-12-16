import UserTable from "@/components/table/user-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_admin/user/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <UserTable />
    </div>
  );
}
