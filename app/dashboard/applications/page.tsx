"use client";

import { useState, useEffect } from "react";
import { ArrowDownIcon, Users, Clock, Cross, ChevronDown, Search, Copy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  submittedAt?: string;
  status: string;
}

export default function JobApplicantsTable() {
  const statusOptions = ["Selected", "On Hold", "Pending", "Rejected"];
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Fetch applicants from API
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch("/api/applications");
        if (!response.ok) throw new Error("Failed to fetch applicants");
        const data: Applicant[] = await response.json();
        const normalizedApplicants = data.map((applicant: any) => ({
          ...applicant,
          _id:
            typeof applicant._id === "string"
              ? applicant._id
              : applicant._id?.$oid || String(applicant._id || ""),
          status: applicant.status || "Pending",
        }));
        setApplicants(normalizedApplicants);
        setFilteredApplicants(normalizedApplicants);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);

  useEffect(() => {
    const fetchJobsCount = async () => {
      try {
        const response = await fetch("/api/jobs");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        const jobs = Array.isArray(data) ? data : Array.isArray(data?.jobs) ? data.jobs : [];
        setTotalJobs(jobs.length);
      } catch (error) {
        console.error("Error fetching jobs count:", error);
        setTotalJobs(0);
      }
    };

    fetchJobsCount();
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

    // Apply sorting based on arrival time
    result = result.sort((a, b) => {
      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

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

  const formatArrivalDate = (submittedAt?: string) => {
    if (!submittedAt) return "N/A";
    const date = new Date(submittedAt);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatArrivalTime = (submittedAt?: string) => {
    if (!submittedAt) return "N/A";
    const date = new Date(submittedAt);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingStatusId(id);
      const response = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant._id === id ? { ...applicant, status: newStatus } : applicant
        )
      );
    } catch (error) {
      console.error("Error updating application status:", error);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
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

  const newThisWeekCount = applicants.filter((applicant) => {
    if (!applicant.submittedAt) return false;
    const submittedAt = new Date(applicant.submittedAt).getTime();
    if (Number.isNaN(submittedAt)) return false;
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return submittedAt >= sevenDaysAgo;
  }).length;

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Jobs posted"
          value={totalJobs.toString()}
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
          value={newThisWeekCount.toString()}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-black">
              Filter Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {statusOptions.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilter.includes(status)}
                onCheckedChange={() => toggleStatusFilter(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-black">
              Sort: {sortOrder === "latest" ? "Latest First" : "Oldest First"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOrder("latest")}>
              Latest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
              Oldest First
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="text-black" onClick={clearFilters}>
          Clear
        </Button>
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
                <TableHead className="hidden md:table-cell">Arrived On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
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
                        <p className="text-xs text-gray-500">
                          Exp: {applicant.experience || "N/A"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{applicant.phoneNumber}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          aria-label="Copy phone"
                          title="Copy phone"
                          onClick={() => copyToClipboard(applicant.phoneNumber)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{applicant.email}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          aria-label="Copy email"
                          title="Copy email"
                          onClick={() => copyToClipboard(applicant.email)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
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
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        <p>{formatArrivalDate(applicant.submittedAt)}</p>
                        <p className="text-xs text-gray-500">
                          {formatArrivalTime(applicant.submittedAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <select
                        value={applicant.status || "Pending"}
                        onChange={(e) =>
                          updateStatus(applicant._id, e.target.value)
                        }
                        disabled={updatingStatusId === applicant._id}
                        className={`text-xs rounded-md px-2 py-1 border bg-white ${getStatusColor(
                          applicant.status || "Pending"
                        )} ${updatingStatusId === applicant._id ? "opacity-50" : ""}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
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
                          {applicant.resumeUrl && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={applicant.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Open Resume
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {applicant.portfolio && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={applicant.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Open Portfolio
                              </Link>
                            </DropdownMenuItem>
                          )}
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
