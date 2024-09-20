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
    Textarea,
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
import { useItemRefresher } from "@/lib/context/refresherItem";

const formSchema = z.object({
    number_id: z.string().min(1, {
        message: "Number Id belum Diisi",
    }),
    name: z.string().min(1, {
        message: "Nama Item belum Diisi",
    }),
    status: z.string().min(1, {
        message: "Status belum Diisi",
    }),
    category: z.any().optional(),
    description: z.any().optional(),
    image: z.any().optional(),
});

export function DialogEditItem({ row }) {
    const [openModal, setOpenModal] = useState(false);
    const [listCategory, setListcategory] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            number_id: row.id_number,
            name: row.name,
            description: row.description,
            status: row.status,
            // stock: `${stock}`,
            category: `${row.categories_id}`,
            image: row.image,
        },
    });
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useItemRefresher();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("id_number", data.number_id);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("status", data.status);
        formData.append("categories_id", data.category);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const { data: updateItem } = await axios.post(
                `/api/v1/items/update/${row.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                }
            );
            setOpenModal(false);
            toast.success("Berhasil memperbarui Item", {
                duration: 3000,
            });
            refresh();
        } catch (error) {
            toast.error("Gagal Memperbarui Item", {
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

    const getAllCategory = async () => {
        try {
            const { data: getCategory } = await axios(`/api/v1/categories`, {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
            });
            setListcategory(getCategory?.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (openModal) {
            form.reset({
                number_id: row.id_number,
                name: row.name,
                description: row.description,
                status: row.status,
                category: `${row.categories_id}`,
                image: row.image,
            });
            getAllCategory();
        }
    }, [openModal, row, reset]);

    return (
        <>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger className="bg-violet-500 py-[10px] px-[10px] rounded-sm">
                    <FaEdit className="text-white h-[14px] w-[14px]" />
                </DialogTrigger>
                <DialogContent className="rounded-md py-[25px] px-[23px] h-auto max-[400px]:w-[320px] max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>
                            <span className="flex w-full justify-center mb-[20px] text-[20px] font-semibold text-neutral-700">
                                Edit Item
                            </span>
                        </DialogTitle>
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
                                            <span className="text-red-500">
                                                *
                                            </span>
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
                                            Nama Item{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nama Item. . ."
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

                            {/* <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                            Stock
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Stock. . ."
                                                {...field}
                                                className={`${
                                                    form.formState.errors
                                                        .stock &&
                                                    "outline-red-500 focus:outline-red-400"
                                                }`}
                                                type="number"
                                            />
                                        </FormControl>
                                        {form.formState.errors.stock && (
                                            <div className=" pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                                <Info size={14} />
                                                <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            /> */}

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="space-y-0">
                                            <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                                Status{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        className={`${
                                                            form.formState
                                                                .errors
                                                                .status &&
                                                            "outline-red-500 focus:outline-red-400"
                                                        }`}
                                                    >
                                                        <SelectValue
                                                            placeholder="Select Status"
                                                            className="text-neutral-300"
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    <SelectItem
                                                        value={`available`}
                                                    >
                                                        Tersedia
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={`not_available`}
                                                    >
                                                        Dipinjam
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={`damaged`}
                                                    >
                                                        Rusak
                                                    </SelectItem>
                                                    <SelectItem value={`lost`}>
                                                        Hilang
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {form.formState.errors.status && (
                                                <div className=" pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                                    <Info size={14} />
                                                    <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                                </div>
                                            )}
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="space-y-0">
                                            <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                                Kategori (opsional)
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        className={`${
                                                            form.formState
                                                                .errors
                                                                .category &&
                                                            "outline-red-500 focus:outline-red-400"
                                                        }`}
                                                    >
                                                        <SelectValue
                                                            placeholder="Tambah Kategori"
                                                            className="text-neutral-300"
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    {listCategory.map(
                                                        (item, index) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={`${item?.id}`}
                                                            >
                                                                {item.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            {/* {form.formState.errors.category && (
                                                <div className=" pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                                    <Info size={14} />
                                                    <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                                </div>
                                            )} */}
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                            Catatan (opsional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Catatan. . ."
                                                {...field}
                                                className={`${
                                                    form.formState.errors
                                                        .description &&
                                                    "outline-red-500 focus:outline-red-400"
                                                }`}
                                            />
                                            {/* <Input
                                                type="text"
                                                placeholder="Catatan. . ."
                                                {...field}
                                                className={`${
                                                    form.formState.errors
                                                        .description &&
                                                    "outline-red-500 focus:outline-red-400"
                                                }`}
                                            /> */}
                                        </FormControl>
                                        {/* {form.formState.errors.description && (
                                            <div className=" pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                                <Info size={14} />
                                                <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                            </div>
                                        )} */}
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
                                    <span className="text-lg">Batal</span>
                                </Button>
                                <Button
                                    className="w-full bg-[#A27FFE] mt-[50px] hover:bg-[#b295fb]"
                                    // disable={isLoading}
                                    type="submit"
                                >
                                    <span className="text-lg">Perbarui</span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
