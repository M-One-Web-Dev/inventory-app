import React, { useState, useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./dataTable";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { useActiveStudentRefresher } from "@/lib/context/refresherActiveStudent";

export default function TableActiveStudent() {
    const inventoryToken = Cookies.get("inventory_token");
    const [activeStudentList, setActiveStudentList] = useState([]);
    const { refreshKey } = useActiveStudentRefresher();

    const getAllActiveStudent = async () => {
        try {
            const { data: getStudent } = await axios(
                "/api/v1/active-students",
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                }
            );
            setActiveStudentList(getStudent?.data);
        } catch (error) {
            console.log(error);
            if (error.response.data.message === "Unauthenticated.") {
                Inertia.visit("/login");
                return;
            }
        }
    };

    useEffect(() => {
        getAllActiveStudent();
    }, [refreshKey]);

    return (
        <div className="mx-auto max-w-[900px] py-10">
            <DataTable columns={columns} data={activeStudentList} />
        </div>
    );
}
