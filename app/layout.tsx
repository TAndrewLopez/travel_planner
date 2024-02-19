import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { UIProvider } from "@/providers/nextUIProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Powered by Bright Data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <UIProvider>{children}</UIProvider>
      </body>
    </html>
  );
}
