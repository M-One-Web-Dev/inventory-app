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
// import DialogDeleteCategory from "@/components/dashboard/item/dialog/DialogDeleteItem";
import { DialogDeleteCategory, DialogEditCategory } from "../dialog/index";
import { FaUserAlt } from "react-icons/fa";

const handleNullValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "undefined" ||
        value === "null"
    ) {
        return "-";
    } else {
        return value;
    }
};

export const columns = [
    {
        accessorKey: "no",
        header: () => <div className="text-center">No</div>,
        cell: ({ row }) => {
            return (
                <div className="flex justify-center items-center">
                    <h1>{row.index + 1}</h1>
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
        accessorKey: "description",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Deskripsi
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const getName = row.getValue("description");
            return (
                <div className="text-left font-medium w-[200px]">
                    {handleNullValue(row.original.description)}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-left">Action</div>,
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <DialogEditCategory
                        id={row.original.id}
                        name={row.original.name}
                        description={row.original.description}
                    />
                    <DialogDeleteCategory row={row.original} />
                </div>
            );
        },
    },
];
