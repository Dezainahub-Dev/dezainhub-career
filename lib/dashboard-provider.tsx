"use client";

import type React from "react";

import { createContext, useContext, useState } from "react";
import {
  LayoutGrid,
  FileText,
  Users,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";

type MenuItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  active?: boolean;
};

type User = {
  name: string;
  role: string;
  avatar: string;
};

type DashboardContextType = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  menuItems: MenuItem[];
  user: User;
};

const defaultUser: User = {
  name: "Sourav Kumar",
  role: "Admin",
  avatar: "/placeholder.svg?height=40&width=40",
};

const defaultMenuItems: MenuItem[] = [
  {
    title: "Manage Jobs",
    path: "/dashboard",
    icon: LayoutGrid,
    active: true,
  },
  {
    title: "Job Posting form",
    path: "/dashboard/post",
    icon: FileText,
  },
  {
    title: "Applications",
    path: "/dashboard/applications",
    icon: Users,
  },
  {
    title: "Submissions",
    path: "/dashboard/submissions",
    icon: ClipboardList,
  },
];

const DashboardContext = createContext<DashboardContextType>({
  currentPage: "Manage Jobs",
  setCurrentPage: () => {},
  menuItems: defaultMenuItems,
  user: defaultUser,
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState("Manage Jobs");
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  const [user, setUser] = useState(defaultUser);

  return (
    <DashboardContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        menuItems,
        user,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
