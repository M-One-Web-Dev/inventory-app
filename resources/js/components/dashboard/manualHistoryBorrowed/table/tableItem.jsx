import React, { useState, useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./dataTable";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useItemRefresher } from "@/lib/context/refresherItem";
import {
    Input,
    Button,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui";
import { DialogAddData, DialogFilter } from "../dialog";
import { manualHistoryBorrowedStore } from "../../../../lib/globalState/refresherManualHistoryBorrowed";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function TableTemporary() {
    const inventoryToken = Cookies.get("inventory_token");
    const [temporaryList, setTemporaryList] = useState([]);
    const [searchTerm, setSearchTerm] = useState(null);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 10,
        total: 0,
        lastPage: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    const { refreshKey } = useItemRefresher();
    const { watch, setValue } = useForm();
    const searchGlobalState = manualHistoryBorrowedStore(
        (state) => state.search
    );
    const statusGlobalState = manualHistoryBorrowedStore(
        (state) => state.status
    );
    const { isPending, isError, data, error } = useQuery({
        queryKey: [
            "history-borrowed",
            searchGlobalState,
            statusGlobalState,
            pagination,
        ],
        queryFn: async () => {
            const response = await axios.get("/api/v1/history-borrowed", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    page: pagination.currentPage,
                    perPage: pagination.perPage,
                    search: searchGlobalState,
                    status: statusGlobalState,
                    type: "manual",
                },
            });
            setPagination((prev) => ({
                ...prev,
                total: response.data.pagination.total,
                lastPage: response.data.pagination.lastPage,
                totalPages: response.data.pagination.totalPages,
            }));
            return response.data.data;
        },
    });

    console.log(data);

    const getAllTemporary = async (page = 1, search = "") => {
        setLoading(true);
        try {
            const { data: getItems } = await axios("/api/v1/history-borrowed", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    page,
                    perPage: pagination.perPage,
                    search,
                    status: watch("status") === "" ? "" : watch("status"),
                    type: "manual",
                },
            });
            setTemporaryList(getItems?.data);
            setPagination((prev) => ({
                ...prev,
                currentPage: page,
                total: getItems.pagination.total,
                lastPage: getItems.pagination.lastPage,
                totalPages: getItems.pagination.totalPages,
            }));
        } catch (error) {
            console.log(error);
            if (error.response.data.message === "Unauthenticated.") {
                Inertia.visit("/login");
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    // const fetchDates = async () => {
    //     try {
    //         const response = await axios.get(
    //             "/api/v1/temporary/available-dates",
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${inventoryToken}`,
    //                 },
    //             }
    //         );
    //         // if (response.data.status === "success") {
    //         //     setDates(response.data.data);
    //         // }
    //     } catch (error) {
    //         console.error("Error fetching dates:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchDates();
    // }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(watch("search") ?? "");
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [watch("search")]);

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
    }, [searchGlobalState, statusGlobalState]);

    useEffect(() => {
        if (
            debouncedSearchTerm !== null &&
            debouncedSearchTerm === watch("search")
        ) {
            setPagination((prev) => ({
                ...prev,
                currentPage: 1,
            }));
            getAllTemporary(1, debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        setValue("search", "");
        getAllTemporary(pagination.currentPage, "");
    }, [refreshKey]);

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: newPage,
        }));
        getAllTemporary(newPage, debouncedSearchTerm);
    };

    return (
        <div className="mx-auto w-full py-[10px] sm:py-10 ">
            <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-[10px] md:gap-0">
                <div className="w-full flex items-center px-[10px] md:px-0 gap-2">
                    <h1 className="text-[20px]">List Peminjaman</h1>
                    {/* <Input
                        placeholder="Search..."
                        value={watch("search") ?? ""}
                        onChange={(event) => {
                            const searchValue = event.target.value;
                            setValue("search", searchValue);
                        }}
                        className="w-full"
                    /> */}
                </div>
                <div className="px-[10px] md:px-0 flex justify-end items-end gap-2 w-full">
                    {/* <DialogImportExcel /> */}
                    <DialogFilter />
                    <DialogAddData />
                    {/* <Button
                        className="px-[10px] rounded-md py-[5px] h-auto "
                        onClick={() => setIsFilter(!isFilter)}
                    >
                        Filter
                    </Button> */}
                </div>
            </div>
            {isFilter && (
                <Card>
                    <CardContent className="grid grid-cols-2 py-[5px] my-[30px]">
                        <div className="col-span-1 gap-[5px] flex flex-col ">
                            <Label htmlFor="framework">Status</Label>
                            <Select
                                onValueChange={(e) => {
                                    setValue("status", e);
                                }}
                            >
                                <SelectTrigger id="framework">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="returned">
                                        Dikembalikan
                                    </SelectItem>
                                    <SelectItem value="borrowed">
                                        Belum Dikembalikan
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-1">
                        <Button onClick={() => setIsFilter(false)}>
                            CLose
                        </Button>
                        <Button
                            onClick={() =>
                                getAllTemporary(0, debouncedSearchTerm)
                            }
                        >
                            Apply
                        </Button>
                    </CardFooter>
                </Card>
            )}
            <DataTable
                columns={columns}
                data={data ?? []}
                pagination={pagination}
                onPageChange={handlePageChange}
                onSearchChange={setSearchTerm}
                loadingState={loading}
            />
        </div>
    );
}
