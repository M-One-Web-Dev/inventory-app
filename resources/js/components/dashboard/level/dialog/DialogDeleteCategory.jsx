import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../ui";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { useCategoryRefresher } from "@/lib/context/refresherCategory";

export default function DialogDeleteCategory({ row }) {
    const [openModal, setOpenModal] = useState(false);
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useCategoryRefresher();

    const DeleteCategory = async () => {
        try {
            const { data: deleteCategory } = await axios.post(
                `/api/v1/level/delete/${row?.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                }
            );
            setOpenModal(false);
            toast.success("Berhasil Hapus Tingkat", {
                duration: 3000,
            });
            refresh();
        } catch (error) {
            console.log(error);
            toast.error("Gagal Hapus Tingkat", {
                duration: 3000,
            });
            if (error.response?.data?.message === "Unauthenticated.") {
                Inertia.visit("/login");
                return;
            }
        }
    };

    return (
        <>
            <Toaster richColors position="top-center" />
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger className="bg-red-500 py-[10px] px-[10px] rounded-sm">
                    <FaTrash className="text-white h-[14px] w-[14px]" />
                </DialogTrigger>
                <DialogContent className="rounded-md w-[240px] py-[20px] px-[25px]">
                    <DialogHeader>
                        <DialogTitle className="text-center font-medium">
                            Hapus Category ini?
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center gap-3 mt-[10px]">
                        <Button
                            className="bg-violet-500 hover:bg-violet-400 font-semibold"
                            onClick={() => setOpenModal(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-red-500 hover:bg-red-400 font-semibold"
                            onClick={DeleteCategory}
                        >
                            Hapus
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
