import React, { useState, useCallback, useEffect } from "react";
import { Switch } from "../../../ui/index";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useItemRefresher } from "@/lib/context/refresherItem";
import debounce from "lodash.debounce";

export default function SwitchToggle({ row }) {
    const [status, setStatus] = useState(row?.status === 1);
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useItemRefresher();
    const [isLoading, setIsLoading] = useState(false); // To prevent multiple clicks

    // Handle toggle with debounce
    const handleToggle = useCallback(
        debounce(async () => {
            setIsLoading(true); // Disable toggle while processing
            const updatedStatus = status ? true : false;
            const body = {
                id: row.id,
                status: status,
            };

            try {
                await axios.post(`/api/v1/temporary/update-status`, body, {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                });
                setStatus(!status);
                toast.success("Berhasil Memperbarui Status Peminjam", {
                    duration: 3000,
                });
                refresh();
            } catch (error) {
                toast.error("Gagal Memperbarui Status Peminjam", {
                    duration: 3000,
                });
                if (error.response?.data?.message === "Unauthenticated.") {
                    Inertia.visit("/login");
                }
            } finally {
                setIsLoading(false); // Re-enable toggle
            }
        }, 500), // Debounce for 500ms
        [status, row, inventoryToken, refresh]
    );

    useEffect(() => {
        setStatus(row?.status === 1);
    }, [row]);

    const handleChange = () => {
        if (!isLoading) {
            handleToggle();
        }
    };

    return (
        <div className="w-full flex justify-center">
            <Switch
                id={`switch-${row.id}`}
                checked={status}
                onCheckedChange={handleChange}
                disabled={isLoading}
            />
        </div>
    );
}
