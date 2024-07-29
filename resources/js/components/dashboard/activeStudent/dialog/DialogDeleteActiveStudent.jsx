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
import { useActiveStudentRefresher } from "@/lib/context/refresherActiveStudent";

export function DialogDeleteActiveStudent({ row }) {
    const [openModal, setOpenModal] = useState(false);
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useActiveStudentRefresher();

    const DeleteItem = async () => {
        try {
            const { data: deleteCategory } = await axios.delete(
                `/api/v1/active-students/${row.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                }
            );
            setOpenModal(false);
            toast.success("Success Delete Active Student", {
                duration: 3000,
            });
            refresh();
        } catch (error) {
            console.log(error);
            toast.error("Failed Delete Active Student", {
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
                <DialogContent className="w-auto py-[20px] px-[25px]">
                    <DialogHeader>
                        <DialogTitle className="text-center font-medium">
                            are you sure to delete this item?
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center gap-3 mt-[10px]">
                        <Button
                            className="bg-violet-500 hover:bg-violet-400 font-semibold"
                            onClick={() => setOpenModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-500 hover:bg-red-400 font-semibold"
                            onClick={DeleteItem}
                        >
                            Hapus
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
