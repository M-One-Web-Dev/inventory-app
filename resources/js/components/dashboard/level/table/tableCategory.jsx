import React, { useState, useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./dataTable";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { useCategoryRefresher } from "@/lib/context/refresherCategory";

export default function TableCategory() {
    const inventoryToken = Cookies.get("inventory_token");
    const [categoryList, setCategoryList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 10,
        total: 0,
        lastPage: 0,
        totalPages: 0,
    });
    const { refreshKey } = useCategoryRefresher();

    const getAllCategory = async (page = 1, search = "") => {
        try {
            const { data: getCategory } = await axios("/api/v1/user-from", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    page,
                    perPage: pagination.perPage,
                    search,
                },
            });
            setCategoryList(getCategory?.data);
            setPagination((prev) => ({
                ...prev,
                currentPage: page,
                total: getCategory.pagination.total,
                lastPage: getCategory.pagination.lastPage,
                totalPages: getCategory.pagination.totalPages,
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
        getAllCategory(pagination.currentPage, debouncedSearchTerm);
    }, [debouncedSearchTerm, refreshKey]);

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: newPage,
        }));
        getAllCategory(newPage, debouncedSearchTerm);
    };

    return (
        <div className="mx-auto max-w-[900px] py-10">
            <DataTable
                columns={columns}
                data={categoryList}
                pagination={pagination}
                onPageChange={handlePageChange}
                onSearchChange={setSearchTerm}
            />
        </div>
    );
}
