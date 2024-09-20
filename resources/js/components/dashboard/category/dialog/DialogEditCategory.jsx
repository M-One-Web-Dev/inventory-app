import { FaEdit } from "react-icons/fa";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Input,
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../ui";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { Info } from "lucide-react";
import { z } from "zod";
import { useCategoryRefresher } from "@/lib/context/refresherCategory";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is Empty",
    }),
});

export default function DialogEditCategory({ id, name }) {
    const [openModal, setOpenModal] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name,
        },
    });
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useCategoryRefresher();

    const onSubmit = async (data) => {
        const body = {
            name: data.name,
        };

        try {
            const { data: updateCategory } = await axios.post(
                `/api/v1/categories/update/${id}`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                }
            );
            setOpenModal(false);
            toast.success("Success Update Categories", {
                duration: 3000,
            });
            refresh();
        } catch (error) {
            toast.error("Failed Update Categories", {
                duration: 3000,
            });
            console.log(error);
            if (error.response?.data?.message === "Unauthenticated.") {
                Inertia.visit("/login");
                setIsVerifyLoading(false);
                return;
            }
        }
    };

    return (
        <>
            <Toaster richColors position="top-center" />
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger className="bg-violet-500 py-[10px] px-[10px] rounded-sm">
                    <FaEdit className="text-white h-[14px] w-[14px]" />
                </DialogTrigger>
                <DialogContent className="rounded-md py-[25px] px-[23px] h-auto max-[400px]:w-[320px] max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>
                            <h1 className="text-center mb-[20px] text-[20px] font-semibold text-neutral-700">
                                Edit Category
                            </h1>
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-5 rounded-md w-full"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Name. . ."
                                                {...field}
                                                className={`${
                                                    form.formState.errors
                                                        .name &&
                                                    "outline-red-500 focus:outline-red-400"
                                                }`}
                                            />
                                        </FormControl>
                                        {form.formState.errors.name && (
                                            <div className=" pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                                <Info size={14} />
                                                <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-7  w-full">
                                <Button
                                    className="w-full bg-[#A27FFE] mt-[50px] hover:bg-[#b295fb]"
                                    // disable={isLoading}
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                >
                                    <span className="text-lg">Cancel</span>
                                </Button>
                                <Button
                                    className="w-full bg-[#A27FFE] mt-[50px] hover:bg-[#b295fb]"
                                    // disable={isLoading}
                                    type="submit"
                                >
                                    <span className="text-lg">Update</span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
