import React, { useState, useEffect } from "react";
import { Button, Card, Navigation } from "../components/ui/index";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";
import Cookies from "js-cookie";
import { RenderedProvider } from "@/lib/context/renderedHome";
import { Toaster } from "sonner";
import { GlobalProvider, useGlobalState } from "@/lib/context/userData";

export default function Layout({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const [verifyLoading, setIsVerifyLoading] = useState(true);
    const [checkRole, setCheckRole] = useState(false);
    const inventoryToken = Cookies.get("inventory_token");
    const [userData, setUserData] = useState(null);

    const checkingRole = async () => {
        setIsLoading(true);
        try {
            const { data: getData } = await axios.get("/api/v1/verify", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
            });

            setCheckRole(true);
            setUserData(getData.data);
        } catch (error) {
            setIsLoading(false);
            if (error.response.data.message) {
                Inertia.visit("/login");
                return;
            }
        }
    };

    useEffect(() => {
        checkingRole();
    }, []);

    return (
        <GlobalProvider>
            {checkRole === false ? (
                <div className="h-screen w-full flex justify-center items-center">
                    <h1>Loading...</h1>
                </div>
            ) : (
                <RenderedProvider>
                    <Toaster richColors position="top-center" />

                    {/* Panggil useGlobalState di dalam JSX setelah GlobalProvider */}
                    <main className="flex">
                        <MainContent props={userData}>{children}</MainContent>
                    </main>

                    <Navigation />
                </RenderedProvider>
            )}
        </GlobalProvider>
    );
}

function MainContent({ children, props }) {
    const { setGlobalUserData } = useGlobalState(); // Panggilan aman setelah GlobalProvider
    useEffect(() => {
        setGlobalUserData(props); // Contoh penggunaan
    }, []);

    return <>{children}</>;
}
