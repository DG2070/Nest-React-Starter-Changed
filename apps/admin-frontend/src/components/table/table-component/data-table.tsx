import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import MyButton from "@/components/shared/my-button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ArrowRight, Search, Triangle } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: boolean;
  filters?: boolean;
  viewButton?: boolean;
  tableName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  filters,
  viewButton,
  tableName,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col  gap-5 w-full">
      {filters && (
        <div className="flex items-center gap-4 justify-between w-full ">
          <div className="relative flex items-center flex-1">
            <input
              type="text"
              placeholder="search Positions"
              className="border-input border rounded-md p-3 w-full"
            />
            <Search className="w-4 h-4 absolute right-2 text-secondary" />
          </div>
          {[
            {
              title: "All Department",
              onclick: () => {},
            },
            {
              title: "All Types",
              onclick: () => {},
            },
            {
              title: "Newest First",
              onclick: () => {},
            },
          ].map((item) => (
            <div className="flex p-3 items-center gap-3 border border-secondary cursor-pointer ">
              <div>{item.title}</div>
              <Triangle className="rotate-180 w-5 h-5" />
            </div>
          ))}
        </div>
      )}

      <Card className="rounded-md border-[1px] border-secondary/50 bg-white px-7 py-4">
        <div className="flex justify-between w-full items-center pb-2 mb-3">
          {" "}
          <div className="text-primary text-[22px] font-[600] leading-[30px] ">
            {tableName}
          </div>
          {viewButton && <MyButton variant="outline" label="View all" />}
        </div>

        <Table>
          <TableHeader className="bg-primary ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-white text-[18px] font-[700]  h-[36px] "
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="font-open-sans">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-[58px]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-text text-[16px] font-normal leading-[22px]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className=" text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {pagination && (
          <Pagination className="pt-5">
            <PaginationContent>
              <PaginationItem>
                <ArrowLeft className="text-primary" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink val="1" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink val="2" isActive />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink val="3" />
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <ArrowRight className="text-primary" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </Card>
    </div>
  );
}
