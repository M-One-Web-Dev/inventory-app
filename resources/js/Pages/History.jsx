import React, { useState, useEffect } from "react";
import {
    Navigation,
    Tabs,
    Button,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { Header, HistoryCard } from "../components/section/index";
import { History as HistoryIcon } from "lucide-react";
import Layout from "./Layout";
import { usePage } from "@inertiajs/inertia-react";
import { useRendered } from "@/lib/context/renderedHome";

function History() {
    const { url } = usePage();
    const inventoryToken = Cookies.get("inventory_token");
    const [borrowedData, setBorrowedData] = useState({
        data: [],
        pagination: {
            total: 0,
            perPage: 0,
            currentPage: 0,
            lastPage: 0,
            totalPages: 0,
        },
    });
    const [returnedData, setReturnedData] = useState({
        data: [],
        pagination: {
            total: 0,
            perPage: 0,
            currentPage: 0,
            lastPage: 0,
            totalPages: 0,
        },
    });
    const [confirmationData, setConfirmationData] = useState({
        data: [],
        pagination: {
            total: 0,
            perPage: 0,
            currentPage: 0,
            lastPage: 0,
            totalPages: 0,
        },
    });
    const [borrowedPage, setBorrowedPage] = useState(1);
    const [returnedPage, setReturnedPage] = useState(1);
    const [confirmationPage, setConfirmationPage] = useState(1);
    const [isLoadingBorrowed, setIsLoadingBorrowed] = useState(false);
    const [isLoadingReturned, setIsLoadingReturned] = useState(false);
    const [isLoadingConfirmation, setIsLoadingConfirmation] = useState(false);

    const fetchHistoryData = async (status, page) => {
        try {
            const { data: getUser } = await axios.get(
                "/api/v1/history-borrowed",
                {
                    headers: {
                        Authorization: `Bearer ${inventoryToken}`,
                    },
                    params: {
                        status: status,
                        page: page,
                        per_page: 10,
                    },
                }
            );

            if (status === "borrowed") {
                setBorrowedData((prev) => ({
                    data: [...prev.data, ...getUser.data],
                    pagination: {
                        total: getUser.pagination.total,
                        perPage: getUser.pagination.perPage,
                        currentPage: getUser.pagination.currentPage,
                        lastPage: getUser.pagination.lastPage,
                        totalPages: getUser.pagination.totalPages,
                    },
                }));
                setIsLoadingBorrowed(false);
            } else if (status === "returned") {
                setReturnedData((prev) => ({
                    data: [...prev.data, ...getUser.data],
                    pagination: {
                        total: getUser.pagination.total,
                        perPage: getUser.pagination.perPage,
                        currentPage: getUser.pagination.currentPage,
                        lastPage: getUser.pagination.lastPage,
                        totalPages: getUser.pagination.totalPages,
                    },
                }));
                setIsLoadingReturned(false);
            } else if (status === "confirmation") {
                setConfirmationData((prev) => ({
                    data: [...prev.data, ...getUser.data],
                    pagination: {
                        total: getUser.pagination.total,
                        perPage: getUser.pagination.perPage,
                        currentPage: getUser.pagination.currentPage,
                        lastPage: getUser.pagination.lastPage,
                        totalPages: getUser.pagination.totalPages,
                    },
                }));
                setIsLoadingConfirmation(false);
            }
        } catch (error) {
            console.log(error);
            if (error.response.data.message === "Unauthenticated.") {
                Inertia.visit("/login");
                // setIsVerifyUser(false);
                return;
            }
        }
    };

    const loadMoreBorrowed = () => {
        setIsLoadingBorrowed(true);
        const nextPage = borrowedPage + 1;
        setBorrowedPage(nextPage);
        fetchHistoryData("borrowed", nextPage);
    };

    const loadMoreReturned = () => {
        setIsLoadingReturned(true);
        const nextPage = returnedPage + 1;
        setReturnedPage(nextPage);
        fetchHistoryData("returned", nextPage);
    };

    const loadMoreConfirmation = () => {
        setIsLoadingConfirmation(true);
        const nextPage = returnedPage + 1;
        setConfirmationPage(nextPage);
        fetchHistoryData("confirmation", nextPage);
    };

    useEffect(() => {
        // const previousUrl = sessionStorage.getItem("previousUrl");
        // sessionStorage.setItem("previousUrl", url);
        // const storedBorrowedHistory = sessionStorage.getItem("historyBorrowed");
        // const storedReturnedHistory = sessionStorage.getItem("historyReturned");
        // const storedConfirmationHistory = sessionStorage.getItem(
        //     "historyConfirmation"
        // );

        //    if (previousUrl !== "/history") {
        fetchHistoryData("borrowed", borrowedPage);
        fetchHistoryData("returned", returnedPage);
        fetchHistoryData("confirmation", confirmationPage);
        // } else {
        //     setBorrowedList(JSON.parse(storedBorrowedHistory));
        //     setReturnedList(JSON.parse(storedReturnedHistory));
        //     setReturnedList(JSON.parse(storedConfirmationHistory));
        // }
    }, [url]);

    return (
        <>
            <div className="h-auto w-full max-w-[420px] mx-auto pb-[0px]">
                <Header title={"History"} />
                <Tabs
                    defaultValue="borrowed"
                    className="w-[100%] flex flex-col items-center mt-[20px]"
                >
                    <TabsList>
                        <TabsTrigger value="borrowed">Dipinjam</TabsTrigger>
                        <TabsTrigger value="returned">Dikembalikan</TabsTrigger>
                        <TabsTrigger value="confirmation">
                            Konfirmasi
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent className="w-full" value="borrowed">
                        <div className="w-full flex flex-col gap-4 px-[20px] pb-[0] max-h-[60vh] overflow-auto">
                            {borrowedData.data.length === 0 ? (
                                <EmptyHistory />
                            ) : (
                                <>
                                    {borrowedData.data.map((item, index) => (
                                        <HistoryCard
                                            key={index}
                                            id={item.item_id}
                                            name={item.item_name}
                                            loan_date={item.borrowed_at}
                                            return_date={item.returned_at}
                                            status={item.status}
                                        />
                                    ))}
                                    {/* {isLoadingBorrowed && <p>Loading...</p>} */}
                                    {borrowedData.data.length >= 10 &&
                                        borrowedData.pagination.lastPage !==
                                            borrowedData.pagination
                                                .currentPage && (
                                            <Button
                                                onClick={loadMoreBorrowed}
                                                className={`text-white rounded w-max `}
                                            >
                                                Load More
                                            </Button>
                                        )}
                                </>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent className="w-full" value="returned">
                        <div className="w-full flex flex-col gap-4 px-[20px] pb-[0] max-h-[66vh] overflow-auto">
                            {returnedData.data.length === 0 ? (
                                <EmptyHistory />
                            ) : (
                                <>
                                    {returnedData.data.map((item, index) => (
                                        <HistoryCard
                                            key={index}
                                            id={item.item_id}
                                            name={item.item_name}
                                            loan_date={item.loan_date}
                                            return_date={item.return_date}
                                            status={item.status}
                                        />
                                    ))}
                                    {/* {isLoadingReturned && <p>Loading...</p>} */}
                                    {returnedData.data.length >= 10 &&
                                        returnedData.pagination.lastPage !==
                                            returnedData.pagination
                                                .currentPage && (
                                            <div className="w-full flex justify-center items-center">
                                                <Button
                                                    onClick={loadMoreReturned}
                                                    className={`text-white rounded w-max`}
                                                    disabled={isLoadingReturned}
                                                >
                                                    {isLoadingReturned
                                                        ? "Loading..."
                                                        : "Load More"}
                                                </Button>
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent className="w-full" value="confirmation">
                        <div className="w-full flex flex-col gap-4 px-[20px] pb-[0] max-h-[66vh] overflow-auto">
                            {confirmationData.data.length === 0 ? (
                                <EmptyHistory />
                            ) : (
                                <>
                                    {confirmationData.data.map(
                                        (item, index) => (
                                            <HistoryCard
                                                key={index}
                                                id={item.item_id}
                                                name={item.item_name}
                                                loan_date={item.loan_date}
                                                return_date={item.return_date}
                                                status={item.status}
                                            />
                                        )
                                    )}
                                    {/* {isLoadingReturned && <p>Loading...</p>} */}
                                    {confirmationData.data.length >= 10 &&
                                        confirmationData.pagination.lastPage !==
                                            confirmationData.pagination
                                                .currentPage && (
                                            <div className="w-full flex justify-center items-center">
                                                <Button
                                                    onClick={
                                                        loadMoreConfirmation
                                                    }
                                                    className={`text-white rounded w-max`}
                                                    disabled={isLoadingReturned}
                                                >
                                                    {isLoadingReturned
                                                        ? "Loading..."
                                                        : "Load More"}
                                                </Button>
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

function EmptyHistory() {
    return (
        <div className="h-[70vh] flex justify-center items-center w-full">
            <div className="flex flex-col items-center gap-2">
                <HistoryIcon className="h-[50px] w-[50px]" />
                <h1>History Kamu belum Ada</h1>
            </div>
        </div>
    );
}

History.layout = (page) => <Layout children={page} />;
export default History;
