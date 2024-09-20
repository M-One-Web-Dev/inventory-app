import React from "react";
import { Button } from "../../../ui/index";
import { ArrowUpDown } from "lucide-react";
import { DialogDeleteActiveStudent } from "../dialog";

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
    // {
    //     accessorKey: "image",
    //     header: () => <div className="text-center">Image</div>,
    //     cell: ({ row }) => {
    //         const amount = row.getValue("image");

    //         return (
    //             <div className="flex justify-center items-center">
    //                 <div className="bg-violet-100 rounded-full h-[40px] w-[40px] flex justify-center items-end overflow-hidden">
    //                     {/* <img
    //                         className="h-[40px] w-[40px]"
    //                         src={amount}
    //                         alt="ll"
    //                     /> */}
    //                     <FaUserAlt className="h-[30px] w-[30px] text-violet-500" />
    //                 </div>
    //             </div>
    //         );
    //     },
    // },
    {
        accessorKey: "student_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama Siswa
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const getName = row.getValue("student_name");
            return (
                <div className="text-left font-medium w-[200px] overflow-hidden text-ellipsis  whitespace-nowrap">
                    {getName}
                </div>
            );
        },
    },
    {
        accessorKey: "class",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Jurusan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const getName = row.getValue("class");
            return <div className="text-left font-medium">{getName}</div>;
        },
    },
    {
        accessorKey: "generation",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Kelas
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const getName = row.getValue("generation");
            return <div className="text-left font-medium">{getName}</div>;
        },
    },
    {
        accessorKey: "school_year",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Tahun Pelajaran
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const getName = row.getValue("school_year");
            return <div className="text-left font-medium">{getName}</div>;
        },
    },
    {
        id: "actions",
        header: () => <div className="text-left">Action</div>,
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <div className="flex items-center gap-2">
                    <DialogDeleteActiveStudent row={row.original} />
                </div>
            );
        },
    },
];
