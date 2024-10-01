import React, { useState, useEffect } from "react";
import { Sidebar, DashboardHeader } from "../../components/section/index";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";
import Cookies from "js-cookie";
import InstallPopup from "../../components/section/installPopup";
import { Toaster } from "sonner";

export default function Layout({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const [verifyLoading, setIsVerifyLoading] = useState(false);
    const [showInstallPopup, setShowInstallPopup] = useState(false);
    const [checkRole, setCheckRole] = useState(false);
    const inventoryToken = Cookies.get("inventory_token");

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
                <main className="flex">
                    <Toaster richColors position="top-center" />
                    <Sidebar />
                    <div className="w-full">
                        <DashboardHeader />
                        {children}
                    </div>
                    {showInstallPopup && (
                        <InstallPopup onClose={handleClosePopup} />
                    )}
                </main>
            )}
        </>
    );
}
