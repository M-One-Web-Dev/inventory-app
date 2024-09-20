import { FaEdit } from "react-icons/fa";
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../ui";
import { IoEyeSharp } from "react-icons/io5";

export function DialogDetailStudent({ row }) {
    console.log(row);
    return (
        <Dialog>
            <DialogTrigger className="bg-violet-500 py-[10px] px-[10px] rounded-sm">
                <IoEyeSharp className="text-white h-[14px] w-[14px]" />
            </DialogTrigger>
            <DialogContent className="rounded-md py-[25px] px-[23px] h-auto max-[400px]:w-[320px] max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-[20px]">
                        Detail Siswa
                    </DialogTitle>
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-start gap-2 mt-[15px]">
                            <h1 className="font-semibold text-[16px]">Name:</h1>
                            <p className="text-left"> {row.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-semibold text-[16px]">
                                Number Id:
                            </h1>
                            <p>
                                {" "}
                                {row.id_number === null ? "-" : row.id_number}
                            </p>
                        </div>
                        <div className="flex items-start gap-2 mt-[15px]">
                            <h1 className="font-semibold text-[16px]">
                                Alamat:
                            </h1>
                            <p className="text-left">
                                {" "}
                                {row.address === null || row.address === null
                                    ? "-"
                                    : row.address}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-semibold text-[16px]">
                                Nomor HP:
                            </h1>
                            <p>
                                {" "}
                                {row.phone_number === null ||
                                row.phone_number === "null"
                                    ? "-"
                                    : row.phone_number}
                            </p>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
