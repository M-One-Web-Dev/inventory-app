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
} from "../../../../ui/index";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
    DialogDeleteData,
    DialogEditData,
    DialogDetailBorrowedData,
} from "../../dialog/index";
import { FaUserAlt } from "react-icons/fa";
import { ButtonDownloadPdf } from "../../button/ButtonDownloadPdf";
import moment from "moment";

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
                    Nama Peminjam
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="text-left font-medium w-[110px] overflow-hidden text-ellipsis  whitespace-nowrap">
                    {row.original.username}
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
                    Asal
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="text-center font-medium">{`${row.original.borrowed_level} ${row.original.borrowed_user_from}`}</div>
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
                    Waktu Peminjaman
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const formatDate = moment(row.original.borrowed_at)
                .locale("id")
                .format("D MMMM YYYY [pukul] HH.mm");

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
                    Waktu Pengembalian
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
                <div className="text-center font-medium w-[200px]">
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
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div
                    className={`w-max py-[10px] px-[15px] rounded-[50px] ${
                        row.original.status === "borrowed"
                            ? "bg-red-600 text-white"
                            : "bg-violet-500 text-white"
                    }`}
                >
                    {row.original.status === "borrowed"
                        ? "Masih Dipinjam"
                        : "Sudah Dikembalikan"}
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
                    <DialogDetailBorrowedData row={row.original} />
                </div>
            );
        },
    },
];
