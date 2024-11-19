import React, { useState, useEffect } from "react";
import { Sidebar, DashboardHeader } from "../../components/section/index";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";
import Cookies from "js-cookie";
import InstallPopup from "../../components/section/installPopup";
import { sidebarGlobalState } from "@/lib/globalState/sidebar-global-state";
import { Toaster } from "sonner";

export default function Layout({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const [verifyLoading, setIsVerifyLoading] = useState(false);
    const [showInstallPopup, setShowInstallPopup] = useState(false);
    const [checkRole, setCheckRole] = useState(false);
    const inventoryToken = Cookies.get("inventory_token");
    const iconMode = sidebarGlobalState((state) => state.iconMode);

    const checkingRole = async () => {
        setIsLoading(true);
        try {
            const { data: getData } = await axios.get("/api/v1/verify", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
            });

            const role = getData.data.role;
            if (role !== "admin") {
                setIsLoading(false);
                Inertia.visit("/");
                return;
            } else {
                setCheckRole(true);
                return;
            }
        } catch (error) {
            // setCheckRole(true);
            if (error.response.data.message) {
                Inertia.visit("/login");

                setIsVerifyLoading(true);
                return;
            }
        }
    };

    useEffect(() => {
        checkingRole();
    }, []);

    // useEffect(() => {
    //     const handleBeforeInstallPrompt = (e) => {
    //         e.preventDefault();
    //         setShowInstallPopup(true);
    //     };

    //     window.addEventListener(
    //         "beforeinstallprompt",
    //         handleBeforeInstallPrompt
    //     );

    //     return () => {
    //         window.removeEventListener(
    //             "beforeinstallprompt",
    //             handleBeforeInstallPrompt
    //         );
    //     };
    // }, []);

    const handleClosePopup = () => {
        setShowInstallPopup(false);
    };

    return (
        <>
            {checkRole === false ? (
                <main className="flex h-screen justify-center items-center w-full">
                    <h1>Loading...</h1>
                </main>
            ) : (
                <main className="">
                    <Toaster richColors position="top-center" />
                    <Sidebar />
                    <div
                        className={` ${
                            iconMode
                                ? "min-[1050px]:ml-[80px]"
                                : "min-[1050px]:ml-[250px]"
                        }`}
                    >
                        <DashboardHeader />
                        {children}
                    </div>
                    {/* {showInstallPopup && (
                        <InstallPopup onClose={handleClosePopup} />
                    )} */}
                </main>
            )}
        </>
    );
}
