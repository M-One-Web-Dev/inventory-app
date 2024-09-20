import React, { useState, useEffect } from "react";
import { Button, Card, Navigation } from "../components/ui/index";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";
import Cookies from "js-cookie";
import { RenderedProvider } from "@/lib/context/renderedHome";
import { Toaster } from "sonner";

export default function Layout({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const [verifyLoading, setIsVerifyLoading] = useState(true);
    const [checkRole, setCheckRole] = useState(false);
    const inventoryToken = Cookies.get("inventory_token");

    const checkingRole = async () => {
        setIsLoading(true);
        try {
            const { data: getUser } = await axios.get("/api/user", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
            });

            // const role = getUser.role;
            // if (role === "student") {
            //     setIsLoading(false);
            //     Inertia.visit("/");
            //     return;
            // } else {
            setCheckRole(true);
            //     return;
            // }
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

    // useEffect(() => {
    //     if (checkRole === true) {
    //         setIsVerifyLoading(false);
    //     }
    // }, [checkRole]);

    return (
        <>
            {checkRole === false ? (
                <div className="h-screen w-full flex justify-center items-center">
                    <h1>Loading...</h1>
                </div>
            ) : (
                <RenderedProvider>
                    <Toaster richColors position="top-center" />
                    <main className="flex">{children}</main>
                    <Navigation />
                </RenderedProvider>
            )}
        </>
    );
}
