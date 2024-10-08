import * as React from "react";
import {
    getSortedRowModel,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Pagination,
} from "../../../ui/index";
import { useForm } from "react-hook-form";
import LoadingGif from "@/assets/loading.gif";

export function DataTable({
    columns,
    data,
    pagination,
    onPageChange,
    onSearchChange,
    loadingState,
}) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const { watch, setValue } = useForm();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-[10px] md:gap-0">
                <div className="w-full flex items-center px-[10px] md:px-0 gap-2">
                    <Input
                        placeholder="Search..."
                        value={watch("search") ?? ""}
                        onChange={(event) => {
                            const searchValue = event.target.value;
                            setValue("search", searchValue);
                            onSearchChange(searchValue);
                        }}
                        className="w-full"
                    />
                </div>
                <div className="px-[10px] md:px-0 flex justify-end items-end gap-2 w-full">
                    {/* for action */}
                </div>
            </div>
            <div className="rounded-md">
                <Table>
                    <TableHeader className="px-[5px]">
                        {table
                            .getHeaderGroups()
                            .map((headerGroup, headerGroupIndex) => (
                                <TableRow key={headerGroupIndex}>
                                    {headerGroup.headers.map(
                                        (header, headerIndex) => {
                                            return (
                                                <TableHead
                                                    className={`${
                                                        header.id === "name" &&
                                                        "sticky left-0 bg-white"
                                                    }`}
                                                    key={headerIndex}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext()
                                                          )}
                                                </TableHead>
                                            );
                                        }
                                    )}
                                </TableRow>
                            ))}
                    </TableHeader>
                    {table.getRowModel().rows.length === 0 ? (
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody className="relative">
                            {loadingState && (
                                <div className="absolute h-full w-full bg-black/40 z-[100] text-center flex justify-center items-center scrollbar-none overflow-hidden">
                                    <img
                                        className="w-[50px] h-[50px]"
                                        src={LoadingGif}
                                        alt=""
                                    />
                                </div>
                            )}
                            {table.getRowModel().rows.map((row, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row
                                        .getVisibleCells()
                                        .map((cell, cellIndex) => (
                                            <TableCell
                                                className={`${
                                                    cell.column.id === "name" &&
                                                    "z-10 sticky left-0 bg-white"
                                                }`}
                                                key={cellIndex}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </div>

            <div className="mt-[20px]">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
}
