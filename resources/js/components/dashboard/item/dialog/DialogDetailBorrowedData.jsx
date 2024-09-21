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
import moment from "moment";

export function DialogDetailBorrowedData({ row }) {
    const formatDate = (date) => {
        return date === null
            ? "-"
            : moment(date).locale("id").format("D MMMM YYYY [pukul] HH.mm");
    };

    return (
        <Dialog>
            <DialogTrigger className="bg-violet-500 py-[10px] px-[10px] rounded-sm">
                {" "}
                <IoEyeSharp className="text-white h-[14px] w-[14px]" />
            </DialogTrigger>
            <DialogContent className="rounded-md py-[25px] px-[23px] h-auto max-[400px]:w-[320px] max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-[20px]">
                        Informasi Peminjam
                    </DialogTitle>
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex items-start gap-2 mt-[15px]">
                            <h1 className="font-semibold text-[16px]">Nama:</h1>
                            <p className="text-left"> {row.username}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-semibold text-[16px]">Asal:</h1>
                            <p>{`${row.borrowed_level} ${row.borrowed_user_from}`}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-semibold text-[16px]">
                                Status:
                            </h1>
                            <p
                                className={`w-max py-[5px] px-[10px] text-[13px] rounded-[50px] ${
                                    row.status === "borrowed"
                                        ? "bg-red-600 text-white"
                                        : "bg-violet-500 text-white"
                                }`}
                            >{`${
                                row.status === "borrowed"
                                    ? "Dipinjam"
                                    : "Dikembalikan"
                            }`}</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <h1 className="w-[200px] font-semibold text-[16px]">
                                Waktu Peminjaman:
                            </h1>
                            <p>{`${formatDate(row.borrowed_at)}`}</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <h1 className="w-[200px] font-semibold text-[16px]">
                                Waktu Pengembalian:
                            </h1>
                            <p>{`${formatDate(row?.returned_at)}`}</p>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
