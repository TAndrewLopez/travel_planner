"use client";

import Image from "next/image";
import { useState } from "react";

import { apiClient, handleError } from "@/lib";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { ADMIN_API_ROUTES } from "@/routes";

interface LoginPageProps { }

const LoginPage: React.FC<LoginPageProps> = ({ }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await apiClient.post(ADMIN_API_ROUTES.LOGIN, {
                email,
                password,
            });
            if (response.data.userInfo) {
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div
            className="h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/home/home-bg.png')",
            }}>
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-2xl"></div>
            <Card className="shadow-2xl bg-opacity-20 w-[480px]">
                <CardHeader className="flex flex-col gap-1 capitalize text-3xl items-center">
                    <div className="flex flex-col gap-1 capitalize text-3xl items-center">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={80}
                            height={80}
                            className="cursor-pointer"
                        />
                        <span className="text-xl uppercase font-medium text-white">
                            <span>Admin Login</span>
                        </span>
                    </div>
                </CardHeader>
                <CardBody className="flex flex-col items-center w-full justify-center">
                    <div className="flex flex-col gap-2 w-full">
                        <Input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </CardBody>
                <CardFooter className="flex flex-col gap-2 items-center justify-center">
                    <Button
                        type="submit"
                        color="danger"
                        variant="shadow"
                        className="w-full capitalize"
                        size="lg"
                        onClick={handleLogin}>
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
