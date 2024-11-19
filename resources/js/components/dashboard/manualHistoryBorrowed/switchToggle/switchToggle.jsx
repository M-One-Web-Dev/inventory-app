import React, { useState, useCallback, useEffect } from "react";
import { Switch } from "../../../ui/index";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useItemRefresher } from "@/lib/context/refresherItem";
import debounce from "lodash.debounce";

export default function SwitchToggle({ row }) {
    const [status, setStatus] = useState(
        row?.status === "returned" ? true : false
    );
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useItemRefresher();
    const [isLoading, setIsLoading] = useState(false);

    // Handle toggle with debounce
    const handleToggle = useCallback(
        debounce(async () => {
            setIsLoading(true);
            const updatedStatus = status ? true : false;
            const body = {
                id: row.id,
                status: status ? "borrowed" : "returned",
            };

            try {
                const { data: response } = await axios.post(
                    `/api/v1/history-borrowed/update-status`,
                    body,
                    {
                        headers: {
                            Authorization: `Bearer ${inventoryToken}`,
                        },
                    }
                );
                setStatus(!status);
                if (response.status === "info") {
                    toast.info("Masih ada yang Meminjam Barang Ini", {
                        duration: 3000,
                    });
                } else {
                    toast.success("Berhasil Memperbarui Status Peminjam", {
                        duration: 3000,
                    });
                }
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
        }, 500),
        [status, row, inventoryToken, refresh]
    );

    useEffect(() => {
        setStatus(row?.status === "returned");
    }, [row]);

    const handleChange = () => {
        if (!isLoading) {
            handleToggle();
        }
    };

    return (
        <div className="w-max flex justify-center">
            <Switch
                id={`switch-${row.id}`}
                checked={status}
                onCheckedChange={handleChange}
                disabled={isLoading}
            />
        </div>
    );
}
