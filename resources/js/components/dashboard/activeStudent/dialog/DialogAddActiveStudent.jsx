import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
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
import { FiPlus } from "react-icons/fi";
import { useActiveStudentRefresher } from "@/lib/context/refresherActiveStudent";

const formSchema = z.object({
    number_id: z.string().min(1, {
        message: "Number Id belum Diisi",
    }),
    school_year: z.string().min(1, {
        message: "Tahun Pelajaran belum Diisi",
    }),
    student_class: z.string().min(1, {
        message: "Kelas belum Diisi",
    }),
    level: z.string().min(1, {
        message: "Level belum Diisi",
    }),
});

export function DialogAddActiveStudent() {
    const [openModal, setOpenModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [listItems, setListItems] = useState([]);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            item_id: "",
            number_id: "",
            name: "",
            phone: "",
            student_class: "",
            level: "",
        },
    });
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useActiveStudentRefresher();

    const onSubmit = async (data) => {
        const { school_year, number_id, student_class, level } = data;

        const body = {
            school_year: school_year,
            generation: level,
            class: student_class,
            number_id: number_id,
        };

        try {
            const { data: postData } = await axios.post(
                "/api/v1/active-students/add",
                body,
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setOpenModal(false);
            form.reset();
            toast.success("Berhasil menambahkan Siswa Aktif", {
                duration: 3000,
            });
            refresh();
        } catch (error) {
            toast.error("Gagal menambahkan Siswa Aktif", {
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

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const getAllItems = async () => {
        try {
            const { data: getItems } = await axios("/api/v1/items", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
            });
            setListItems(getItems?.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllItems();
    }, []);

    useEffect(() => {
        if (!openModal) {
            form.reset();
            setImageFile(null);
        }
    }, [openModal]);

    return (
        <>
            <Toaster richColors position="top-center" />
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger className="flex items-center gap-1 bg-violet-500 text-white py-[5px] text-[14px] px-[15px] rounded-[20px] hover:bg-violet-400">
                    <FiPlus className="h-[16px] w-[16px] " />{" "}
                    <span className="mt-[3px]">Tambah</span>
                </DialogTrigger>
                <DialogContent className="rounded-md py-[25px] px-[23px] h-auto max-[400px]:w-[320px] max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>
                            <span className="w-full flex justify-center mb-[20px] text-[20px] font-semibold text-neutral-700">
                                Tambah Siswa Aktif
                            </span>
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-5 rounded-md w-full"
                        >
                            {/* <FormField
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
                            /> */}
                            <FormField
                                control={form.control}
                                name="school_year"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                            Tahun Pelajaran{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tahun Pelajaran. . ."
                                                {...field}
                                                type="number"
                                                className={`${
                                                    form.formState.errors
                                                        .school_year &&
                                                    "outline-red-500 focus:outline-red-400"
                                                }`}
                                            />
                                        </FormControl>
                                        {form.formState.errors.school_year && (
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
                                                type="number"
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
                                name="level"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="space-y-0">
                                            <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                                Tingkat{" "}
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
                                                                .errors.level &&
                                                            "outline-red-500 focus:outline-red-400"
                                                        }`}
                                                    >
                                                        <SelectValue
                                                            placeholder="Pilih Tingkat"
                                                            className=""
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent className="max-h-[140px] overflow-auto">
                                                    {/* {listCategory.map(
                                                        (item, index) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={`${item?.id}`}
                                                            >
                                                                {item.name}
                                                            </SelectItem>
                                                        )
                                                    )} */}
                                                    <SelectItem value="X">
                                                        X
                                                    </SelectItem>
                                                    <SelectItem value="XI">
                                                        XI
                                                    </SelectItem>
                                                    <SelectItem value="XII">
                                                        XII
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {form.formState.errors.level && (
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
                                name="student_class"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="space-y-0">
                                            <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                                Kelas{" "}
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
                                                                .student_class &&
                                                            "outline-red-500 focus:outline-red-400"
                                                        }`}
                                                    >
                                                        <SelectValue
                                                            placeholder="Pilih Kelas"
                                                            className=""
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent className="max-h-[140px] overflow-auto">
                                                    {/* {listCategory.map(
                                                        (item, index) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={`${item?.id}`}
                                                            >
                                                                {item.name}
                                                            </SelectItem>
                                                        )
                                                    )} */}
                                                    <SelectItem value="PPLG 1">
                                                        PPLG 1
                                                    </SelectItem>
                                                    <SelectItem value="PPLG 2">
                                                        PPLG 2
                                                    </SelectItem>
                                                    <SelectItem value="PPLG 3">
                                                        PPLG 3
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {form.formState.errors
                                                .student_class && (
                                                <div className=" pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                                    <Info size={14} />
                                                    <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                                </div>
                                            )}
                                        </FormItem>
                                    );
                                }}
                            />
                            {/* <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                            Phone Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Phone Number. . ."
                                                {...field}
                                                className={`${
                                                    form.formState.errors
                                                        .phone &&
                                                    "outline-red-500 focus:outline-red-400"
                                                }`}
                                                type="text"
                                            />
                                        </FormControl>
                                        {form.formState.errors.phone && (
                                            <div className=" pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                                <Info size={14} />
                                                <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            /> */}

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
                                    <span className="text-md">Tambah</span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
