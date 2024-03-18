"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { labels, priorities, statuses } from "../../profile/data/data";
import { Task } from "../../profile/data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Task>[] = [
  {
    id: "selectionGroup", // Group 1: Selection Group
    header: "Selection", // Group header
    enableResizing: true,
    enableHiding: true,
    columns: [
      {
        accessorKey: "select",
        enableSorting: false,
        enableHiding: true,
        enableResizing: true,
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
      },
    ],
  },
  {
    id: "taskInfoGroup", // Group 2: Task Info Group
    header: "Task Info", // Group header
    enableResizing: true,
    enableHiding: true,
    columns: [
      {
        accessorKey: "id",
        enableResizing: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Task" />
        ),
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
        enableSorting: false,
        enableHiding: true,
      },
      {
        accessorKey: "title",
        enableResizing: true,
        enableHiding: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => {
          const label = labels.find(
            (label) => label.value === row.original.label
          );

          return (
            <div className="flex space-x-2">
              {label && <Badge variant="outline">{label.label}</Badge>}
              <span className="max-w-[500px] truncate font-medium">
                {row.getValue("title")}
              </span>
            </div>
          );
        },
      },
    ],
  },
  {
    id: "statusPriorityGroup", // Group 3: Status & Priority Group
    header: "Status & Priority", // Group header
    enableResizing: true,
    enableHiding: true,
    columns: [
      {
        accessorKey: "status",
        enableResizing: true,
        enableHiding: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = statuses.find(
            (status) => status.value === row.getValue("status")
          );

          if (!status) {
            return null;
          }

          return (
            <div className="flex w-[100px] items-center">
              {status.icon && (
                <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{status.label}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "priority",
        enableResizing: true,
        enableHiding: true,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Priority" />
        ),
        cell: ({ row }) => {
          const priority = priorities.find(
            (priority) => priority.value === row.getValue("priority")
          );

          if (!priority) {
            return null;
          }

          return (
            <div className="flex items-center">
              {priority.icon && (
                <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{priority.label}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
    ],
  },
  {
    id: "actions", // Group 4: Actions Group
    header: "Actions", // Group header
    enableResizing: true,
    enableHiding: true,
    columns: [
      {
        accessorKey: "actionsColumn",
        enableResizing: true,
        enableHiding: true,
        cell: ({ row }) => <DataTableRowActions row={row} />,
      },
    ],
  },
];
