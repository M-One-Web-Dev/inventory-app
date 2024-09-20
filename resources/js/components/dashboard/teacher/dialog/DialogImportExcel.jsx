import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Input,
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../../ui";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { Info } from "lucide-react";
import { z } from "zod";
import { FiPlus } from "react-icons/fi";
import { useTeacherRefresher } from "@/lib/context/refresherTeacher";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import QRCode from "qrcode";

export function DialogImportExcel() {
    const [openModal, setOpenModal] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const downloadTemplate = () => {
        const rowHeader = [
            [
                { v: "username", s: { font: { bold: true } } },
                { v: "password", s: { font: { bold: true } } },
                { v: "id_number", s: { font: { bold: true } } },
            ],
            ["Test Teacher", "test password", "0000"],
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(rowHeader);

        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
            if (!worksheet[cellAddress]) {
                worksheet[cellAddress] = { t: "s" };
            }
            worksheet[cellAddress].z = "@";
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blobData = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });
        saveAs(blobData, "inventory_teacher_template.xlsx");
    };

    return (
        <>
            <Popover open={openModal} onOpenChange={setOpenModal}>
                <PopoverTrigger
                    className={`flex items-center gap-1 text-white py-[5px] text-[14px] px-[15px] rounded-[20px]  ${
                        isImporting
                            ? "bg-violet-300"
                            : "hover:bg-violet-400 bg-violet-500"
                    }`}
                    disabled={isImporting}
                >
                    {isImporting ? (
                        <span className="mt-[3px]">Mengimport...</span>
                    ) : (
                        <>
                            <FiPlus className="h-[16px] w-[16px] " />{" "}
                            <span className="mt-[3px]">Import</span>
                        </>
                    )}
                </PopoverTrigger>
                <PopoverContent className="p-0 py-[10px] px-[10px] left-[-140px] max-w-max">
                    <Tabs defaultValue="import" className="">
                        <TabsList className="w-full bg-violet-100">
                            <TabsTrigger
                                value="download"
                                className="w-full data-[state=active]:bg-violet-400 data-[state=active]:text-white"
                            >
                                Unduh
                            </TabsTrigger>
                            <TabsTrigger
                                value="import"
                                className="w-full data-[state=active]:bg-violet-400 data-[state=active]:text-white"
                            >
                                Import
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent className="w-[260px]" value="download">
                            <Button
                                onClick={downloadTemplate}
                                className="w-full text-center py-2 bg-violet-500 hover:bg-violet-400 font-semibold"
                            >
                                Unduh Template
                            </Button>
                        </TabsContent>
                        <TabsContent className="w-[260px]" value="import">
                            <ImportItem
                                setIsImporting={setIsImporting}
                                setIsOpenPopup={setOpenModal}
                            />
                        </TabsContent>
                    </Tabs>
                </PopoverContent>
            </Popover>
        </>
    );
}

