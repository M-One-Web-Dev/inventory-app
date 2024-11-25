import React from "react";
import ComingSoon from "@/components/ui/comingSoon";
import axios from "axios";
import { useState, useEffect } from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import Cookies from "js-cookie";

function SettingPageComponent() {
    const inventoryToken = Cookies.get("inventory_token");

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["todos"],
        queryFn: async () => {
            return await axios("/api/v1/setting", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
            });
        },
    });

    return (
        <div className="relative w-full">
            <div className="absolute top-[-40px] w-full px-[20px]">
                <div className="bg-white shadow-[3px_3px_20px_-2px_#00000024]  py-[20px] rounded-md px-[20px]">
                    <h1 className="text-[20px]">Setting</h1>
                </div>
            </div>
            <div className="pt-[70px] px-[20px]">
                <div className="py-[20px] px-[20px] shadow-[5px_5px_30px_-5px_#00000024]">
                    <h1 className="text-violet-600 font-semibold">
                        Informasi Sekolah
                    </h1>

                    <div className="flex flex-col mt-[50px] gap-5">
                        <div className="flex flex-col gap-1">
                            <p className="w-[40%] text-[13px]">
                                Tahun Pelajaran
                                <span className="text-red-500">*</span>
                            </p>

                            <input
                                className="rounded-sm border-gray-300 py-[5px] border-[1px] border-solid flex-grow"
                                type="text"
                            />
                            <span className="text-[11px]">EX: 2022/2023</span>
                        </div>

                        <div className="w-full flex justify-end text-white mt-[30px]">
                            <button className="bg-violet-600 text-[13px] py-[7px] px-[13px] rounded-md font-semibold">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <ComingSoon /> */}
        </div>
    );
}

export default SettingPageComponent;
