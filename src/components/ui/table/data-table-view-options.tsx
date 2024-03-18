// "use client";
// import React from "react";
// import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
// import { MixerHorizontalIcon } from "@radix-ui/react-icons";
// import { Table } from "@tanstack/react-table";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";

// interface DataTableViewOptionsProps<TData> {
//   table: Table<TData>;
//   columns: {
//     id: string;
//     getCanHide: () => boolean;
//     getIsVisible: () => boolean;
//     toggleVisibility: (visible: boolean) => void;
//   }[];
// }

// export function DataTableViewOptions<TData>({
//   table,
//   columns,
// }: DataTableViewOptionsProps<TData>) {
//   const groupMapping: Record<string, string[]> = {
//     "Selection Group": ["select"],
//     "Task Info Group": ["id", "title"],
//     "Status & Priority Group": ["status", "priority"],
//     "Actions Group": ["actionsColumn"],
//   };

//   const toggleGroupVisibility = (groupId: string, visible: boolean) => {
//     const columnIds = groupMapping[groupId];
//     if (columnIds) {
//       for (const columnId of columnIds) {
//         const column = columns.find((col) => col.id === columnId);
//         if (column) {
//           column.toggleVisibility(visible);
//         }
//       }
//     }
//   };
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className="ml-auto hidden h-8 lg:flex"
//         >
//           <MixerHorizontalIcon className="mr-2 h-4 w-4" />
//           View
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-[150px]">
//         <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         {Object.keys(groupMapping).map((groupId) => (
//           <React.Fragment key={groupId}>
//             <DropdownMenuCheckboxItem
//               className="capitalize"
//               checked={columns.some(
//                 (col) =>
//                   groupMapping[groupId].includes(col.id) && col.getIsVisible()
//               )}
//               onCheckedChange={(value) =>
//                 toggleGroupVisibility(groupId, !!value)
//               }
//             >
//               {groupId}
//             </DropdownMenuCheckboxItem>
//             {groupMapping[groupId].map((columnId) => {
//               const column = columns.find((col) => col.id === columnId);
//               return (
//                 <DropdownMenuCheckboxItem
//                   key={columnId}
//                   className="capitalize ml-6"
//                   checked={column?.getIsVisible()}
//                   onCheckedChange={(value) => column?.toggleVisibility(!!value)}
//                 >
//                   {columnId}
//                 </DropdownMenuCheckboxItem>
//               );
//             })}
//           </React.Fragment>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

import React, { useState } from "react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  columns: {
    id: string;
    getCanHide: () => boolean;
    getIsVisible: () => boolean;
    toggleVisibility: (visible: boolean) => void;
  }[];
}

export function DataTableViewOptions<TData>({
  table,
  columns,
}: DataTableViewOptionsProps<TData>) {
  const groupMapping: Record<string, string[]> = {
    "Selection Group": ["select"],
    "Task Info Group": ["id", "title"],
    "Status & Priority Group": ["status", "priority"],
    "Actions Group": ["actionsColumn"],
  };

  // Define the type of columnVisibility
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(
    columns.reduce((acc, column) => {
      acc[column.id] = column.getIsVisible();
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Function to toggle column visibility
  const toggleColumnVisibility = (columnId: string) => {
    const newVisibility = {
      ...columnVisibility,
      [columnId]: !columnVisibility[columnId], // Toggle visibility
    };
    setColumnVisibility(newVisibility);

    // Update column visibility in the table
    const updatedColumnVisibility = columns.reduce((acc, column) => {
      acc[column.id] =
        column.id === columnId
          ? newVisibility[columnId]
          : column.getIsVisible();
      return acc;
    }, {} as { [key: string]: boolean });

    table.setColumnVisibility(updatedColumnVisibility);
  };

  // Render the dropdown menu with checkboxes for each column group
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.keys(groupMapping).map((groupId) => (
          <React.Fragment key={groupId}>
            <DropdownMenuCheckboxItem
              className="capitalize"
              checked={columns
                .filter((col) => groupMapping[groupId].includes(col.id))
                .every((col) => columnVisibility[col.id])}
              onCheckedChange={(value) =>
                groupMapping[groupId].forEach((colId) =>
                  toggleColumnVisibility(colId)
                )
              }
            >
              {groupId}
            </DropdownMenuCheckboxItem>
            {groupMapping[groupId].map((columnId) => (
              <DropdownMenuCheckboxItem
                key={columnId}
                className="capitalize ml-6"
                checked={columnVisibility[columnId]}
                onCheckedChange={() => toggleColumnVisibility(columnId)}
              >
                {columnId}
              </DropdownMenuCheckboxItem>
            ))}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
