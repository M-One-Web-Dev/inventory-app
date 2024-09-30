import React, { useState, useCallback, useEffect, useRef } from "react";
import Layout from "../Layout";

// ui component
import { Button } from "../../../components/ui/index";

// icon
import QrCodeIcon from "../../../../../public/img/qr-code.svg";

// other library
import { Inertia } from "@inertiajs/inertia";
import QrScanner from "qr-scanner";
import Cookies from "js-cookie";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Select from "react-select";

const LoadingMessage = (props) => {
    return (
        <div
            {...props.innerProps}
            style={props.getStyles("loadingMessage", props)}
        >
            Loading...
        </div>
    );
};

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        width: "300px",
        borderColor: state.isFocused ? "black" : "gray",
        boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
        "&:hover": {
            borderColor: "black",
        },
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
    }),
};

function QrScan() {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const { setValue, watch } = useForm();
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);
    const inventoryToken = Cookies.get("inventory_token");

    const handleScan = useCallback(async (data) => {
        if (data) {
            qrScannerRef.current?.stop();
            setIsScannerOpen(false);

            try {
                const body = {
                    item_id: Number(data.data),
                    user_id: watch("name")?.value,
                };
                const { data: postData } = await axios.post(
                    "/api/v1/notification/borrow",
                    body,
                    {
                        headers: {
                            Authorization: `Bearer ${inventoryToken}`,
                        },
                    }
                );
                toast.success("Berhasil pinjam barang");
            } catch (error) {
                if (
                    error?.response?.data?.message?.includes(
                        "Item is not available for borrowing"
                    )
                ) {
                    toast.info("Barang sedang Dipinjam oleh Orang Lain");
                } else if (
                    error?.response?.data?.message?.includes(
                        "User has already borrowed this item"
                    )
                ) {
                    toast.info("Kamu sudah Meminjam Barang ini");
                } else if (
                    error?.response?.data?.message?.includes(
                        "The item id field is required."
                    )
                ) {
                    toast.info("Kode QR Tidak Sesuai");
                } else if (
                    error?.response?.data?.message?.includes(
                        "The selected user id is invalid."
                    )
                ) {
                    toast.warning("User Tidak Sesuai");
                } else if (
                    error?.response?.data?.message?.includes(
                        "The user id field is required."
                    )
                ) {
                    toast.error("Pilih User Terlebih Dahulu");
                } else {
                    toast.error("Gagal meminjam Barang");
                }
                console.log(error);
            }
        }
    }, []);

    const handleError = useCallback((err) => {
        console.error(err);
    }, []);

    const initializeScanner = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
        }

        if (videoRef.current) {
            qrScannerRef.current = new QrScanner(
                videoRef.current,
                (result) => handleScan(result),
                {
                    preferredCamera: "environment",
                    highlightScanRegion: false,
                    highlightCodeOutline: true,
                }
            );
            qrScannerRef.current.start().catch(handleError);
        }
    };

    const toggleScanner = () => {
        if (isScannerOpen) {
            qrScannerRef.current?.stop();
        } else {
            initializeScanner();
        }
        setIsScannerOpen(!isScannerOpen);
    };

    useEffect(() => {
        if (isScannerOpen) {
            initializeScanner();
        }
    }, [isScannerOpen]);

    const getAllStudent = async () => {
        try {
            const { data: getData } = await axios("/api/v1/list-user", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    page: 1,
                    perPage: 10,
                    search:
                        watch("search_name") === undefined
                            ? ""
                            : watch("search_name"),
                },
            });
            const newArr = getData.data.map((item) => {
                return {
                    label: item.username,
                    value: item.id,
                    role: item.role,
                };
            });
            setValue("list_user", newArr);
        } catch (error) {
            console.log(error);
            if (error.response.data.message === "Unauthenticated.") {
                Inertia.visit("/login");
                return;
            }
        } finally {
            setValue("loading_user", false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setValue("debounce_name", watch("search_name"));
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [watch("search_name")]);

    useEffect(() => {
        getAllStudent();
    }, [watch("debounce_name")]);

    return (
        <div className="relative w-full pb-[30px]">
            <div className="absolute top-[-40px] w-full px-[20px]">
                <div className="bg-white shadow-[3px_3px_20px_-2px_#00000024]  py-[20px] rounded-md px-[20px]">
                    <h1 className="text-[20px]">QrScan</h1>
                </div>
            </div>
            <div className="pt-[80px] w-full flex justify-center items-center">
                <Select
                    options={watch("list_user") || []}
                    styles={customStyles}
                    maxMenuHeight={200}
                    isClearable={true}
                    value={watch("name")}
                    onChange={(value) => {
                        setValue("name", value);
                    }}
                    onInputChange={(e) => setValue("search_name", e)}
                    isLoading={
                        watch("loading_user") === undefined ||
                        watch("loading_user") === false
                            ? false
                            : true
                    }
                    components={{ LoadingMessage }}
                />
                {/* <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "w-[80%] text-[15px] justify-between border-[1.5px]"
                            )}
                        >
                            {watch("student_info") !== undefined
                                ? watch("student_info").label
                                : "Pilih Siswa..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="relative">
                        <Command className="">
                            <CommandInput
                                placeholder="Cari Siswa..."
                                onInput={(e) => {
                                    setSearchTerm(e.target.value);
                                }}
                            />
                            <CommandList>
                                <CommandEmpty>
                                    Nama Peminjam tidak ditemukan.
                                </CommandEmpty>

                                <CommandGroup className="overflow-y-auto">
                                    {studentList.map((student) => (
                                        <CommandItem
                                            key={student.value}
                                            value={student.label}
                                            onSelect={() => {
                                                setValue(
                                                    "student_info",
                                                    student
                                                );
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    watch("student_info") ===
                                                        student
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {student.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover> */}
            </div>

            <div className="pt-[10px] px-[20px]">
                <div
                    className={`${
                        isScannerOpen
                            ? "justify-between px-[20px]"
                            : "px-[30px]"
                    } max-w-[700px] w-full h-[500px] mx-auto transition-all duration-150 flex flex-col items-center justify-center rounded-[10px] py-[20px] bg-[#F7F4FF]`}
                >
                    {isScannerOpen ? (
                        <>
                            <div className="w-full">
                                <video
                                    ref={videoRef}
                                    style={{
                                        height: "400px",
                                        width: "100%",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                    }}
                                />
                                <Button
                                    className="mt-[23px] w-full bg-[#bda5ff] hover:bg-[#a788fd]"
                                    onClick={toggleScanner}
                                >
                                    Cancel Scan
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="max-w-[340px] flex flex-col items-center">
                            <img
                                className="h-[220px] w-[220px]"
                                src={QrCodeIcon}
                                alt=""
                            />
                            <p className="text-[15px] mt-[9px] text-center text-[#414141]">
                                Untuk memindai Kode QR, Izinkan Aplikasi ini
                                untuk dapat mengakses Kamera anda.
                            </p>

                            <Button
                                className="w-full bg-[#bda5ff] hover:bg-[#a788fd] mt-[17px] font-semibold"
                                onClick={toggleScanner}
                            >
                                Scan
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

QrScan.layout = (page) => <Layout children={page} title="Welcome" />;

export default QrScan;
