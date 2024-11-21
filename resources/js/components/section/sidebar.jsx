import React from "react";
import { Link, usePage } from "@inertiajs/inertia-react";
import { TiHome } from "react-icons/ti";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaQrcode } from "react-icons/fa6";
import { useState } from "react";
import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";
import { BsArchiveFill } from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";
// import { IoSettingsSharp } from "react-icons/io5";
import { FiChevronRight, FiBox } from "react-icons/fi";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/index";
import { PiUserCircleDashedFill } from "react-icons/pi";
import { sidebarGlobalState } from "@/lib/globalState/sidebar-global-state";

const menuItems = [
    {
        name: "Dashboard",
        icon: <TiHome className="h-[19px] w-[19px]" />,
        url: "/dashboard",
    },
    {
        name: "Setting",
        icon: <IoSettingsSharp className="h-[19px] w-[19px]" />,
        url: "/dashboard/setting",
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
        name: "Informasi Peminjam",
        icon: <AiFillInfoCircle className="h-[19px] w-[19px]" />,
        subMenu: [
            {
                name: "Tingkat",
                url: "/dashboard/borrowed-information/level",
            },
            {
                name: "Asal",
                url: "/dashboard/borrowed-information/origin",
            },
        ],
    },
    {
        name: "Peminjaman",
        icon: <BsArchiveFill className="h-[19px] w-[19px]" />,
        subMenu: [
            // {
            //     name: "Konfirmasi",
            //     url: "/dashboard/confirmation-borrowed",
            // },
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

export function Sidebar() {
    const pathname = usePage();
    const iconMode = sidebarGlobalState((state) => state.iconMode);
    const setIconMode = sidebarGlobalState((state) => state.setIconMode);
    //  const [iconMode, setIconMode] = useState(false);
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
                } else if (!findItem && !iconMode) {
                    return "text-slate-500 justify-between px-[20px] flex items-center gap-5 border-solid border-l-4 rounded border-white";
                } else {
                    return "text-slate-500 justify-between px-[10px] flex items-center gap-5 border-solid border-l-4 border-white";
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
        <nav
            className={`${
                iconMode ? "w-[80px]" : "w-[250px]"
            } fixed top-0 hidden min-[1050px]:block transition-all duration-300 shadow-[5px_0px_10px_-5px_#00000024] overflow-auto h-screen pt-[20px] z-50 bg-white`}
        >
            <div className="flex justify-center text-violet-700 font-medium gap-1 items-center">
                <FiBox
                    className={`${
                        iconMode ? "h-[25px] w-[25px]" : "h-[19px] w-[19px]"
                    }`}
                />
                {iconMode ? null : (
                    <h1 className="text-[18px] mt-[5px]">Inventory</h1>
                )}
            </div>
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
                {menuItems.map((item, index) => {
                    return (
                        <React.Fragment key={index}>
                            {item.subMenu ? (
                                <div>
                                    <div
                                        onClick={() =>
                                            HandleOpenSubMenu(item.name)
                                        }
                                        className={`cursor-pointer ${HandleSubMenuWrapper(
                                            "link",
                                            item.subMenu
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
                                                                item.subMenu
                                                            )}`}
                                                        >
                                                            {item.icon}
                                                        </PopoverTrigger>
                                                        <PopoverContent className="right-[-120px] top-[-44px] flex flex-col py-[5px] w-max">
                                                            {item.subMenu.map(
                                                                (
                                                                    subItem,
                                                                    index
                                                                ) => (
                                                                    <Link
                                                                        key={
                                                                            index
                                                                        }
                                                                        href={
                                                                            subItem.url
                                                                        }
                                                                        className={`${HandleActiveSubMenu(
                                                                            subItem.url
                                                                        )}`}
                                                                    >
                                                                        {
                                                                            subItem.name
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </PopoverContent>
                                                    </Popover>
                                                ) : (
                                                    <>{item.icon}</>
                                                )}
                                            </div>
                                            {iconMode ? (
                                                ""
                                            ) : (
                                                <h1 className="mt-[4px] text-[15px]">
                                                    {item.name}
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
                                                        item.name
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
                                                    item.name &&
                                                openSubMenu.open
                                                    ? "h-[65px] mt-[5px]"
                                                    : "h-0"
                                            } overflow-hidden transition-all duration-300 flex flex-col gap-3 ml-[60px]`}
                                        >
                                            {item.subMenu.map(
                                                (subItem, index) => (
                                                    <Link
                                                        key={index}
                                                        href={subItem.url}
                                                        className={`${HandleActiveSubMenu(
                                                            subItem.url
                                                        )}`}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={item.url}
                                    key={index}
                                    className={`${HandleActivePath(
                                        item.url
                                    )} flex items-center gap-5 `}
                                >
                                    <div
                                        className={`${HandleIconColor(
                                            item.url
                                        )}`}
                                    >
                                        {item.icon}
                                    </div>
                                    {!iconMode && (
                                        <h1 className="mt-[4px] text-[15px]">
                                            {item.name}
                                        </h1>
                                    )}
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </nav>
    );
}
