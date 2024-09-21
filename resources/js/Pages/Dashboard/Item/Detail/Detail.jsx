import React from "react";
import { usePage } from "@inertiajs/inertia-react";
import Layout from "../../Layout";
import { Link } from "@inertiajs/inertia-react";
import { ArrowLeft } from "lucide-react";
import DetailItem from "../../../../components/dashboard/item/detail/Detail";

function Detail() {
    const { id } = usePage().props;
    return (
        <div className="relative w-full">
            <div className="absolute top-[-40px] w-full px-[10px] md:px-[20px]">
                <div className="flex gap-1 items-center bg-white shadow-[3px_3px_20px_-2px_#00000024]  py-[20px] rounded-md px-[20px]">
                    <Link href={"/dashboard/item"}>
                        <ArrowLeft />
                    </Link>
                    <h1 className="text-[20px]">Detail Item</h1>
                </div>
            </div>

            <DetailItem />
        </div>
    );
}

Detail.layout = (page) => <Layout children={page} title="Welcome" />;

export default Detail;
