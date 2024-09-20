import React from "react";
import Layout from "../Layout";
import TableStudent from "../../../components/dashboard/student/table/tableStudent";
import { StudentRefresherProvider } from "@/lib/context/refresherStudent";

function Student() {
    return (
        <StudentRefresherProvider>
            <div className="relative w-full">
                <div className="absolute top-[-40px] w-full px-[10px] md:px-[20px]">
                    <div className="bg-white shadow-[3px_3px_20px_-2px_#00000024]  py-[20px] rounded-md px-[20px]">
                        <h1 className="text-[20px]">Student</h1>
                    </div>
                </div>
                <div className="pt-[55px] sm:pt-[70px] px-[10px] md:px-[20px]">
                    <div className="pt-[0px] md:px-[50px] shadow-[5px_5px_30px_-5px_#00000024] px-[5px] rounded-md">
                        <TableStudent />
                    </div>
                </div>
            </div>
        </StudentRefresherProvider>
    );
}

Student.layout = (page) => <Layout children={page} title="Welcome" />;

export default Student;
