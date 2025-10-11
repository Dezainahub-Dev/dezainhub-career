"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ArrowRight } from "lucide-react"
import Contactus from "./contactus"

export default function NavBar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  // Define main pages where navbar should be shown
  const mainPages = [
    "/",
    "/projects",
    "/product",
    "/career",
    
    "https://www.dezainahub.com/",
    "https://www.dezainahub.com/projects",
    "https://www.dezainahub.com/product",
    "https://career.dezainahub.com",
    
  ]

  // Check if current path is a main page
  const isMainPage = mainPages.some((page) => pathname === page || pathname.startsWith(page + "/"))

  const navItems = [
    { name: "Home", path: "https://www.dezainahub.com/" },
    { name: "Projects", path: "https://www.dezainahub.com/projects" },
    { name: "Product", path: "https://www.dezainahub.com/products" },
    { name: "Career", path: "https://career.dezainahub.com" },
    
  ]

  const handleScroll = useCallback(() => {
    const currentPosition = window.scrollY
    setScrollPosition(currentPosition)

    // Set isScrolled based on scroll position
    if (currentPosition > 50) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  }, [])

  useEffect(() => {
    if (isMainPage) {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [isMainPage, handleScroll])

  // If not a main page (like "Apply Now" page), don't render the navbar
  if (!isMainPage) {
    return null
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-40 pt-8 flex items-center justify-center flex-col text-white transition-all duration-500 ease-in-out ${
          isScrolled ? "pt-4" : "pt-8"
        }`}
      >
        <div
          className={`backdrop-blur-[25px] bg-[#01171f] flex w-full max-w-[1240px] px-8 py-4 border border-hero_section_border rounded-full items-center justify-between transition-all duration-500 ease-in-out ${
            isScrolled ? "max-w-[90%] md:max-w-[600px] px-4 py-2 relative" : "max-w-[1240px] px-8 py-4"
          }`}
        >
          <div
            className={`flex items-center transition-all duration-500 ease-in-out ${
              isScrolled ? "md:absolute md:left-4" : ""
            }`}
          >
            <Link href="https://www.dezainahub.com/" className="flex items-center px-3">
              <div className="flex items-center">
                <Image
                  src="/logo/DezainahubLogo.png"
                  alt="Dezainahub Logo"
                  width={40}
                  height={40}
                  className={`transition-all duration-500 ease-in-out transform ${
                    isScrolled ? "h-11 w-auto scale-110" : "h-10 w-auto "
                  }`}
                />
                <Image
                  src="/logo/LogoText.png"
                  alt="Dezainahub Text"
                  width={120}
                  height={32}
                  className={`ml-2 transition-all duration-500 ease-in-out ${
                    isScrolled ? "opacity-0 w-0 h-0 overflow-hidden" : "opacity-100 h-8 w-auto"
                  }`}
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 ml-auto">
            {/* Desktop Navigation - right aligned */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`font-Manrope font-normal cursor-pointer transition-all duration-300 ${
                    pathname === item.path || (item.name === "Career" && pathname.includes("career.dezainahub.com"))
                      ? "text-white font-semibold"
                      : "text-[#596569] hover:text-white hover:font-semibold"
                  } ${isScrolled ? "text-sm" : "text-base"}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <button
        onClick={() => setIsOpen(true)}
        className={`pl-4 pr-2 py-2 cursor-pointer rounded-full h-12  bg-gradient-to-r from-[#25C3EC] to-[#1765AA] text-white font-semibold flex items-center justify-between gap-1 transition-all duration-700 ease-in-out relative group overflow-hidden ${
          isScrolled ? "max-w-[160px] text-sm w-36" : "w-40"
        }`}
      >
        {/* White background that slides from left to right */}
        <div className="absolute inset-0 bg-white rounded-full transform -translate-x-full transition-transform duration-500 ease-in-out group-hover:translate-x-0 z-0"></div>

        {/* Arrow icon container - changes from white to gradient blue */}
        <div className="absolute right-1 top-1 bg-white group-hover:bg-gradient-to-r group-hover:from-[#25C3EC] group-hover:to-[#1765AA] rounded-full h-10 w-10 flex items-center justify-center z-10 transition-all duration-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500"
          >
            <path
              d="M2.66602 8H13.3327M13.3327 8L9.33268 4M13.3327 8L9.33268 12"
              stroke="url(#paint0_linear_1309_28693)"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:stroke-white transition-all duration-500"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1309_28693"
                x1="2.66602"
                y1="4"
                x2="10.346"
                y2="14.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#25C3EC" />
                <stop offset="1" stopColor="#1765AA" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Original text that slides up and disappears */}
        <span
          className={`transition-all duration-500 ease-in-out relative z-20 group-hover:-translate-y-8 group-hover:opacity-0 ${isScrolled ? "text-sm" : ""}`}
        >
          Contact Us
        </span>

        {/* New text that appears in the same position */}
        <span
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 transition-all duration-500 ease-in-out delay-200 z-20 text-blue-500 font-semibold group-hover:opacity-100 ${isScrolled ? "text-sm" : ""}`}
        >
          Contact Us
        </span>
      </button>
          </div>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden ml-4 w-10 h-10 flex items-center justify-center"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 backdrop-blur-[50px]">
            <div className="flex flex-col h-full px-6 py-12">
              {/* Header */}
              <div className="flex items-center justify-between pb-6">
                <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image
                    src="/logo/DezainahubLogo.png"
                    alt="Dezainahub Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                  />
                  <Image
                    src="/logo/LogoText.png"
                    alt="Dezainahub Text"
                    width={120}
                    height={32}
                    className="ml-2 h-8 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition-transform"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M24 8L8 24M8 8L24 24"
                      stroke="white"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex flex-col flex-1 gap-8 animate-slide-up">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-Manrope text-[28px] font-medium cursor-pointer transition-colors duration-200 ${
                      pathname === item.path || (item.name === "Career" && pathname.includes("career.dezainahub.com"))
                        ? "text-white font-semibold"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setIsOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="rounded-full bg-gradient-to-r from-[#1765AA] to-[#25C3EC] font-medium flex items-center justify-between px-3 py-3 w-fit"
                >
                  Connect with us
                  <span className="ml-2 bg-white rounded-full p-1 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-[#25C3EC]" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

     
      {isOpen && <Contactus openModel={isOpen} setOpenModel={setIsOpen} />}
    </>
  )
}
