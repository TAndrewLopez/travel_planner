"use client";

import { NextUIProvider } from "@nextui-org/react";

interface UIProviderProps {
    children: React.ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
    return <NextUIProvider>{children}</NextUIProvider>;
};
