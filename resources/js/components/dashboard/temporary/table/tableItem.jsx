import React, { useState, useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./dataTable";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { useItemRefresher } from "@/lib/context/refresherItem";

export default function TableTemporary() {
    const inventoryToken = Cookies.get("inventory_token");
    const [temporaryList, setTemporaryList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 10,
        total: 0,
        lastPage: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(false);
    const { refreshKey } = useItemRefresher();

    const getAllTemporary = async (page = 1, search = "") => {
        setLoading(true);
        try {
            const { data: getItems } = await axios("/api/v1/temporary", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    page,
                    perPage: pagination.perPage,
                    search,
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

    const fetchDates = async () => {
        try {
            const response = await axios.get(
                "/api/v1/temporary/available-dates",
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                }
            );
            // if (response.data.status === "success") {
            //     setDates(response.data.data);
            // }
        } catch (error) {
            console.error("Error fetching dates:", error);
        }
    };

    useEffect(() => {
        fetchDates();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
        getAllTemporary(1, debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
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
        <div className="mx-auto max-w-[800px] sm:py-10 ">
            <DataTable
                columns={columns}
                data={temporaryList}
                pagination={pagination}
                onPageChange={handlePageChange}
                onSearchChange={setSearchTerm}
                loadingState={loading}
            />
        </div>
    );
}
