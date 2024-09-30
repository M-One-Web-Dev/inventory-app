import React from "react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/index.js";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, usePage } from "@inertiajs/inertia-react";
import { TiHome } from "react-icons/ti";
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaQrcode } from "react-icons/fa6";
import { useState } from "react";
import { LuChevronsLeft } from "react-icons/lu";
import { FiChevronRight, FiBox } from "react-icons/fi";

const menuItems = [
    {
        name: "Dashboard",
        icon: <TiHome className="h-[19px] w-[19px]" />,
        url: "/dashboard",
    },
    // {
    //     name: "Notification",
    //     icon: <IoMdNotifications className="h-[19px] w-[19px]" />,
    //     url: "/dashboard/notification",
    // },
    // {
    //     name: "Temporary",
    //     icon: <PiUserCircleDashedFill className="h-[19px] w-[19px]" />,
    //     url: "/dashboard/temporary",
    // },
    {
        name: "Siswa",
        icon: <FaUsers className="h-[19px] w-[19px]" />,
        subMenu: [
            {
                name: "Siswa",
                url: "/dashboard/student",
            },
            {
                name: "Siswa Aktif",
                url: "/dashboard/active-student",
            },
        ],
    },
    {
        name: "Peminjaman",
        icon: <FaUsers className="h-[19px] w-[19px]" />,
        subMenu: [
            {
                name: "QR Code",
                url: "/dashboard/qr-code-borrowed",
            },
            {
                name: "Manual",
                url: "/dashboard/manual-borrowed",
            },
        ],
    },
    {
        name: "Guru",
        icon: <FaUserAlt className="h-[19px] w-[19px]" />,
        url: "/dashboard/teacher",
    },
    {
        name: "Barang & Kategori",
        icon: <BiSolidCategory className="h-[19px] w-[19px]" />,
        subMenu: [
            {
                name: "Barang",
                url: "/dashboard/item",
            },
            {
                name: "Kategori",
                url: "/dashboard/category",
            },
        ],
    },
    {
        name: "QR Scan",
        icon: <FaQrcode className="h-[19px] w-[19px]" />,
        url: "/dashboard/qr-scan",
    },
];

