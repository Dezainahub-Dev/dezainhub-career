import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardProvider } from "@/lib/dashboard-provider";
import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ThemeProvider attribute="class" defaultTheme="light">
    <DashboardProvider>
      <Toaster />
      <div className="flex min-h-screen bg-[#F5F5F5]">
        <Sidebar />
        <div className="flex-1 ">
          <Navbar />
          <main className="p-6 ">{children}</main>
        </div>
      </div>
    </DashboardProvider>
    // </ThemeProvider>
  );
}
