import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stacks Account History",
  description: "View your Stacks account history and transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col gap-8 w-full">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