export function CustomSheet() {
    const pathname = usePage();
    const [iconMode, setIconMode] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState({
        open: false,
        menuName: "",
    });

    const HandleActiveSubMenu = (url) => {
        if (url === pathname.url) {
            return "text-violet-500 mt-[4px] text-[15px]";
        } else {
            return "text-slate-500 mt-[4px] text-[15px]";
        }
    };

    const HandleSubMenuWrapper = (type, arrayLinkUrl) => {
        const findItem = arrayLinkUrl.find((item) => {
            return item.url === pathname.url;
        });

        switch (type) {
            case "link":
                if (findItem && !iconMode) {
                    return "text-violet-500 justify-between px-[20px] flex items-center gap-5 border-solid border-l-4 border-violet-400";
                } else {
                    return "text-slate-500 justify-between px-[20px] flex items-center gap-5 border-solid border-l-4 border-white";
                }
            case "icon":
                if (findItem && iconMode) {
                    return "h-full p-[10px] bg-violet-500 text-white rounded-md";
                } else {
                    return "h-full p-[10px] bg-slate-200 text-slate-500 rounded-md";
                }
            default:
                break;
        }
    };

    const HandleOpenSubMenu = (currentMenu) => {
        if (openSubMenu.open && openSubMenu.menuName === currentMenu) {
            setOpenSubMenu({ open: false, menuName: "" });
        } else {
            setOpenSubMenu({ open: true, menuName: currentMenu });
        }
    };

    const HandleActivePath = (url) => {
        if (iconMode && pathname.url !== url) {
            return "text-slate-500";
        } else if (!iconMode && pathname.url !== url) {
            return "border-l-4 border-solid border-white text-slate-500 pl-[20px]";
        } else if (!iconMode && pathname.url === url) {
            return "border-l-4 border-solid border-violet-400 pl-[20px] text-violet-500 pl-[20px]";
        } else if (iconMode && pathname.url === url) {
            return "text-white";
        } else {
            return "";
        }
    };

    const HandleIconColor = (url) => {
        if (url === pathname.url && iconMode) {
            return "bg-violet-500 py-[10px] px-[10px]  rounded-md";
        } else if (iconMode) {
            return "bg-slate-200 py-[10px] px-[10px]  rounded-md";
        } else {
            return "";
        }
    };

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger className="max-[1050px]:block hidden">
                <RxHamburgerMenu className="h-[25px] w-[25px] text-white" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-auto">
                <nav
                    className={` ${
                        iconMode ? "w-[100px]" : "w-[300px]"
                    } sticky top-0 block transition-all duration-300 shadow-[5px_0px_10px_-5px_#00000024] overflow-auto h-screen pt-[20px]`}
                >
                    <div className="flex justify-center text-violet-700 font-medium gap-1 items-center">
                        <FiBox
                            className={`${
                                iconMode
                                    ? "h-[25px] w-[25px]"
                                    : "h-[19px] w-[19px]"
                            }`}
                        />
                        {!iconMode && (
                            <h1 className="text-[18px] mt-[5px]">Inventory</h1>
                        )}
                    </div>

                    {/* Icon toggle button */}
                    <div
                        className={`px-[20px] flex items-center mt-[20px] ${
                            iconMode ? "justify-center" : "justify-between"
                        }`}
                    >
                        <h1
                            className={`${
                                iconMode && "hidden"
                            } text-slate-500 text-[15px]`}
                        >
                            Dashboard
                        </h1>
                        <button onClick={() => setIconMode(!iconMode)}>
                            <LuChevronsLeft
                                className={`h-[19px] w-[19px] transition-all duration-300 ${
                                    iconMode && "rotate-[180deg]"
                                }`}
                            />
                        </button>
                    </div>

                    <div
                        className={`mt-[25px] flex flex-col gap-5 ${
                            iconMode && "items-center"
                        }`}
                    >
                        {menuItems.map((menu, index) => (
                            <div key={index}>
                                {menu.subMenu ? (
                                    <div>
                                        <div>
                                            <div
                                                onClick={() =>
                                                    HandleOpenSubMenu(
                                                        menu?.name
                                                    )
                                                }
                                                className={`cursor-pointer  ${HandleSubMenuWrapper(
                                                    "link",
                                                    menu?.subMenu
                                                )}`}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div
                                                        className={`${
                                                            iconMode
                                                                ? " bg-slate-200 rounded-md"
                                                                : ""
                                                        }`}
                                                    >
                                                        {iconMode ? (
                                                            <Popover>
                                                                <PopoverTrigger
                                                                    className={`${HandleSubMenuWrapper(
                                                                        "icon",
                                                                        menu?.subMenu
                                                                    )}`}
                                                                >
                                                                    <FaUsers
                                                                        className={`h-[19px] w-[19px]`}
                                                                    />
                                                                </PopoverTrigger>
                                                                <PopoverContent className="right-[-160px] top-[-44px] flex flex-col py-[5px] w-max">
                                                                    {menu?.subMenu.map(
                                                                        (
                                                                            subMenuItem,
                                                                            index
                                                                        ) => (
                                                                            <Link
                                                                                key={
                                                                                    index
                                                                                }
                                                                                href={
                                                                                    subMenuItem.url
                                                                                }
                                                                                className={`${HandleActiveSubMenu(
                                                                                    subMenuItem.url
                                                                                )}`}
                                                                                onClick={() =>
                                                                                    setSheetOpen(
                                                                                        false
                                                                                    )
                                                                                }
                                                                            >
                                                                                {
                                                                                    subMenuItem.name
                                                                                }
                                                                            </Link>
                                                                        )
                                                                    )}
                                                                </PopoverContent>
                                                            </Popover>
                                                        ) : (
                                                            <FaUsers
                                                                className={`h-[19px] w-[19px]`}
                                                            />
                                                        )}
                                                    </div>
                                                    {iconMode ? (
                                                        ""
                                                    ) : (
                                                        <h1 className="mt-[4px] text-[15px]">
                                                            {menu?.name}
                                                        </h1>
                                                    )}
                                                </div>
                                                {iconMode ? (
                                                    ""
                                                ) : (
                                                    <FiChevronRight
                                                        className={`${
                                                            openSubMenu.open &&
                                                            openSubMenu.menuName ===
                                                                menu?.name
                                                                ? "rotate-[90deg]"
                                                                : ""
                                                        } transition-all duration-300`}
                                                    />
                                                )}
                                            </div>

                                            {iconMode ? (
                                                ""
                                            ) : (
                                                <div
                                                    className={`${
                                                        openSubMenu.menuName ===
                                                            menu?.name &&
                                                        openSubMenu.open
                                                            ? "h-[65px] mt-[5px]"
                                                            : "h-0"
                                                    } overflow-hidden transition-all duration-300 flex flex-col gap-3 ml-[60px]`}
                                                >
                                                    {menu?.subMenu.map(
                                                        (
                                                            subMenuItem,
                                                            index
                                                        ) => (
                                                            <Link
                                                                key={index}
                                                                href={
                                                                    subMenuItem.url
                                                                }
                                                                className={`${HandleActiveSubMenu(
                                                                    subMenuItem.url
                                                                )}`}
                                                                onClick={() =>
                                                                    setSheetOpen(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    subMenuItem.name
                                                                }
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={menu.url}
                                        className={`flex items-center gap-5 px-[20px] py-[10px] ${HandleActivePath(
                                            menu.url
                                        )}`}
                                        onClick={() => setSheetOpen(false)}
                                    >
                                        <div
                                            className={HandleIconColor(
                                                menu.url
                                            )}
                                        >
                                            {menu.icon}
                                        </div>
                                        {!iconMode && <h1>{menu.name}</h1>}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
