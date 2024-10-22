import React, { useState, useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./dataTable";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { useItemRefresher } from "@/lib/context/refresherItem";

export default function TableItem() {
    const inventoryToken = Cookies.get("inventory_token");
    const [itemsList, setItemsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 20,
        total: 0,
        lastPage: 0,
        totalPages: 0,
    });
    const { refreshKey } = useItemRefresher();

    const getAllItems = async (page = 1, search = "") => {
        try {
            const { data: getItems } = await axios("/api/v1/items", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    page,
                    perPage: pagination.perPage,
                    search,
                },
            });
            setItemsList(getItems?.data);
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
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        getAllItems(pagination.currentPage, debouncedSearchTerm);
    }, [debouncedSearchTerm, refreshKey]);

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: newPage,
        }));
        getAllItems(newPage, debouncedSearchTerm);
    };

    console.log(itemsList);

    return (
        <div className="mx-auto max-w-[900px] py-[15px] md:py-10">
            <DataTable
                columns={columns}
                data={itemsList}
                pagination={pagination}
                onPageChange={handlePageChange}
                onSearchChange={setSearchTerm}
            />
        </div>
    );
}
