import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "../components/ui/index";
import { Check, ChevronsUpDown } from "lucide-react";
import { CircleUserRound } from "lucide-react";
import QrReader from "react-qr-scanner";
import QrCodeIcon from "../../../public/img/qr-code.svg";
import CloseIcon from "../../../public/img/close-icon.svg";
import InformationIcon from "../../../public/img/information-icon.svg";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { Header } from "../components/section/index";
import QrScanner from "qr-scanner";
import { Link, usePage } from "@inertiajs/inertia-react";
import { useRendered } from "@/lib/context/renderedHome";
import Layout from "./Layout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Select from "react-select";

const dummyListStatus = [
    { label: "Peminjaman", value: "borrowed" },
    { label: "Pengembalian", value: "returned" },
];

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
        height: "5px",
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

const Home = () => {
    const { props, url } = usePage();
    const [result, setResult] = useState("");
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [facingMode, setFacingMode] = useState("environment");
    const videoRef = useRef(null);
    const { setValue, watch } = useForm();
    const qrScannerRef = useRef(null);
    const inventoryToken = Cookies.get("inventory_token");
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [scanStatus, setScanStatus] = useState(null);
    const userRef = useRef(userData);
    const { isHomeRendered, renderHome } = useRendered();
    const scanStatusRef = useRef(null);

    const getData = async () => {
        setIsLoading(true);
        try {
            const { data: getData } = await axios("/api/v1/verify", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
            });

            // setUserId(getUserId.id);
            // setUserRole(getUserId.role);
            setUserData(getData.data);
            setIsLoading(false);
            renderHome();
            // sessionStorage.setItem(
            //     "homeInformation",
            //     JSON.stringify({ id: getUserId.id, role: getUserId.role })
            // );
        } catch (error) {
            console.log(error);
            if (error.response.data.message === "Unauthenticated.") {
                Inertia.visit("/login");
                setTimeout(() => {}, 3000);
                return;
            }
        }
    };

    useEffect(() => {
        const previousUrl = sessionStorage.getItem("previousUrl");
        sessionStorage.setItem("previousUrl", url);
        const homeInformation = sessionStorage.getItem("homeInformation");

        // const parseObject = JSON.parse(homeInformation);
        // if (previousUrl !== "/") {
        //     getData();
        // }

        getData();
    }, [url]);

    const handleScan = useCallback(async (data) => {
        if (data) {
            setAlertOpen(true);
            qrScannerRef.current?.stop();
            setIsScannerOpen(false);
            setResult(data);
            if (scanStatusRef?.current?.value === "borrowed") {
                try {
                    const body = {
                        item_id: data.data,
                        user_id: userRef.current?.user_id,
                        borrowed_user_from: userRef.current?.user_from,
                        borrowed_level: userRef.current?.user_level,
                        type: "automation",
                    };
                    const { data: postData } = await axios.post(
                        "/api/v1/history-borrowed/add",
                        body,
                        {
                            headers: {
                                Authorization: `Bearer ${inventoryToken}`,
                            },
                        }
                    );
                    if (
                        postData.message.includes(
                            "You have already borrowed this item."
                        )
                    ) {
                        toast.info("Kamu masih meminjam barang ini");
                        return;
                    }
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
                    } else {
                        toast.error("Gagal meminjam Barang");
                    }
                    console.log(error);
                }
            } else {
                try {
                    const body = {
                        user_id: userRef.current?.user_id,
                        item_id: data.data,
                    };
                    const { data: postData } = await axios.post(
                        "/api/v1/history-borrowed/confirm-return",
                        body,
                        {
                            headers: {
                                Authorization: `Bearer ${inventoryToken}`,
                            },
                        }
                    );
                    if (
                        postData.message.includes(
                            "You have already borrowed this item."
                        )
                    ) {
                        toast.info("Kamu masih meminjam barang ini");
                        return;
                    }
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
                    } else {
                        toast.error("Gagal meminjam Barang");
                    }
                    console.log(error);
                }
            }
        }
    }, []);

    useEffect(() => {
        userRef.current = userData;
    }, [userData]);

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
        setResult("");
    };

    useEffect(() => {
        getPreferredCamera();
    }, []);

    useEffect(() => {
        if (isScannerOpen) {
            initializeScanner();
        }
    }, [isScannerOpen]);

    const getPreferredCamera = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
            );
            const hasBackCamera = videoDevices.some((device) =>
                device.label.toLowerCase().includes("back")
            );

            if (window.innerWidth > 768) {
                setFacingMode("environment");
            } else {
                setFacingMode("environment");
            }
        } catch (error) {
            console.error("Error getting preferred camera:", error);
        }
    };

    return (
        <>
            <div className="h-auto w-full max-w-[420px] mx-auto pb-[110px] relative">
                <Header title="Scan QR" />

                <div
                    className={`${
                        isScannerOpen
                            ? "w-[346px] h-[566px] justify-between px-[20px]"
                            : "w-[320px] h-[400px] px-[30px]"
                    } mt-[50px] mx-auto transition-all duration-150 flex flex-col items-center  rounded-[10px] py-[20px] bg-[#F7F4FF]`}
                >
                    <div className="w-full flex justify-end mb-[30px]">
                        <Select
                            options={dummyListStatus}
                            styles={customStyles}
                            maxMenuHeight={200}
                            value={scanStatus}
                            onChange={(value) => {
                                setScanStatus(value);
                                scanStatusRef.current = value;
                            }}
                        />
                    </div>
                    {isScannerOpen ? (
                        <>
                            <div className="w-full">
                                <video
                                    ref={videoRef}
                                    style={{
                                        height: "390px",
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
                        <>
                            <h2 className="font-bold text-[20px]">
                                Scan QR Code
                            </h2>
                            <img
                                className="h-[120px] w-[120px]"
                                src={QrCodeIcon}
                                alt=""
                            />
                            <p className="text-[15px] mt-[9px] text-center text-[#414141]">
                                Untuk memindai Kode QR, Izinkan Aplikasi ini
                                untuk dapat mengakses Kamera anda.
                            </p>

                            <Button
                                disabled={scanStatus === null}
                                className="w-full bg-[#bda5ff] hover:bg-[#a788fd] mt-[17px] font-semibold"
                                onClick={toggleScanner}
                            >
                                Scan
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

Home.layout = (page) => <Layout children={page} />;

export default Home;
