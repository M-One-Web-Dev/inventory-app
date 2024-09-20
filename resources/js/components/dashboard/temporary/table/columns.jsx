import React from "react";
import {
    Checkbox,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../ui/index";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
    DialogDeleteTemporary,
    DialogEditTemporary,
    DialogDetailItem,
} from "../dialog/index";
import { FaUserAlt } from "react-icons/fa";
import { ButtonDownloadPdf } from "../button/ButtonDownloadPdf";
import SwitchToggle from "../switchToggle/switchToggle";

export const columns = [
    {
        accessorKey: "no",
        header: () => <div className="text-center">No</div>,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex; // Halaman saat ini
            const pageSize = table.getState().pagination.pageSize; // Jumlah item per halaman
            const rowIndex = row.index;

            const itemNumber = pageIndex * pageSize + rowIndex + 1;

            return (
                <div className="flex justify-center items-center">
                    <h1>{itemNumber}</h1>
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const getName = row.getValue("name");
            return (
                <div className="text-left font-medium w-[200px] overflow-hidden text-ellipsis  whitespace-nowrap">
                    {getName}
                </div>
            );
        },
    },
    {
        accessorKey: "level",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Class
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="text-left font-medium">{`${row.original.level} ${row.original.student_class}`}</div>
            );
        },
    },
    // {
    //     accessorKey: "number_id",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() =>
    //                     column.toggleSorting(column.getIsSorted() === "asc")
    //                 }
    //             >
    //                 Number ID
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => {
    //         return (
    //             <div className="text-left font-medium">
    //                 {row.original.number_id}
    //             </div>
    //         );
    //     },
    // },
    // {
    //     accessorKey: "phone",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() =>
    //                     column.toggleSorting(column.getIsSorted() === "asc")
    //                 }
    //             >
    //                 Phone
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => {
    //         return (
    //             <div className="text-left font-medium">
    //                 {row.original.phone}
    //             </div>
    //         );
    //     },
    // },
    {
        accessorKey: "item_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Item
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="text-left font-medium">
                    {`${row.original.item_name}`}
                </div>
            );
        },
    },
    {
        accessorKey: "returned_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Atur Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <SwitchToggle row={row.original} />;
        },
    },
    {
        id: "actions",
        header: () => <div className="text-left">Action</div>,
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    {/* <ButtonDownloadPdf row={row.original} />
                    <DialogDetailItem row={row.original} /> */}
                    <DialogEditTemporary row={row.original} />
                    <DialogDeleteTemporary id={row.original.id} />
                </div>
            );
        },
    },
];
