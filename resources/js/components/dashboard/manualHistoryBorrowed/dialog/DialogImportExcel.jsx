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
import { toast } from "sonner";
import { Info } from "lucide-react";
import { z } from "zod";
import { FiPlus } from "react-icons/fi";
import { useItemRefresher } from "@/lib/context/refresherItem";
import "jspdf-autotable";
import moment from "moment";

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
                { v: "number_id", s: { font: { bold: true } } },
                { v: "name", s: { font: { bold: true } } },
            ],
            ["INV/PPLG/L/001", "Laptop 001"],
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(rowHeader);

        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
            if (!worksheet[cellAddress]) {
                worksheet[cellAddress] = { t: "s" }; //
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
        saveAs(blobData, "inventory_item_template.xlsx");
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
                                value="export"
                                className="w-full data-[state=active]:bg-violet-400 data-[state=active]:text-white"
                            >
                                Export
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
                        <TabsContent className="w-[260px]" value="export">
                            <ExportAllItemsPDF />
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
    const { refresh } = useItemRefresher();

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
                    "/api/upload-json",
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
                toast.error("Gagal import data", {
                    duration: 3000,
                });
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

const formSchema = z.object({
    date: z.string().min(1, {
        message: "Tanggal belum Diisi",
    }),
});

function ExportAllItemsPDF() {
    const [items, setItems] = useState([]);
    const inventoryToken = Cookies.get("inventory_token");
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: "",
        },
    });
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    const fetchData = async (data) => {
        try {
            const response = await axios.get("/api/v1/temporary/export", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    date: data.date,
                },
            });
            if (response.data.status === "success") {
                generatePDF(response.data.data, data?.date);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const generatePDF = (items, date) => {
        const doc = new jsPDF();
        const tableColumn = [
            "No",
            "Name",
            "Status",
            "Class",
            "Level",
            "Item Name",
        ];
        const tableRows = [];

        items.forEach((item, idx) => {
            const itemData = [
                idx + 1,
                item.name,
                item.status === 1 ? "Dikembalikan" : "Belum Dikembalikan",
                item.student_class,
                item.level,
                item.item_name,
            ];
            tableRows.push(itemData);
        });

        doc.text(`Date: ${moment(date).format("YYYY-MM-DD")}`, 14, 10);
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            margin: { top: 10, left: 10, right: 10, bottom: 10 },
            styles: { fontSize: 10 },
        });

        doc.save(`temporary_borrowed_${selectedDate}.pdf`);
    };
    useEffect(() => {
        const fetchDates = async () => {
            try {
                const response = await axios.get(
                    "/api/v1/temporary/available-dates",
                    {
                        headers: {
                            Authorization: `Bearer ${inventoryToken}`,
                        },
                    }
                );
                if (response.data.status === "success") {
                    setDates(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching dates:", error);
            }
        };

        fetchDates();
    }, [inventoryToken]);

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(fetchData)}
                    className="flex flex-col gap-5 rounded-md w-full"
                >
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => {
                            return (
                                <FormItem className="space-y-0">
                                    <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                        Tanggal
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className={`${
                                                    form.formState.errors
                                                        .date &&
                                                    "outline-red-500 focus:outline-red-400"
                                                }`}
                                            >
                                                <SelectValue
                                                    placeholder="Pilih Tanggal"
                                                    className=""
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent className="max-h-[140px] overflow-auto">
                                            {dates.map((item, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={`${item?.date}`}
                                                >
                                                    {item.date}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {form.formState.errors.date && (
                                        <div className=" pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                            <Info size={14} />
                                            <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                        </div>
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Button
                        type="submit"
                        className="bg-violet-500 w-full hover:bg-violet-400 text-white py-2 px-4 rounded font-semibold"
                    >
                        Export ke PDF
                    </Button>
                </form>
            </Form>
        </>
    );
}
