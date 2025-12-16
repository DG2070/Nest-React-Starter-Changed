import JobForm from "@/components/forms/forms/user-form/job-form";
import FormGroupLabel from "@/components/shared/form-group-label";
import MyButton from "@/components/shared/my-button";
import Mysheet from "@/components/shared/my-sheet";
import { DataTable } from "@/components/table/table-component/data-table";
import { Fetch } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import MyDeleteButton from "../shared/delete-button";
import { Edit } from "lucide-react";
import type { UserFormType } from "../forms/forms/user-form/user-schema";
import useUserForm from "../forms/forms/user-form/use-user-form";
import UserForm from "@/components/forms/forms/user-form/job-form";
import { Link } from "@tanstack/react-router";

const columns: ColumnDef<UserFormType>[] = [
  {
    accessorKey: "id",
    header: "SN",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const { onDelete } = useUserForm(row.original.id);
      console.log(open);
      return (
        <div className="flex gap-2">
          <Mysheet
            open={open}
            setOpen={setOpen}
            openButton={<Edit className="h-4 w-4 text-primary" />}
          >
            <UserForm
              userId={row.original.id}
              dialogClose={() => setOpen(false)}
            />
          </Mysheet>
          <MyDeleteButton name={row.original.firstName} onClick={onDelete} />
        </div>
      );
    },
  },
];

const UserTable = () => {
  const { data } = useQuery<{ data: UserFormType[] }>({
    queryKey: ["all-users"],
    queryFn: () =>
      Fetch({
        method: "GET",
        url: `/`,
      }),
  });
  const [open, setOpen] = useState(false);
  return (
    <div className="">
      <div className="flex items-center justify-between gap-4">
        <FormGroupLabel label="User Management" />
        <Link to="/user/create">
          <MyButton label="Create New User" plusIcon className="mb-4" />
        </Link>
        <Mysheet
          open={open}
          setOpen={setOpen}
          openButton={
            <MyButton label="Create New User" plusIcon className="mb-4" />
          }
        >
          <JobForm dialogClose={() => setOpen(false)} />
        </Mysheet>
      </div>
      <DataTable columns={columns} data={data?.data ?? []} />
    </div>
  );
};

export default UserTable;
