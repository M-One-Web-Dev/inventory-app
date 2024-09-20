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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../ui";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { z } from "zod";
import { FiPlus } from "react-icons/fi";
import { useItemRefresher } from "@/lib/context/refresherItem";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const dummyListItem = [
    "L 001",
    "L 002",
    "L 003",
    "L 004",
    "L 005",
    "L 006",
    "L 007",
    "L 008",
    "L 009",
    "L 010",
    "L 011",
    "L 012",
    "L 013",
    "L 014",
    "L 015",
    "L 016",
    "L 017",
    "L 018",
    "L 019",
    "L 020",
    "L 021",
    "L 022",
    "L 023",
    "L 024",
    "L 025",
    "L 026",
    "L 027",
    "L 028",
    "L 029",
    "MSI 027",
    "No Name Item",
];

const formSchema = z.object({
    item_id: z.string().min(1, {
        message: "Nama Item belum Diisi",
    }),
    name: z.string().min(1, {
        message: "Nama Peminjam belum Diisi",
    }),
    student_class: z.string().min(1, {
        message: "Kelas belum Diisi",
    }),
    level: z.string().min(1, {
        message: "Level belum Diisi",
    }),
    borrowing_name: z.string(1, {
        message: "Nama Peminjam belum Diisi",
    }),
});

export function DialogAddTemporary() {
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
            borrowing_name: "",
        },
    });
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [studentList, setStudentList] = useState([]);
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useItemRefresher();
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    const languages = [
        { label: "English", value: "en" },
        { label: "French", value: "fr" },
        { label: "German", value: "de" },
        { label: "Spanish", value: "es" },
        { label: "Portuguese", value: "pt" },
        { label: "Russian", value: "ru" },
        { label: "Japanese", value: "ja" },
        { label: "Korean", value: "ko" },
        { label: "Chinese", value: "zh" },
    ];

    const onSubmit = async (data) => {
        const {
            item_id,
            number_id,
            name,
            phone,
            student_class,
            level,
            item_number,
            item,
        } = data;

        const body = {
            item_id: "1",
            item_name: item_id,
            number_id: "1",
            name: name,
            phone: "1",
            student_class: student_class,
            level: level,
            status: 0,
            item_number_id: "1",
        };

        try {
            const { data: postData } = await axios.post(
                "/api/v1/temporary/add",
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
            toast.success("Success Add Categories", {
                duration: 3000,
            });
            refresh();
        } catch (error) {
            toast.error("Failed Add Categories", {
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

    const getAllStudent = async (search = "") => {
        try {
            const { data: getStudent } = await axios("/api/v1/students", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    page: 1,
                    perPage: 10,
                    search,
                },
            });
            const format = getStudent.data.map((item) => ({
                label: item.name,
                value: item.name,
            }));
            setStudentList(format);
        } catch (error) {
            console.log(error);
            if (error.response.data.message === "Unauthenticated.") {
                Inertia.visit("/login");
                return;
            }
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        getAllStudent(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

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
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger className="flex items-center gap-1 bg-violet-500 text-white py-[5px] text-[14px] px-[15px] rounded-[20px] hover:bg-violet-400">
                    <FiPlus className="h-[16px] w-[16px] " />{" "}
                    <span className="mt-[3px]">Tambah</span>
                </DialogTrigger>
                <DialogContent className="rounded-md py-[25px] px-[23px] h-auto max-[400px]:w-[320px] max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>
                            <h1 className="text-center mb-[20px] text-[20px] font-semibold text-neutral-700">
                                Tambah Temporary
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
                                render={({ field }) => {
                                    return (
                                        <FormItem className="space-y-0 relative">
                                            <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                                Nama Peminjam{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full text-[15px] justify-between border-[1.5px]",
                                                                !field.value &&
                                                                    "text-muted-foreground",
                                                                form.formState
                                                                    .errors
                                                                    .name &&
                                                                    "border-red-500 border:outline-red-400"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? field.value
                                                                : "Cari Nama Peminjam"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    side="top"
                                                    className="relative"
                                                >
                                                    <Command className="left-0">
                                                        <CommandInput
                                                            placeholder="Cari Siswa..."
                                                            onInput={(e) => {
                                                                setSearchTerm(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                Nama Peminjam
                                                                tidak ditemukan.
                                                            </CommandEmpty>
                                                            <CommandGroup className="overflow-y-auto">
                                                                {studentList.map(
                                                                    (
                                                                        language
                                                                    ) => (
                                                                        <CommandItem
                                                                            value={
                                                                                language.label
                                                                            }
                                                                            key={
                                                                                language.value
                                                                            }
                                                                            onSelect={() => {
                                                                                form.setValue(
                                                                                    "name",
                                                                                    language.value
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    language.value ===
                                                                                        field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {
                                                                                language.label
                                                                            }
                                                                        </CommandItem>
                                                                    )
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                            {form.formState.errors.name && (
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
                                name="item_id"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="space-y-0 relative">
                                            <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                                Nama Item{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full text-[15px] justify-between border-[1.5px]",
                                                                !field.value &&
                                                                    "text-muted-foreground",
                                                                form.formState
                                                                    .errors
                                                                    .name &&
                                                                    "border-red-500 border:outline-red-400"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? field.value
                                                                : "Cari Nama Item"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="relative">
                                                    <Command className="left-0">
                                                        <CommandInput
                                                            placeholder="Cari Item..."
                                                            onChange={(e) => {
                                                                console.log(e);
                                                            }}
                                                            onInput={(e) => {
                                                                setSearchTerm(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        />
                                                        <CommandList className="max-h-[150px]">
                                                            <CommandEmpty>
                                                                Nama Item tidak
                                                                ditemukan.
                                                            </CommandEmpty>
                                                            <CommandGroup className="overflow-y-auto">
                                                                {dummyListItem.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <CommandItem
                                                                            value={
                                                                                item
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                            onSelect={() => {
                                                                                form.setValue(
                                                                                    "item_id",
                                                                                    item
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    item ===
                                                                                        field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {
                                                                                item
                                                                            }
                                                                        </CommandItem>
                                                                    )
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                            {form.formState.errors.name && (
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
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                            Nama Peminjam{" "}
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
                            /> */}
                            {/* <FormField
                                control={form.control}
                                name="item_id"
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
                                                placeholder="Item Name. . ."
                                                {...field}
                                                className={`${
                                                    form.formState.errors
                                                        .item_id &&
                                                    "outline-red-500 focus:outline-red-400"
                                                }`}
                                            />
                                        </FormControl>
                                        {form.formState.errors.item_id && (
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
                                                            placeholder="Select Level"
                                                            className=""
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent className="max-h-[140px] overflow-auto">
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
                                                            placeholder="Select Class"
                                                            className=""
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent className="max-h-[140px] overflow-auto">
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
