import React from "react";
import Layout from "../Layout";
import { FiPlus } from "react-icons/fi";
import TableCategory from "@/components/dashboard/category/table/tableCategory";
import { CategoryRefresherProvider } from "@/lib/context/refresherCategory";
import TableLevel from "../../../components/dashboard/level/table/tableLevel";

function Level() {
    return (
        <CategoryRefresherProvider>
            <div className="relative w-full">
                <div className="absolute top-[-40px] w-full px-[10px] md:px-[20px]">
                    <div className="bg-white shadow-[3px_3px_20px_-2px_#00000024]  py-[20px] rounded-md px-[20px]">
                        <h1 className="text-[20px]">Category</h1>
                    </div>
                </div>
                <div className="pt-[70px] px-[10px] md:px-[20px]">
                    <div className="pt-[0px] md:px-[50px] shadow-[5px_5px_30px_-5px_#00000024] px-[5px]">
                        <TableLevel />
                    </div>
                </div>
            </div>
        </CategoryRefresherProvider>
    );
}

Level.layout = (page) => <Layout children={page} title="Welcome" />;

export default Level;
