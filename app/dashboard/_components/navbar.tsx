"use client";

import { useDashboard } from "@/lib/dashboard-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Auth, getAuth, signOut } from "firebase/auth";
import { auth } from "@/app/firebase";

export function Navbar() {
  const authh = getAuth()
  const useer = authh.currentUser
  const { currentPage, user } = useDashboard();

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="mx-[20px] bg-white rounded-b-[16px]">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-Manrope">
            {currentPage}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {currentPage === "Manage Jobs"
              ? "Manage your currently posted jobs here"
              : `View and manage your ${currentPage.toLowerCase()}`}
          </p>
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10 bg-black text-black">
                  <AvatarImage src={useer?.photoURL ?? undefined} alt={useer?.displayName ?? undefined} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {useer?.displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Admin
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut(auth as Auth)}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
