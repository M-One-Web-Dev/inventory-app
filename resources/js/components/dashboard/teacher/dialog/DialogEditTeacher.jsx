import { FaEdit } from "react-icons/fa";
import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Info } from "lucide-react";
import { z } from "zod";
import { useTeacherRefresher } from "@/lib/context/refresherTeacher";

const formSchema = z.object({
    number_id: z.string().min(1, {
        message: "Number Id belum Diisi",
    }),
    name: z.string().min(1, {
        message: "Nama Guru belum Diisi",
    }),
    image: z.any().optional(),
});

export function DialogEditTeacher({ row }) {
    const [openModal, setOpenModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            number_id: row?.id_number,
            name: row?.name,
            //image: row?.image,
        },
    });
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useTeacherRefresher();

    const onSubmit = async (data) => {
        const { number_id, name } = data;
        const formData = new FormData();
        formData.append("id_number", number_id);
        formData.append("name", name);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        const body = {
            id_number: number_id,
            name: name,
        };

        try {
            const { data: getUser } = await axios.post(
                `/api/v1/teachers/update/${row?.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setOpenModal(false);
            toast.success("Berhasil Memperbarui Guru", {
                duration: 3000,
            });
        } catch (error) {
            console.log(error);
            toast.success("Gagal Memperbarui Guru", {
                duration: 3000,
            });
            if (error.response?.data?.message === "Unauthenticated.") {
                Inertia.visit("/login");
                setIsVerifyLoading(false);
                return;
            }
        }
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    useEffect(() => {
        form.reset({
            number_id: row?.id_number,
            name: row?.name,
            //  image: row?.image,
        });
    }, [row, form, openModal]);

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger className="bg-violet-500 py-[10px] px-[10px] rounded-sm">
                <FaEdit className="text-white h-[14px] w-[14px]" />
            </DialogTrigger>
            <DialogContent className="rounded-md py-[25px] px-[23px] h-auto max-[400px]:w-[320px] max-w-[400px]">
                <DialogHeader>
                    <h1 className="text-center mb-[20px] text-[20px] font-semibold text-neutral-700">
                        Edit Guru
                    </h1>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-5 rounded-md w-full"
                    >
                        <FormField
                            control={form.control}
                            name="number_id"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                        Number ID{" "}
                                        <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Number Id. . ."
                                            {...field}
                                            className={`${
                                                form.formState.errors
                                                    .number_id &&
                                                "outline-red-500 focus:outline-red-400"
                                            }`}
                                        />
                                    </FormControl>
                                    {form.formState.errors.number_id && (
                                        <div className=" pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                            <Info size={14} />
                                            <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                        Nama Guru{" "}
                                        <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nama Guru. . ."
                                            {...field}
                                            className={`${
                                                form.formState.errors.name &&
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

                        {/* <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                        Image
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </FormControl>
                                    {form.formState.errors.image && (
                                        <div className=" pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                            <Info size={14} />
                                            <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        /> */}

                        <div className="mt-[20px] flex gap-4 justify-end w-full">
                            <Button
                                className="max-w-max bg-[#A27FFE] hover:bg-[#b295fb]"
                                // disable={isLoading}
                                type="button"
                                onClick={() => setOpenModal(false)}
                            >
                                <span className="text-md">Batal</span>
                            </Button>
                            <Button
                                className="max-w-max bg-[#A27FFE] hover:bg-[#b295fb]"
                                // disable={isLoading}
                                type="submit"
                            >
                                <span className="text-md">Update</span>
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
