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
import Select from "react-select";

const dummyListLevel = [
    { label: "X", value: "X" },
    { label: "XI", value: "XI" },
    { label: "XII", value: "XII" },
    { label: "Guru", value: "Guru" },
    { label: "Karyawan", value: "Karyawan" },
];

const dummyListUserFrom = [
    { label: "PPLG 1", value: "PPLG 1" },
    { label: "PPLG 2", value: "PPLG 2" },
    { label: "PPLG 3", value: "PPLG 3" },
    { label: "PPLG", value: "PPLG" },
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

const LoadingMessage = (props) => {
    return (
        <div
            {...props.innerProps}
            style={props.getStyles("loadingMessage", props)}
        >
            Loading...
        </div>
    );
};

const customStyles = {
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
};

export function DialogAddTemporary() {
    const [openModal, setOpenModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [listItems, setListItems] = useState([]);
    const {
        reset,
        watch,
        setValue,
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
    const [searchTerm, setSearchTerm] = useState("");
    const [studentList, setStudentList] = useState([]);
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useItemRefresher();
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();

        const body = {
            user_id:
                watch("name").value === undefined ? "" : watch("name").value,
            borrowed_user_from:
                watch("user_from").value === undefined
                    ? ""
                    : watch("user_from").value,
            borrowed_level:
                watch("level").value === undefined ? "" : watch("level").value,
            item_id:
                watch("item").value === undefined ? "" : watch("item").value,
            type: "manual",
        };

        try {
            const { data: response } = await axios.post(
                "/api/v1/history-borrowed/add",
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
            if (response.status === "info") {
                toast.success("Masih ada Yang Meminjam Barang Ini", {
                    duration: 3000,
                });
            } else {
                toast.success("Berhasil Menambahkan Item", {
                    duration: 3000,
                });
            }
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

    const getAllUsers = async () => {
        try {
            const { data: getItems } = await axios("/api/v1/list-user", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    page: 1,
                    perPage: 10,
                    search:
                        watch("search_name") === undefined
                            ? ""
                            : watch("search_name"),
                },
            });
            setListItems(getItems?.data);
            const newArr = getItems.data.map((item) => {
                return {
                    label: item.username,
                    value: item.id,
                    role: item.role,
                };
            });
            setValue("list_user", newArr);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllItems = async () => {
        setValue("loading_item", true);
        try {
            const { data: getData } = await axios("/api/v1/items", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    page: 1,
                    perPage: 10,
                    search: watch("search_item"),
                },
            });

            const newArr = getData.data.map((item) => {
                return {
                    label: item.name,
                    value: item.id,
                    id: item.id_number,
                };
            });
            setValue("item_list", newArr);
        } catch (error) {
            console.log(error);
            if (error.response.data.message === "Unauthenticated.") {
                Inertia.visit("/login");
                return;
            }
        } finally {
            setValue("loading_item", false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setValue("debounce_name", watch("search_name"));
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [watch("search_name")]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setValue("debounce_item", watch("search_item"));
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [watch("search_item")]);

    useEffect(() => {
        getAllUsers(watch("debounce_name"));
    }, [watch("debounce_name")]);

    useEffect(() => {
        getAllItems(watch("debounce_item"));
    }, [watch("debounce_item")]);

    useEffect(() => {
        getAllUsers();
        getAllItems();
    }, []);

    useEffect(() => {
        if (!openModal) {
            reset();
        }
    }, [openModal]);

    return (
        <>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger className="flex items-center gap-1 bg-violet-500 text-white py-[5px] text-[14px] px-[15px] rounded-[20px] hover:bg-violet-400">
                    <FiPlus className="h-[16px] w-[16px] " />{" "}
                    <span className="mt-[3px]">Tambah</span>
                </DialogTrigger>
                <DialogContent className="overflow-visible rounded-md py-[25px] px-[23px] h-auto max-[400px]:w-[320px] max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-center mb-[20px] text-[20px] font-semibold text-neutral-700">
                            Tambah Temporary
                        </DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={onSubmit}
                        action=""
                        className="flex flex-col gap-[15px]"
                    >
                        <div>
                            <label htmlFor="">Name</label>
                            <Select
                                options={watch("list_user") || []}
                                styles={customStyles}
                                maxMenuHeight={200}
                                isClearable={true}
                                value={watch("name")}
                                onChange={(value) => {
                                    setValue("name", value);
                                }}
                                onInputChange={(e) =>
                                    setValue("search_name", e)
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="">Tingkat</label>
                            <Select
                                options={dummyListLevel}
                                styles={customStyles}
                                maxMenuHeight={200}
                                isClearable={true}
                                value={watch("level")}
                                onChange={(value) => {
                                    setValue("level", value);
                                }}
                                onInputChange={(e) =>
                                    setValue("search_level", e)
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="">Asal</label>
                            <Select
                                options={dummyListUserFrom}
                                styles={customStyles}
                                maxMenuHeight={100}
                                isClearable={true}
                                value={watch("user_from")}
                                onChange={(value) => {
                                    setValue("user_from", value);
                                }}
                                onInputChange={(e) =>
                                    setValue("search_user_from", e)
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="">Item</label>
                            <Select
                                options={watch("item_list") || []}
                                styles={customStyles}
                                maxMenuHeight={100}
                                isClearable={true}
                                value={watch("item")}
                                onChange={(value) => {
                                    setValue("item", value);
                                }}
                                onInputChange={(e) =>
                                    setValue("search_item", e)
                                }
                                isLoading={
                                    watch("loading_item") === undefined ||
                                    watch("loading_item") === false
                                        ? false
                                        : true
                                }
                                components={{ LoadingMessage }}
                            />
                        </div>

                        <div className="mt-[20px] flex gap-4 justify-end w-full">
                            <Button
                                className="max-w-max bg-[#A27FFE] hover:bg-[#b295fb]"
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
                </DialogContent>
            </Dialog>
        </>
    );
}