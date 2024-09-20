import React, { useState, useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./dataTable";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { useStudentRefresher } from "@/lib/context/refresherStudent";

export default function TableStudent() {
    const inventoryToken = Cookies.get("inventory_token");
    const [studentList, setStudentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 10,
        total: 0,
        lastPage: 0,
        totalPages: 0,
    });
    const { refreshKey } = useStudentRefresher();

    const getAllStudent = async (page = 1, search = "") => {
        try {
            const { data: getStudent } = await axios("/api/v1/students", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    page,
                    perPage: pagination.perPage,
                    search,
                },
            });
            setStudentList(getStudent?.data);
            setPagination((prev) => ({
                ...prev,
                currentPage: page,
                total: getStudent.pagination.total,
                lastPage: getStudent.pagination.lastPage,
                totalPages: getStudent.pagination.totalPages,
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
        getAllStudent(pagination.currentPage, debouncedSearchTerm);
    }, [debouncedSearchTerm, refreshKey]);

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: newPage,
        }));
        getAllStudent(newPage, debouncedSearchTerm);
    };

    return (
        <div className="mx-auto max-w-[900px] sm:py-10">
            <DataTable
                columns={columns}
                data={studentList}
                pagination={pagination}
                onPageChange={handlePageChange}
                onSearchChange={setSearchTerm}
            />{" "}
        </div>
    );
}
