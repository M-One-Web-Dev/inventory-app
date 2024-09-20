import React from "react";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/index";
import { FaUserCircle } from "react-icons/fa";
import { CustomSheet } from "./customSheet";
import { Link } from "@inertiajs/inertia-react";

export function DashboardHeader() {
    return (
        <div className="w-full px-[25px] flex items-center bg-[#885ff9] pt-[20px] justify-between min-[1050px]:justify-end pb-[70px]">
            <CustomSheet />
            <LogoutDialog />
        </div>
    );
}

export function LogoutDialog() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 border-none">
                <FaUserCircle className="h-[30px] w-[30px] text-slate-100" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="py-[10px] px-[10px] flex flex-col h-auto mr-[40px] gap-[5px]">
                <Link
                    href="/"
                    className="bg-violet-500 text-white rounded-md py-[8px] px-[16px] font-semibold text-sm"
                >
                    Halaman Peminjaman
                </Link>
                <Button
                    onClick={() => {
                        Cookies.remove("inventory_token");
                        Inertia.visit("/login");
                    }}
                    className="w-full bg-red-500 font-semibold"
                >
                    Logout
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
