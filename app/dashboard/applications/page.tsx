"use client";

import { useState, useEffect } from "react";
import { ArrowDownIcon, Users, UserPlus, Clock, Cross } from "lucide-react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Search,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { StatsCard } from "../_components/stats-card";
import { MdQuestionMark } from "react-icons/md";

interface Applicant {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  portfolio: string;
  resumeUrl: string;
  jobTitle: string;
  experience: string;
  submittedAt: string;
  status: string;
}

export default function JobApplicantsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const statusOptions = ["Selected", "On Hold", "Pending", "Rejected"];
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("latest"); // "latest" or "oldest"

  // Fetch applicants from API
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch("/api/applications");
        if (!response.ok) throw new Error("Failed to fetch applicants");
        const data: Applicant[] = await response.json();
        setApplicants(data);
        setFilteredApplicants(data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...applicants];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(query) ||
          applicant.email.toLowerCase().includes(query) ||
          applicant.jobTitle.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter((applicant) =>
        statusFilter.includes(applicant.status)
      );
    }

    // Apply sorting
    // result.sort((a, b) => {
    //   const dateA = new Date(a.appliedOn.split("/").reverse().join("/"));
    //   const dateB = new Date(b.appliedOn.split("/").reverse().join("/"));

    //   return sortOrder === "latest"
    //     ? dateB.getTime() - dateA.getTime()
    //     : dateA.getTime() - dateB.getTime();
    // });
    //     // Apply sorting
    // result = result.sort((a, b) => {
    //   const dateA = new Date(a.appliedOn.split("/").reverse().join("/"));
    //   const dateB = new Date(b.appliedOn.split("/").reverse().join("/"));

    //   return sortOrder === "latest"
    //     ? dateB - dateA // Latest first
    //     : dateA - dateB; // Oldest first
    // });

    setFilteredApplicants(result);
  }, [applicants, searchQuery, statusFilter, sortOrder]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete application");

      // Remove the applicant from state
      setApplicants(applicants.filter((applicant) => applicant._id !== id));
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selected":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "On Hold":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const updateStatus = (id: String, newStatus: string) => {
    setApplicants(
      applicants.map((applicant) =>
        applicant._id === id ? { ...applicant, status: newStatus } : applicant
      )
    );
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter([]);
    setSortOrder("latest");
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Jobs posted"
          value="20"
          icon={<ArrowDownIcon className="h-6 w-6 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Total Applicants"
          value={applicants.length.toString()}
          icon={<Users className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-100"
        />
        <StatsCard
          title="Rejected"
          value={applicants
            .filter((a) => a.status === "Rejected")
            .length.toString()}
          icon={<Cross className="h-6 w-6 text-red-600" />}
          iconBg="bg-green-100"
        />
        <StatsCard
          title="New this week"
          value="10"
          icon={<MdQuestionMark className="h-6 w-6 text-orange-400" />}
          iconBg="bg-green-100"
        />
        <StatsCard
          title="Pending"
          value={applicants
            .filter((a) => a.status === "Pending")
            .length.toString()}
          icon={<Clock className="h-6 w-6 text-green-600" />}
          iconBg="bg-green-100"
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search applicants..."
            className="pl-9 bg-white text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}

      <div className="rounded-md overflow-hidden p-2 sm:p-6 bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name & Position</TableHead>
                <TableHead className="hidden sm:table-cell">Contact</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Links</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplicants.map((applicant) => (
                  <TableRow key={applicant._id} className="text-black">
                    <TableCell>
                      <div>
                        <p className="font-medium">{applicant.name}</p>
                        <p className="text-sm text-gray-500">
                          {applicant.jobTitle}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <p className="text-sm">{applicant.phoneNumber}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <p className="text-sm">{applicant.email}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        {applicant.resumeUrl && (
                          <Link
                            href={applicant.resumeUrl}
                            className="text-sm text-blue-500 hover:underline block"
                          >
                            Resume
                          </Link>
                        )}
                        {applicant.portfolio && (
                          <Link
                            href={applicant.portfolio}
                            className="text-sm text-blue-500 hover:underline block"
                          >
                            Portfolio
                          </Link>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`font-normal whitespace-nowrap ${getStatusColor(
                          applicant.status
                        )}`}
                      >
                        {applicant.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                          {/* Mobile/Tablet Info Section */}
                          <div className="p-2 border-b sm:hidden">
                            <p className="text-sm text-gray-500">
                              Contact: {applicant.phoneNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              {applicant.email}
                            </p>
                            {(applicant.resumeUrl || applicant.portfolio) && (
                              <div className="mt-2 space-y-1">
                                {applicant.resumeUrl && (
                                  <Link
                                    href={applicant.resumeUrl}
                                    className="text-sm text-blue-500 hover:underline block"
                                  >
                                    View Resume
                                  </Link>
                                )}
                                {applicant.portfolio && (
                                  <Link
                                    href={applicant.portfolio}
                                    className="text-sm text-blue-500 hover:underline block"
                                  >
                                    View Portfolio
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                          <DropdownMenuRadioGroup
                            value={applicant.status}
                            onValueChange={(value) =>
                              updateStatus(applicant._id, value)
                            }
                          ></DropdownMenuRadioGroup>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this application?"
                                )
                              ) {
                                handleDelete(applicant._id);
                              }
                            }}
                          >
                            Delete Application
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
