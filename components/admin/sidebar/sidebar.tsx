"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

import {
    Menu,
    MenuItem,
    Sidebar as ReactProSidebar,
    sidebarClasses,
} from "react-pro-sidebar";
import { LuLogOut } from "react-icons/lu";
import { MENU_ITEMS } from "@/constants";

const inter = Inter({ subsets: ["latin"] });

interface SidebarProps { }

export const Sidebar: React.FC<SidebarProps> = ({ }) => {
    const pathname = usePathname()
    const [selectedItem, setSelectedItem] = useState(pathname);
    const router = useRouter();

    const handleItemClick = (link: string) => {
        setSelectedItem(link);
        router.push(link);
    };

    return (
        <aside className="min-h-[100vh] overflow-hidden">
            <ReactProSidebar
                className="h-full overflow-hidden"
                rootStyles={{
                    [`.${sidebarClasses.container}`]: {
                        backgroundColor: "#ffffff",
                        "&:hover": { backgroundColor: "#ffffff" },
                    },
                }}>
                <Menu
                    className="h-[100vh] max-h-[100vh] text-black overflow-hidden"
                    menuItemStyles={{
                        button: ({ level, active }) => ({
                            backgroundColor: active ? "#0e1428" : "#ffffff",
                            color: active ? "#ffffff" : "#000000",
                            "&:hover": {
                                backgroundColor: active ? "#0e1428" : "#0e1428",
                                color: active ? "#ffffff" : "#ffffff",
                            },
                        }),
                    }}>
                    <div className="flex items-center justify-center my-10 flex-col">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            height={150}
                            width={150}
                            className="cursor-pointer"
                            onClick={() => router.push("/admin/dashboard")}
                        />
                        <span className="text-3xl text-center uppercase font-medium italic">
                            <span className={inter.className}>Travel Planner</span>
                        </span>
                    </div>
                    {MENU_ITEMS.map((item, idx) => (
                        <React.Fragment key={idx}>
                            <MenuItem
                                active={selectedItem === item.link}
                                icon={item.icon}
                                onClick={() => handleItemClick(item.link)}>
                                {item.label}
                            </MenuItem>
                        </React.Fragment>
                    ))}
                    <MenuItem
                        active={selectedItem === "/admin/logout"}
                        icon={<LuLogOut />}
                        onClick={() => handleItemClick("/admin/logout")}>
                        Logout
                    </MenuItem>
                </Menu>
            </ReactProSidebar>
        </aside>
    );
};
