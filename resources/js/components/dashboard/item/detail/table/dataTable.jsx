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
    Button,
    Input,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Pagination,
} from "@/components/ui";
import { useForm } from "react-hook-form";

export function DataTable({
    columns,
    data,
    pagination,
    onPageChange,
    onSearchChange,
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
            <div className="flex flex-col sm:flex-row md:items-center items-end justify-between py-4 gap-[10px] md:gap-0 ">
                <Input
                    placeholder="Cari Item..."
                    value={watch("search") ?? ""}
                    onChange={(event) => {
                        const searchValue = event.target.value;
                        setValue("search", searchValue);
                        onSearchChange(searchValue);
                    }}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                    {/* <DialogImportExcel />
                    <DialogAddData /> */}
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table
                            .getHeaderGroups()
                            .map((headerGroup, parentIndex) => (
                                <TableRow key={parentIndex}>
                                    {headerGroup.headers.map(
                                        (header, headerIndex) => {
                                            return (
                                                <TableHead key={headerIndex}>
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
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row
                                        .getVisibleCells()
                                        .map((cell, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
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