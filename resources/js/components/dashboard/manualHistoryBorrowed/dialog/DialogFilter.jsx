import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../ui";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Filter } from "lucide-react";
import { useItemRefresher } from "@/lib/context/refresherItem";
import { manualHistoryBorrowedStore } from "../../../../lib/globalState/refresherManualHistoryBorrowed";

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
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? "black" : "gray",
        boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
        "&:hover": {
            borderColor: "black",
        },
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
    }),
};

export function DialogFilter() {
    const [openModal, setOpenModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const { reset, watch, setValue } = useForm();
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useItemRefresher();
    const searchGlobalState = manualHistoryBorrowedStore(
        (state) => state.search
    );
    const setSearchGlobalState = manualHistoryBorrowedStore(
        (state) => state.handleSearchValue
    );
    const statusGlobalState = manualHistoryBorrowedStore(
        (state) => state.status
    );
    const setStatushGlobalState = manualHistoryBorrowedStore(
        (state) => state.handleStatusValue
    );
    const resetGlobalState = manualHistoryBorrowedStore((state) => state.reset);

    const onSubmit = async (e) => {
        e.preventDefault();

        setSearchGlobalState(watch("search"));
        setStatushGlobalState(watch("status"));

        setOpenModal(false);
    };

    useEffect(() => {
        if (openModal) {
            setValue("search", searchGlobalState);
            setValue("status", statusGlobalState);
        }
    }, [openModal]);

    return (
        <>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger className="flex items-center gap-1 bg-violet-500 text-white py-[5px] text-[14px] px-[15px] rounded-[20px] hover:bg-violet-400">
                    <Filter className="h-[16px] w-[16px] " />{" "}
                    <span className="mt-[3px]">Filter</span>
                </DialogTrigger>
                <DialogContent className="rounded-md py-[25px] px-[23px] h-auto max-[400px]:w-[320px] max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-center mb-[20px] text-[20px] font-semibold text-neutral-700">
                            Filter Data
                        </DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={onSubmit}
                        action=""
                        className="flex flex-col gap-[15px]"
                    >
                        <div>
                            <label htmlFor="">Nama Peminjam</label>
                            <Input
                                placeholder="Nama Peminjam..."
                                value={watch("search") ?? ""}
                                onChange={(event) => {
                                    const searchValue = event.target.value;
                                    setValue("search", searchValue);
                                }}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="">Status</label>
                            <Select
                                value={watch("status")}
                                onValueChange={(e) => {
                                    setValue("status", e);
                                }}
                            >
                                <SelectTrigger id="filter_status">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="returned">
                                        Dikembalikan
                                    </SelectItem>
                                    <SelectItem value="borrowed">
                                        Belum Dikembalikan
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mt-[20px] flex gap-4 justify-end w-full">
                            <Button
                                className="max-w-max bg-[#A27FFE] hover:bg-[#b295fb]"
                                type="button"
                                onClick={() => {
                                    reset();
                                    //resetGlobalState();
                                }}
                            >
                                <span className="text-md">Reset</span>
                            </Button>
                            <Button
                                className="max-w-max bg-[#A27FFE] hover:bg-[#b295fb]"
                                // disable={isLoading}
                                type="submit"
                            >
                                <span className="text-md">Filter</span>
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
