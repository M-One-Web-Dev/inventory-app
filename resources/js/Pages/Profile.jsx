import React, { useState, useEffect } from "react";
import { Navigation } from "../components/ui/navigation";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { Header, LogoutButton } from "../components/section/index";
import { Mail, Phone, BookOpen, GraduationCap, MapPin } from "lucide-react";
import { Link } from "@inertiajs/inertia-react";
import QRCode from "react-qr-code";
import Layout from "./Layout";
import { usePage } from "@inertiajs/inertia-react";
import { useRendered } from "@/lib/context/renderedHome";

function Profile() {
    const { props, url } = usePage();
    const [isVerifyUser, setIsVerifyUser] = useState(true);
    const inventoryToken = Cookies.get("inventory_token");
    const [userInformation, setUserInformation] = useState({
        id: null,
        name: "",
        id_number: "",
        address: "",
        phone_number: "",
        email: "",
        status: "",
        class: "",
        generation: "",
        school_year: "",
    });
    const { isProfileRendered, renderProfile } = useRendered();

    const verifyUser = async () => {
        setIsVerifyUser(true);
        try {
            const { data: getUser } = await axios("/api/v1/profile", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
            });

            renderProfile();
            sessionStorage.setItem(
                "userInformation",
                JSON.stringify(getUser.data)
            );

            setUserInformation(getUser.data);
        } catch (error) {
            console.log(error);
            if (error.response.data.message === "Unauthenticated.") {
                Inertia.visit("/login");
                setIsVerifyUser(false);
                return;
            }
        }
    };

    let words =
        userInformation.name === null ? "" : userInformation.name.split(" ");
    let firstWordFirstChar = words[0] ? words[0].charAt(0) : "";
    let secondWordSecondChar = words[1] ? words[1].charAt(0) : "";
    secondWordSecondChar.toUpperCase();
    let UppercaseText =
        `${firstWordFirstChar}${secondWordSecondChar}`.toUpperCase();

    const handleUndefinedValue = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === "null" ||
            value === "undefined" ||
            value === ""
        ) {
            return "-";
        } else {
            return value;
        }
    };

    useEffect(() => {
        const previousUrl = sessionStorage.getItem("previousUrl");
        sessionStorage.setItem("previousUrl", url);
        const storedUserInformation = sessionStorage.getItem("userInformation");

        if (previousUrl !== "/profile") {
            verifyUser();
        } else {
            setUserInformation(JSON.parse(storedUserInformation));
        }
    }, [url]);

    return (
        <>
            {" "}
            <div className="h-auto w-full max-w-[420px] mx-auto pb-[0px]">
                <Header title={"Profile"} profilePage={true} />
                <div className="mt-[40px] pb-[100px] max-h-[70vh] overflow-auto">
                    <div className="flex flex-col items-center">
                        <div className="bg-[#4600FF] bg-opacity-[10%] flex justify-center items-center h-[70px] w-[70px] rounded-full p-0">
                            <h1 className="text-[30px] pt-[5px] text-center leading-none">
                                {UppercaseText}
                            </h1>
                        </div>
                        <h1 className="text-[20px] font-[500] mt-[8px]">
                            {userInformation.name}
                        </h1>
                    </div>

                    {userInformation.name && (
                        <div className="flex justify-center">
                            <div className=" p-[4px] bg-[#bba3fc]">
                                <QRCode
                                    title="GeeksForGeeks"
                                    value={userInformation.name}
                                    bgColor={"white"}
                                    fgColor={"#000000"}
                                    size={150}
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-[40px] flex flex-col gap-[21px] px-[30px]">
                        {userInformation.email && (
                            <div>
                                <h1 className="text-[14px] text-[#6F6F6F]">
                                    Email
                                </h1>
                                <div className="bg-[#F4F0FF] rounded-sm flex items-center justify-between py-[7px] px-[17px]">
                                    <p>
                                        {handleUndefinedValue(
                                            userInformation.email
                                        )}
                                    </p>

                                    <Mail size={19} />
                                </div>
                            </div>
                        )}
                        {userInformation.phone_number && (
                            <div>
                                <h1 className="text-[14px] text-[#6F6F6F]">
                                    Nomor Telepon
                                </h1>
                                <div className="bg-[#F4F0FF] rounded-sm flex items-center justify-between py-[7px] px-[17px]">
                                    <p>
                                        {handleUndefinedValue(
                                            userInformation.phone_number
                                        )}
                                    </p>

                                    <Phone size={19} />
                                </div>
                            </div>
                        )}
                        {userInformation.generation && (
                            <div>
                                <h1 className="text-[14px] text-[#6F6F6F]">
                                    Kelas
                                </h1>
                                <div className="bg-[#F4F0FF] rounded-sm flex items-center justify-between py-[7px] px-[17px]">
                                    <p>
                                        {userInformation.generation}{" "}
                                        {userInformation.class}
                                    </p>

                                    <BookOpen size={19} />
                                </div>
                            </div>
                        )}
                        {userInformation.school_year && (
                            <div>
                                <h1 className="text-[14px] text-[#6F6F6F]">
                                    Tahun Ajaran
                                </h1>
                                <div className="bg-[#F4F0FF] rounded-sm flex items-center justify-between py-[7px] px-[17px]">
                                    <p>
                                        {handleUndefinedValue(
                                            userInformation.school_year
                                        )}
                                    </p>

                                    <GraduationCap size={19} />
                                </div>
                            </div>
                        )}

                        {userInformation.address && (
                            <div>
                                <h1 className="text-[14px] text-[#6F6F6F]">
                                    Alamat
                                </h1>
                                <div className="bg-[#F4F0FF] rounded-sm flex items-start justify-between py-[7px] px-[17px]">
                                    <p>
                                        {handleUndefinedValue(
                                            userInformation.address
                                        )}
                                    </p>

                                    <MapPin size={19} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-[54px] w-full flex justify-center items-center gap-2">
                        <LogoutButton />
                        {userInformation.role === "admin" && (
                            <Link
                                className="py-[5px] px-[20px] bg-[#A589F0] max-w-max text-white rounded-[50px]"
                                href="/dashboard"
                            >
                                Ke Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Profile.layout = (page) => <Layout children={page} />;
export default Profile;
