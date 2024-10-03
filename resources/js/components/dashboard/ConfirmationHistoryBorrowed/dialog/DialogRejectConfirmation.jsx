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
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useItemRefresher } from "@/lib/context/refresherItem";

export function DialogRejectConfirmation({ id }) {
    const [openModal, setOpenModal] = useState(false);
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useItemRefresher();

    const DeleteItem = async () => {
        const body = {
            id: id,
            status: "borrowed",
        };
        try {
            const { data: deleteCategory } = await axios.post(
                `/api/v1/history-borrowed/update-status`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                }
            );
            setOpenModal(false);
            toast.success("konfirmasi ditolak", {
                duration: 3000,
            });
            refresh();
        } catch (error) {
            console.log(error);
            toast.error("Failed Delete Temporary", {
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
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger className="bg-red-500 py-[10px] px-[10px] rounded-sm">
                    <IoClose className="text-white h-[14px] w-[14px]" />
                </DialogTrigger>
                <DialogContent className="w-auto py-[20px] px-[25px] rounded-md">
                    <DialogHeader>
                        <DialogTitle className="text-center font-medium">
                            Tolak Permintaan Konfirmasi ini?
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
                            onClick={DeleteItem}
                        >
                            Tolak
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
