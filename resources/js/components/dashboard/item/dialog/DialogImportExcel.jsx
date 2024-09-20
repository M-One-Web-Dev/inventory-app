import React, { useState, useEffect } from "react";
import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
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
} from "../../../ui";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { FiPlus } from "react-icons/fi";
import { useItemRefresher } from "@/lib/context/refresherItem";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import {
    Document,
    Page,
    View,
    Text,
    Image,
    StyleSheet,
    PDFViewer,
    PDFDownloadLink,
} from "@react-pdf/renderer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function DialogImportExcel() {
    const [openModal, setOpenModal] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

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
                            <ExportAllItemsPDF setIsOpenPopup={setOpenModal} />
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
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsImporting(false);
                toast.success("Berhasil Import Data Item", {
                    duration: 3000,
                });
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
                        className="transition-all duration-200 active:scale-[0.96] p-0 h-auto py-[7px] px-[15px] bg-violet-500 hover:bg-violet-400 "
                        type="submit"
                    >
                        Import
                    </Button>
                </div>
            </form>
        </>
    );
}

const styles = StyleSheet.create({
    page: {
        padding: 10,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    section: {
        width: "100px",
        padding: 10,
        borderWidth: 1,
        borderRadius: "3px",
        borderColor: "#000",
        textAlign: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
    },
    qrCode: {
        width: "100%",
        height: "auto",
        marginBottom: "10px",
    },
    titleContainer: {
        borderRadius: "2px",
        width: "100%",
        paddingTop: "2px",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        paddingBottom: "2px",
    },
    title: {
        fontSize: 8,
        color: "#000",
        fontWeight: "bold",
    },
    viewer: {
        width: "100%",
        height: "600px",
    },
});

function ExportAllItemsPDF({ setIsOpenPopup }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const inventoryToken = Cookies.get("inventory_token");
    const [selectedPage, setSelectedPage] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (selectedPage !== null) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await axios.get("/api/v1/items", {
                        headers: {
                            Authorization: `Bearer ${inventoryToken}`,
                        },
                        params: {
                            page: selectedPage,
                            perPage: 20,
                        },
                    });

                    if (response.data.status === "success") {
                        const itemsWithQRCode = await Promise.all(
                            response.data.data.map(async (item) => {
                                const qrCodeDataUrl =
                                    await generateQRCodeDataURL(
                                        item.id.toString()
                                    );
                                return {
                                    ...item,
                                    qrCodeDataUrl,
                                };
                            })
                        );
                        setItems(itemsWithQRCode);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [inventoryToken, selectedPage]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/v1/items", {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                    params: {
                        perPage: 20,
                    },
                });

                setTotalPages(response.data.pagination.totalPages);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // }
    }, []);

    const MyDocument = () => {
        const itemsPerPage = 20;
        const pages = [];

        for (let i = 0; i < items.length; i += itemsPerPage) {
            const pageItems = items.slice(i, i + itemsPerPage);

            pages.push(
                <Page key={i} size="A4" style={styles.page}>
                    {pageItems.map((item, index) => (
                        <View key={index} style={styles.section}>
                            <Image
                                src={item.qrCodeDataUrl}
                                style={styles.qrCode}
                            />
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>
                                    {item.id_number}
                                </Text>
                            </View>
                        </View>
                    ))}
                </Page>
            );
        }

        return <Document>{pages}</Document>;
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <div>
                <h3 className="text-[13px] mb-[2px]">Pilih Halaman</h3>
                <Select onValueChange={(value) => setSelectedPage(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Page" />
                    </SelectTrigger>
                    <SelectContent>
                        {pageNumbers.map((page) => (
                            <SelectItem key={page} value={page}>
                                {page}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button
                className="mt-[30px]"
                disabled={selectedPage === null || loading}
            >
                <PDFDownloadLink
                    document={<MyDocument />}
                    fileName="inventory_items.pdf"
                    onClick={() => setIsOpenPopup(false)}
                >
                    {({ blob, url, loading, error }) =>
                        loading && selectedPage !== null
                            ? "Loading Document..."
                            : "Download PDF"
                    }
                </PDFDownloadLink>
            </Button>
        </>
    );
}

export default ExportAllItemsPDF;

// Function to generate QR code data URL
async function generateQRCodeDataURL(value) {
    try {
        // Generate QR code data URL with no margin
        const dataUrl = await QRCode.toDataURL(value, {
            errorCorrectionLevel: "H",
            margin: 0, // Remove default margin
        });
        return dataUrl;
    } catch (error) {
        console.error("Error generating QR code:", error);
        return null;
    }
}
