import React, { useState, useEffect } from "react";
import {
    Input,
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/index";
import { Link } from "@inertiajs/inertia-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inertia } from "@inertiajs/inertia";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { Info, Eye, EyeOff } from "lucide-react"; // Import icon Eye dan EyeOff
import { z } from "zod";

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Username is Empty",
    }),
    password: z.string().min(1, {
        message: "Password is Empty",
    }),
});

export default function Login() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [verifyLoading, setIsVerifyLoading] = useState(true);
    const [checkRole, setCheckRole] = useState(false);
    const inventoryToken = Cookies.get("inventory_token");

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const onSubmit = async (data) => {
        const { username, password } = data;
        const body = {
            username: username,
            password: password,
        };

        setIsLoading(true);
        try {
            const { data: postData } = await axios.post(
                "/api/v1/auth/login",
                body
            );

            setIsLoading(false);
            Cookies.set("inventory_token", postData.token, { expires: 7 });
            const { data: getUser } = await axios.get("/api/user", {
                headers: {
                    Authorization: `Bearer ${postData.token}`,
                },
            });

            const role = getUser.role;
            if (role === "student") {
                setIsLoading(false);
                Inertia.visit("/");
            } else if (role === "admin") {
                setIsLoading(false);
                Inertia.visit("/dashboard");
            }
        } catch (error) {
            setIsLoading(false);

            if (error.response.data.status === "unauthorized") {
                toast.error("Username atau Password salah", {
                    duration: 3000,
                });
            } else if (error.response.data.status === "forbidden") {
                toast.error("Kamu belum menjadi Aktif User", {
                    duration: 3000,
                });
            }
            console.log();
        }
    };

    const verifyUser = async () => {
        setIsVerifyLoading(true);

        try {
            const { data: getUser } = await axios("/api/v1/verify", {
                headers: {
                    Authorization: `Bearer ${inventoryToken}`,
                },
            });

            const role = getUser.data.role;
            setCheckRole(true);
            if (role === "admin") {
                Inertia.visit("/dashboard");
                setIsLoading(false);
            } else {
                setIsLoading(false);
                Inertia.visit("/");
            }
        } catch (error) {
            setCheckRole(true);
            console.log(error.response.data.status);
            if (
                error.response.data.status === "unauthenticated" ||
                error.response.data.status === "forbidden"
            ) {
                if (checkRole) {
                    Inertia.visit("/login");
                }
                return;
            }
        } finally {
            setIsVerifyLoading(false);
        }
    };

    useEffect(() => {
        if (inventoryToken === undefined || inventoryToken === "") {
            setIsVerifyLoading(false);
            return;
        } else if (checkRole === false) {
            verifyUser();
        }
    }, []);

    console.log(verifyLoading);
    return (
        <>
            {!verifyLoading && (
                <>
                    <Toaster richColors position="top-center" />
                    <div className="w-full sm:flex sm:justify-center sm:items-center sm:h-screen">
                        <div className="pt-[60px] pb-[50px] gap-[60px] sm:gap-[40px] flex justify-center flex-col items-center w-full max-w-[420px] mx-auto sm:py-[30px] sm:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] sm:rounded-md">
                            <div>
                                <h1 className="text-center leading-8 text-[27px] font-semibold">
                                    Inventory{" "}
                                </h1>
                                <h2 className="font-medium text-center leading-8 text-[18px]">
                                    Login
                                </h2>
                            </div>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="flex flex-col gap-8 rounded-md px-[30px] w-full"
                                >
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                                    Username
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Name. . ."
                                                        {...field}
                                                        className={`${
                                                            form.formState
                                                                .errors
                                                                .username &&
                                                            "outline-red-500 focus:outline-red-400"
                                                        }`}
                                                    />
                                                </FormControl>
                                                {form.formState.errors
                                                    .username && (
                                                    <div className=" pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                                        <Info size={14} />
                                                        <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                                    </div>
                                                )}
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <FormLabel className="text-[16px] text-neutral-800 leading-3 mb-[6px]">
                                                    Password
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="Password. . ."
                                                            {...field}
                                                            type={
                                                                isPasswordVisible
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            className={`${
                                                                form.formState
                                                                    .errors
                                                                    .password &&
                                                                "outline-red-500 focus:outline-red-400"
                                                            }`}
                                                        />
                                                        <div
                                                            onClick={
                                                                togglePasswordVisibility
                                                            }
                                                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer bg-white"
                                                        >
                                                            {isPasswordVisible ? (
                                                                <EyeOff
                                                                    size={18}
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={18}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                {form.formState.errors
                                                    .password && (
                                                    <div className="pt-[5px] text-red-500 leading-none flex items-center gap-1">
                                                        <Info size={14} />
                                                        <FormMessage className="text-[13px] mt-[3px] leading-none" />
                                                    </div>
                                                )}
                                            </FormItem>
                                        )}
                                    />

                                    <div className="w-full">
                                        <Button
                                            className={`${
                                                isLoading
                                                    ? "bg-[#cab7fa]"
                                                    : "bg-[#A27FFE] hover:bg-[#b295fb]"
                                            } w-full mt-[50px] sm:mt-[30px] font-semibold`}
                                            disabled={isLoading}
                                            type="submit"
                                        >
                                            <span className="text-lg">
                                                {isLoading
                                                    ? "Loading..."
                                                    : "Login"}
                                            </span>
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
