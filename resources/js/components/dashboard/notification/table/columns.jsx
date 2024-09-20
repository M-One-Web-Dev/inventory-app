import React from "react";
import {
    Switch,
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
import { DialogDeleteNotification, DialogEditNotification } from "../dialog";
import { FaUserAlt } from "react-icons/fa";
import moment from "moment";
import "moment/locale/id";
import SwitchToggle from "../switchToggle/switchToggle";

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
            const getName = row.getValue("item_name");
            return <div className="text-center font-medium">{getName}</div>;
        },
    },
    {
        accessorKey: "user_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama Peminjam
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const getName = row.getValue("user_name");
            return (
                <div className="text-left font-medium w-[200px] overflow-hidden text-ellipsis  whitespace-nowrap">
                    {getName}
                </div>
            );
            // return <div className="text-center font-medium">{getName}</div>;
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const getName = row.getValue("status");
            return (
                <div
                    className={`${
                        getName === "returned" ? "bg-violet-600" : "bg-red-500"
                    } text-white font-medium text-center py-[8px] px-[20px] rounded-[50px]`}
                >
                    {getName === "returned" ? "Dikembalikan" : "Dipinjam"}
                </div>
            );
        },
    },

    {
        accessorKey: "borrowed_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Peminjaman
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const formatDate = moment(row.original.borrowed_at)
                .locale("id")
                .format("D MMMM YYYY [pukul] HH.mm");

            const getName = row.getValue("borrowed_at");
            return (
                <div className="text-left font-medium w-[200px]">
                    {formatDate}
                </div>
            );
            // return <div className="text-left font-medium">{formatDate}</div>;
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
                    Pengembalian
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const formatDate =
                row.original.returned_at === null
                    ? "-"
                    : moment(row.original.returned_at)
                          .locale("id")
                          .format("D MMMM YYYY [pukul] HH.mm");

            const getName = row.getValue("borrowed_at");
            return (
                <div className="text-left font-medium w-[200px]">
                    {formatDate}
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
            const getName = row.getValue("borrowed_at");
            return <SwitchToggle row={row.original} />;
        },
    },
    {
        id: "actions",
        header: () => <div className="text-left">Action</div>,
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <div className="flex items-center gap-2">
                    {/* <DialogEditNotification row={row.original} /> */}
                    <DialogDeleteNotification row={row.original} />
                </div>
            );
        },
    },
];
