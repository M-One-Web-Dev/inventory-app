import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { usePage } from "@inertiajs/inertia-react";
import moment from "moment";
import { Chip } from "@/components/ui/index";

function DetailItem() {
    const [detail, setDetail] = useState(null);
    const { id } = usePage().props;
    const inventoryToken = Cookies.get("inventory_token");

    const getDetail = async () => {
        try {
            const { data: response } = await axios.get(
                `/api/v1/items/detail/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                }
            );
            setDetail(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDetail();
    }, []);

    return (
        <div className="w-full py-[30px]">
            <div class="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-6 ">
                    <h1 className="text-[17px] font-[600] text-neutral-800">
                        Id Number
                    </h1>
                    <p>{detail === null ? "-" : detail?.id_number}</p>
                </div>
                <div className="col-span-12 md:col-span-6 ">
                    <h1 className="text-[17px] font-[600] text-neutral-800">
                        Name
                    </h1>
                    <p>{detail === null ? "-" : detail?.name}</p>
                </div>
                <div className="col-span-12 md:col-span-6 ">
                    <h1 className="text-[17px] font-[600] text-neutral-800">
                        Description
                    </h1>
                    <p>
                        {detail === null ||
                        detail?.description === "null" ||
                        detail?.description === null
                            ? "-"
                            : detail?.description}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6 ">
                    <h1 className="text-[17px] font-[600] text-neutral-800">
                        Kategori
                    </h1>
                    <p>
                        {detail === null || detail?.categories_name === null
                            ? "-"
                            : detail?.categories_name}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6 ">
                    <h1 className="text-[17px] font-[600] text-neutral-800">
                        Status
                    </h1>
                    <Chip
                        variant={
                            detail?.status === "available" ? "success" : "error"
                        }
                        text={detail === null ? "-" : detail?.status}
                    />
                </div>

                <div className="col-span-12 md:col-span-6 ">
                    <h1 className="text-[17px] font-[600] text-neutral-800">
                        Tanggal Terdaftar
                    </h1>
                    <p>
                        {detail === null
                            ? "-"
                            : moment(detail?.created_at).format("LLLL")}
                    </p>
                </div>
                <div className="col-span-12 md:col-span-6 ">
                    <h1 className="text-[17px] font-[600] text-neutral-800">
                        Terakhir Diperbarui
                    </h1>
                    <p>
                        {detail === null
                            ? "-"
                            : moment(detail?.updated_at).format("LLLL")}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DetailItem;
