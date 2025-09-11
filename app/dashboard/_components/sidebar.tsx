"use client";

import { useDashboard } from "@/lib/dashboard-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Add this import

export function Sidebar() {
  const { menuItems, setCurrentPage } = useDashboard();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const currentMenuItem = menuItems.find((item) => item.path === pathname);
    if (currentMenuItem) {
      setCurrentPage(currentMenuItem.title);
    }
  }, [pathname, menuItems, setCurrentPage]);

  return (
    <aside 
      className={cn(
        "min-h-screen bg-primary p-6 transition-all duration-300",
        isCollapsed ? "w-[75px]" : "w-[280px]"
      )}
    >
      <div className="relative">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-primary rounded-full p-1.5 border shadow-sm hover:bg-gray-50"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
        <div className={cn("p-6", isCollapsed && "flex justify-center")}>
          <Link href="/dashboard" className="flex items-center">
            <div>
              <Image
                src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png"
                alt="company logo"
                width={isCollapsed ? 40 : 215}
                height={40}
                className="transition-all duration-300"
              />
            </div>
          </Link>
        </div>
      </div>
      <nav className="mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600",
                    isActive && "bg-blue-50 text-blue-600 rounded-[8px]",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={item.title}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}