function ImportItem({ setIsImporting, setIsOpenPopup }) {
    const [data, setData] = useState([]);
    const [fileName, setFileName] = useState({ name: "" });
    const [errors, setErrors] = useState({});
    const inventoryToken = Cookies.get("inventory_token");
    const { refresh } = useTeacherRefresher();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName({ name: file.name });
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryStr = e.target.result;
                const workbook = XLSX.read(binaryStr, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                setData(jsonData);
            };
            reader.readAsBinaryString(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // setIsImporting(true);
        // setIsOpenPopup(false);
        // setTimeout(() => {
        //     setIsImporting(false);
        //     toast.success("Berhasil Import Data Item", {
        //         duration: 3000,
        //     });
        // }, 5000);
        // return;
        if (data.length !== 0) {
            setIsOpenPopup(false);
            setIsImporting(true);
            try {
                const body = {
                    data: data,
                };
                const { data: response } = await axios.post(
                    "/api/import-teachers",
                    body,
                    {
                        headers: {
                            Authorization: `Bearer ${inventoryToken}`,
                        },
                    }
                );

                refresh();
                toast.success("Berhasil Import data Guru", {
                    duration: 3000,
                });
            } catch (error) {
                if (
                    error.response?.data?.errors[0].includes(
                        "digunakan oleh siswa lain."
                    )
                ) {
                    toast.error(error.response?.data?.errors[0], {
                        duration: 3000,
                    });
                } else if (
                    error.response?.data?.errors[0].includes(
                        "The username field is required."
                    )
                ) {
                    toast.error("username field tidak ditemukan!", {
                        duration: 3000,
                    });
                } else if (
                    error.response?.data?.errors[0].includes(
                        "The password field is required."
                    )
                ) {
                    toast.error("password field tidak ditemukan!", {
                        duration: 3000,
                    });
                } else if (
                    error.response?.data?.errors[0].includes(
                        "The id_number field is required."
                    )
                ) {
                    toast.error("id_number field tidak ditemukan!", {
                        duration: 3000,
                    });
                } else {
                    toast.error("Gagal import data", {
                        duration: 3000,
                    });
                }
            } finally {
                setIsImporting(false);
            }
        }
    };

    return (
        <>
            <form className="w-full" onSubmit={handleSubmit}>
                <label className="block w-full" htmlFor="excel-file">
                    <input
                        className="hidden"
                        id="excel-file"
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx"
                    />
                    <div className="h-[100px] flex justify-center items-center w-full border border-dashed border-gray-300 mt-[10px] rounded-sm">
                        <p>
                            {fileName.name === ""
                                ? "Pilih File Excel"
                                : fileName.name}
                        </p>
                    </div>
                </label>

                {errors.file && <div>{errors.file}</div>}
                <div className="flex justify-end mt-[10px]">
                    <Button
                        className="transition-all duration-200 active:scale-[0.96] p-0 h-auto py-[7px] px-[15px] bg-violet-500 hover:bg-violet-400"
                        type="submit"
                    >
                        Import
                    </Button>
                </div>
            </form>
        </>
    );
}

function ExportAllItemsPDF() {
    const [items, setItems] = useState([]);
    const inventoryToken = Cookies.get("inventory_token");

    const fetchData = async () => {
        try {
            const response = await axios.get("/api/v1/items", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
            });
            if (response.data.status === "success") {
                setItems(response.data.data);
                generatePDF(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const generatePDF = async (items) => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        let yPosition = 10;
        const margin = 10;
        const qrCodeSize = 50;
        const textHeight = 10;
        const padding = 5;
        const itemHeight = qrCodeSize + textHeight + padding * 4; // QR code height + text height + padding

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const qrCodeDataUrl = await QRCode.toDataURL(item.id.toString());

            if (yPosition + itemHeight > pageHeight) {
                doc.addPage();
                yPosition = margin;
            }

            // Calculate the width and height of the border to fit content
            const contentWidth = qrCodeSize + padding * 2;
            const contentHeight = qrCodeSize + textHeight + padding * 3;

            // Draw border for item
            doc.setDrawColor(0);
            doc.setLineWidth(0.5);
            doc.rect(
                (pageWidth - contentWidth) / 2,
                yPosition,
                contentWidth,
                contentHeight
            );

            // Add QR Code
            doc.addImage(
                qrCodeDataUrl,
                "PNG",
                (pageWidth - qrCodeSize) / 2,
                yPosition + padding,
                qrCodeSize,
                qrCodeSize
            );

            // Add item name
            doc.setFontSize(12);
            doc.text(
                item.name,
                pageWidth / 2,
                yPosition + qrCodeSize + padding * 2 + textHeight,
                { align: "center" }
            );

            yPosition += contentHeight + 10; // Move to the next item position with some spacing
        }

        doc.save("inventory_items.pdf");
    };
    return (
        <Button
            onClick={fetchData}
            className="bg-violet-500 w-full hover:bg-violet-400 text-white py-2 px-4 rounded font-semibold"
        >
            Export All Items to PDF
        </Button>
    );
}
