import type React from "react"
import "./globals.css"
import { Manrope, Nunito } from "next/font/google"
import ClientLayout from "./ClientLayout"
import { headers } from "next/headers"
// import MobileMaintenance from "../app/components/MobileMaintenance";

import { Toaster } from "@/components/ui/sonner"
import NavBar from "./components/NavBar"

export const metadata = {
  title: "Career Portal",
  description: "Find your dream job here!",
}

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
})

// function isMobile(userAgent: string) {
//   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//     userAgent,
//   );
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const userAgent = headersList.get("user-agent") || ""
  // const isMobileDevice = isMobile(userAgent);

  return (
    <html lang="en">
      <body className={`${manrope.variable} ${nunito.variable} antialiased`}>
        <Toaster />
        <div className="fixed top-0 left-0 right-0 z-50 ">
          <NavBar />
        </div>
        <div className="mx-auto max-w-[1440px] w-full">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  )
}
