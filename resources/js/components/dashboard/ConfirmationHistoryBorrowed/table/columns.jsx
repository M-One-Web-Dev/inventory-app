import React from "react";
import { Button } from "../../../ui/index";
import { ArrowUpDown } from "lucide-react";
import {
    DialogAcceptConfirmation,
    DialogRejectConfirmation,
} from "../dialog/index";
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
                <div className="text-left font-medium w-[110px] overflow-hidden text-ellipsis  whitespace-nowrap">
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
                <div className="text-center font-medium w-[100px]">{`${row.original.borrowed_level} ${row.original.borrowed_user_from}`}</div>
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
        accessorKey: "returned_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Waktu Permintaan Konfirmasi
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const formatDate =
                row.original.confirmed_at === null
                    ? "-"
                    : moment(row.original.confirmed_at)
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
        id: "actions",
        header: () => <div className="text-left">Action</div>,
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    {/* <ButtonDownloadPdf row={row.original} />
                    <DialogDetailItem row={row.original} /> */}
                    {/* <DialogEditTemporary row={row.original} /> */}
                    <DialogRejectConfirmation id={row.original.id} />
                    <DialogAcceptConfirmation id={row.original.id} />
                </div>
            );
        },
    },
];
