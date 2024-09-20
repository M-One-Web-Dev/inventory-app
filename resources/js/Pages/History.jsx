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
    const [isVerifyUser, setIsVerifyUser] = useState(true);
    const inventoryToken = Cookies.get("inventory_token");
    const [lastPage, setLastPage] = useState(1);
    const [borrowedList, setBorrowedList] = useState([]);
    const [returnedList, setReturnedList] = useState([]);
    const [borrowedPage, setBorrowedPage] = useState(1);
    const [returnedPage, setReturnedPage] = useState(1);
    const [isLoadingBorrowed, setIsLoadingBorrowed] = useState(false);
    const [isLoadingReturned, setIsLoadingReturned] = useState(false);
    const { isHistoryRendered, renderHistory } = useRendered();

    const fetchHistoryData = async (status, page) => {
        try {
            const { data: getUser } = await axios.get("/api/v1/history", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
                params: {
                    status: status,
                    page: page,
                    per_page: 10,
                },
            });

            setLastPage(getUser?.pagination?.last_page);

            if (status === "borrowed") {
                setBorrowedList((prev) => [...prev, ...getUser.data]);
                setIsLoadingBorrowed(false);
                sessionStorage.setItem(
                    "historyBorrowed",
                    JSON.stringify(getUser.data)
                );
            } else if (status === "returned") {
                setReturnedList((prev) => [...prev, ...getUser.data]);
                setIsLoadingReturned(false);
                sessionStorage.setItem(
                    "historyReturned",
                    JSON.stringify(getUser.data)
                );
            }
        } catch (error) {
            console.log(error);
            if (error.response.data.message === "Unauthenticated.") {
                Inertia.visit("/login");
                setIsVerifyUser(false);
                return;
            }
        }
    };

    useEffect(() => {}, [url]);

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

    useEffect(() => {
        const previousUrl = sessionStorage.getItem("previousUrl");
        sessionStorage.setItem("previousUrl", url);
        const storedBorrowedHistory = sessionStorage.getItem("historyBorrowed");
        const storedReturnedHistory = sessionStorage.getItem("historyReturned");

        if (previousUrl !== "/history") {
            fetchHistoryData("borrowed", borrowedPage);
            fetchHistoryData("returned", returnedPage);
        } else {
            setBorrowedList(JSON.parse(storedBorrowedHistory));
            setReturnedList(JSON.parse(storedReturnedHistory));
        }
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
                    </TabsList>
                    <TabsContent className="w-full" value="borrowed">
                        <div className="w-full flex flex-col gap-4 px-[20px] pb-[0] max-h-[60vh] overflow-auto">
                            {borrowedList.length === 0 ? (
                                <EmptyHistory />
                            ) : (
                                <>
                                    {borrowedList.map((item, index) => (
                                        <HistoryCard
                                            key={index}
                                            id={item.item_id}
                                            name={item.item_name}
                                            loan_date={item.borrowed_at}
                                            return_date={item.returned_at}
                                            status={item.status}
                                        />
                                    ))}
                                    {isLoadingBorrowed && <p>Loading...</p>}
                                    <Button
                                        onClick={loadMoreBorrowed}
                                        className={`text-white rounded w-max ${
                                            borrowedPage === lastPage
                                                ? "hidden"
                                                : ""
                                        }`}
                                    >
                                        Load More
                                    </Button>
                                </>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent className="w-full" value="returned">
                        <div className="w-full flex flex-col gap-4 px-[20px] pb-[0] max-h-[66vh] overflow-auto">
                            {returnedList.length === 0 ? (
                                <EmptyHistory />
                            ) : (
                                <>
                                    {returnedList.map((item, index) => (
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
                                    <div className="w-full flex justify-center items-center">
                                        <Button
                                            onClick={loadMoreReturned}
                                            className={`text-white rounded w-max ${
                                                returnedPage === lastPage
                                                    ? "hidden"
                                                    : ""
                                            }`}
                                            disabled={isLoadingReturned}
                                        >
                                            {isLoadingReturned
                                                ? "Loading..."
                                                : "Load More"}
                                        </Button>
                                    </div>
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
