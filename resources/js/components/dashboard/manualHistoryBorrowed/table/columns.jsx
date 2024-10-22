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
import { DialogDeleteData } from "../dialog/index";
import { FaUserAlt } from "react-icons/fa";
import { ButtonDownloadPdf } from "../button/ButtonDownloadPdf";
import SwitchToggle from "../switchToggle/switchToggle";
import moment from "moment";

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
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const getName = row.original.username;

            return (
                <div className="text-left font-medium w-[150px] overflow-hidden break-all">
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
        accessorKey: "item_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama Barang
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="text-center font-medium">
                    {`${row.original.item_name}`}
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
                    Waktu Peminjaman
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
                    {/* <DialogEditTemporary row={row.original} /> */}
                    <DialogDeleteData id={row.original.id} />
                </div>
            );
        },
    },
];
