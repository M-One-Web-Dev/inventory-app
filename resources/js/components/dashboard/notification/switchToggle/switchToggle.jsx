import React, { useState, useCallback } from "react";
import { Switch } from "../../../ui/index";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useNotificationRefresher } from "@/lib/context/refresherNotification";
import debounce from "lodash.debounce";

export default function SwitchToggle({ row }) {
    const [status, setStatus] = useState(row?.status === "returned");
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useNotificationRefresher();
    const [isLoading, setIsLoading] = useState(false); // To prevent multiple clicks

    // Handle toggle with debounce
    const handleToggle = useCallback(
        debounce(async () => {
            setIsLoading(true); // Disable toggle while processing
            const updatedStatus = status ? "borrowed" : "returned";
            const body = {
                notification_id: row.id,
                status: updatedStatus,
            };

            try {
                await axios.post(`/api/v1/notification/return`, body, {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                });
                setStatus(!status);
                toast.success("Berhasil memperbarui status Notifikasi", {
                    duration: 3000,
                });
                refresh();
            } catch (error) {
                toast.error("Gagal memperbarui status Notifikasi", {
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

    const handleChange = () => {
        if (!isLoading) {
            handleToggle();
        }
    };

    return (
        <Switch
            id={`switch-${row.item_id}`}
            checked={status}
            onCheckedChange={handleChange}
            disabled={isLoading} // Disable while processing
        />
    );
}
