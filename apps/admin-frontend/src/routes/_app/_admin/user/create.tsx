import UserForm from "@/components/forms/forms/user-form/job-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_admin/user/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <UserForm />
    </div>
  );
}
