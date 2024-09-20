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
import { Toaster, toast } from "sonner";
import { Info } from "lucide-react";
import { z } from "zod";
import { FiPlus } from "react-icons/fi";
import { useTeacherRefresher } from "@/lib/context/refresherTeacher";

const formSchema = z.object({
    number_id: z.string().min(1, {
        message: "Number Id belum Diisi",
    }),
    name: z.string().min(1, {
        message: "Nama Guru belum Diisi",
    }),

    // username: z.string().min(1, {
    //     message: "Username is Empty",
    // }),
    password: z.string().min(1, {
        message: "Password belum Diisi",
    }),
    // email: z.any().optional(),
    // image: z.any().optional(),
});

export function DialogAddTeacher() {
    const [openModal, setOpenModal] = useState(false);
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
            number_id: "",
            name: "",
            //  email: "",
            // status: "",
            // username: "",
            password: "",
            // image: "",
        },
    });
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useTeacherRefresher();

    const onSubmit = async (data) => {
        const { number_id, name, email, status, username, password } = data;
        const formData = new FormData();
        formData.append("id_number", number_id);
        formData.append("name", name);
        formData.append("email", email);
        // formData.append("status", status);
        //  formData.append("username", username);
        formData.append("password", password);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const { data: getUser } = await axios.post(
                "/api/v1/teachers/add",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setOpenModal(false);
            refresh();
            toast.success("Berhasil Menambahkan Guru", {
                duration: 3000,
            });
            // console.log(getUser);
        } catch (error) {
            setOpenModal(false);
            console.log(error);
            toast.error("Gagal Menambahkan Guru", {
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
        if (!openModal) {
            form.reset();
        }
    }, [openModal]);

    return (
        <>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger className="flex items-center gap-1 bg-violet-500 text-white py-[5px] text-[14px] px-[15px] rounded-[20px] hover:bg-violet-400">
                    <FiPlus className="h-[16px] w-[16px] " />{" "}
                    <span className="mt-[3px]">Tambah</span>
                </DialogTrigger>
                <DialogContent className="rounded-md py-[25px] px-[23px] h-auto max-[400px]:w-[320px] max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>
                            <span className="w-full flex justify-center mb-[20px] text-[20px] font-semibold text-neutral-700">
                                Tambah Guru
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
                                            Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
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
                            {/* <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email. . ."
                                            {...field}
                                            className={`${
                                                form.formState.errors.email &&
                                                "outline-red-500 focus:outline-red-400"
                                            }`}
                                        />
                                    </FormControl>
                                    {form.formState.errors.email && (
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
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                            Status
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className={`${
                                                        form.formState.errors
                                                            .status &&
                                                        "outline-red-500 focus:outline-red-400"
                                                    }`}
                                                >
                                                    <SelectValue
                                                        placeholder="Select Status"
                                                        className=""
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">
                                                    Active
                                                </SelectItem>
                                                <SelectItem value="inactive">
                                                    Inactive
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
                                )}
                            /> */}
                            {/* <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Name. . ."
                                                {...field}
                                                className={`${
                                                    form.formState.errors
                                                        .username &&
                                                    "outline-red-500 focus:outline-red-400"
                                                }`}
                                            />
                                        </FormControl>
                                        {form.formState.errors.username && (
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                            Password{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Password. . ."
                                                {...field}
                                                className={`${
                                                    form.formState.errors
                                                        .password &&
                                                    "outline-red-500 focus:outline-red-400"
                                                }`}
                                                type="password"
                                            />
                                        </FormControl>
                                        {form.formState.errors.password && (
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
