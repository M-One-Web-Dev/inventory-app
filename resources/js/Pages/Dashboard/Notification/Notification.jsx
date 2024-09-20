import React from "react";
import Layout from "../Layout";
import TableNotification from "../../../components/dashboard/notification/table/tableNotification";
import { NotificationRefresherProvider } from "@/lib/context/refresherNotification";
import PreviewAllItemsPDF from "./pdf";

function Notification() {
    return (
        <NotificationRefresherProvider>
            <div className="relative w-full pb-[20px]">
                <div className="absolute top-[-40px] w-full px-[10px] md:px-[20px]">
                    <div className="bg-white shadow-[3px_3px_20px_-2px_#00000024]  py-[20px] rounded-md px-[20px]">
                        <h1 className="text-[20px]">Notification</h1>
                    </div>
                </div>
                <div className="pt-[70px] px-[10px] md:px-[20px]">
                    <div className="pt-[0px] md:px-[50px] shadow-[5px_5px_30px_-5px_#00000024] px-[5px] rounded-md">
                        <TableNotification />
                    </div>
                </div>
            </div>
            <PreviewAllItemsPDF />
        </NotificationRefresherProvider>
    );
}

Notification.layout = (page) => <Layout children={page} title="Welcome" />;

export default Notification;
