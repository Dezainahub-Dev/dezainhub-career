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
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/firebase";
import toast, { Toaster } from "react-hot-toast";

export type Status = "Selected" | "On Hold" | "Pending" | "Rejected";

export interface Applicant {
  id: number;
  name: string;
  appliedOn: string;
  position: string;
  phone: string;
  email: string;
  status: Status;
}

interface Assignment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  figmaLink?: string;
  googleDriveLink?: string;
  submittedAt: string;
}

export default function JobApplicantsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const statusOptions: Status[] = ["Selected", "On Hold", "Pending", "Rejected"];
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAssignments = async () => {
    try {
      console.log('Fetching assignments...');
      const response = await fetch('/api/assignments');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assignments: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched assignments:', data);
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  // Authentication and data fetching
  useEffect(() => {
    const allowedEmails = [
      'varidhsrivastava19145@gmail.com', 
      'divyankithub@gmail.com',
    ];
    
    if (!auth) {
      console.error('Firebase auth not initialized');
      router.push('/login');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser?.email);
      
      if (!currentUser) {
        router.push('/login');
      } else if (!allowedEmails.includes(currentUser.email || '')) {
        router.push('/');
      } else {
        setUser(currentUser);
        fetchAssignments();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const openConfirmDialog = (id: string) => {
    setAssignmentToDelete(id);
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setAssignmentToDelete(null);
  };

  const handleDelete = async () => {
    if (assignmentToDelete) {
      try {
        const response = await fetch(`/api/assignments/${assignmentToDelete}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete assignment');
        }
        toast.success('Assignment deleted successfully');
        setAssignments(assignments.filter(assignment => assignment._id !== assignmentToDelete));
      } catch (error) {
        console.error('Error deleting assignment:', error);
        toast.error('Failed to delete assignment');
      } finally {
        closeConfirmDialog();
      }
    }
  };

  const handleSelectAssignment = (id: string) => {
    setSelectedAssignments(prev => 
      prev.includes(id) ? prev.filter(assignmentId => assignmentId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedAssignments.length === 0) {
      toast.error("No assignments selected");
      return;
    }
    try {
      const response = await fetch("/api/assignments/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedAssignments }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete assignments");
      }

      toast.success("Selected assignments deleted successfully");
      setAssignments(
        assignments.filter(
          (assignment) => !selectedAssignments.includes(assignment._id)
        )
      );
      setSelectedAssignments([]);
    } catch (error) {
      console.error("Error deleting assignments:", error);
      toast.error("Failed to delete assignments");
    }
  };

  const getStatusColor = (status: Status) => {
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

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filter assignments based on search query
  const filteredAssignments = assignments.filter(assignment => 
    assignment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.phone.includes(searchQuery)
  );

  // Sort assignments by submission date (newest first)
  const sortedAssignments = [...filteredAssignments].sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  // Debug info
  const debugInfo = {
    userEmail: user?.email || 'Not logged in',
    loading,
    assignmentCount: assignments.length,
    filteredCount: filteredAssignments.length,
    searchQuery,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Toaster />
      
      {/* Stats Cards */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatsCard
          title="Total Assignments"
          value={assignments.length.toString()}
          icon={<ArrowDownIcon className="h-6 w-6 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="This Week"
          value={assignments.filter(a => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(a.submittedAt) > weekAgo;
          }).length.toString()}
          icon={<Users className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-100"
        />
        <StatsCard
          title="Design Positions"
          value={assignments.filter(a => a.position.toLowerCase().includes('design')).length.toString()}
          icon={<Cross className="h-6 w-6 text-red-600" />}
          iconBg="bg-green-100"
        />
        <StatsCard
          title="With Portfolio"
          value={assignments.filter(a => a.figmaLink).length.toString()}
          icon={<MdQuestionMark className="h-6 w-6 text-orange-400" />}
          iconBg="bg-green-100"
        />
        <StatsCard
          title="With Assignment"
          value={assignments.filter(a => a.googleDriveLink).length.toString()}
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
            placeholder="Search by name, email, position, or phone..."
            className="pl-9 bg-white text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {selectedAssignments.length > 0 && (
          <Button onClick={handleBulkDelete} variant="destructive" size="sm">
            Delete Selected ({selectedAssignments.length})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md overflow-hidden p-4 sm:p-6 bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedAssignments.length === sortedAssignments.length && sortedAssignments.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAssignments(sortedAssignments.map(a => a._id));
                      } else {
                        setSelectedAssignments([]);
                      }
                    }}
                    className="rounded"
                  />
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Applicant Info
                </TableHead>
                <TableHead className="font-medium text-gray-700 hidden sm:table-cell">
                  Position
                </TableHead>
                <TableHead className="font-medium text-gray-700 hidden md:table-cell">
                  Links
                </TableHead>
                <TableHead className="font-medium text-gray-700 hidden lg:table-cell">
                  Submitted
                </TableHead>
                <TableHead className="font-medium text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[#1E1E1E]">
              {sortedAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchQuery ? 'No assignments match your search.' : 'No assignments found.'}
                  </TableCell>
                </TableRow>
              ) : (
                sortedAssignments.map((assignment) => (
                  <TableRow key={assignment._id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedAssignments.includes(assignment._id)}
                        onChange={() => handleSelectAssignment(assignment._id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{assignment.name}</p>
                        <p className="text-sm text-gray-500">{assignment.email}</p>
                        <p className="text-sm text-gray-500">{assignment.phone}</p>
                        <p className="text-sm text-gray-500 sm:hidden">{assignment.position}</p>
                        <div className="flex gap-2 md:hidden">
                          {assignment.figmaLink && (
                            <a
                              href={assignment.figmaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Portfolio
                            </a>
                          )}
                          {assignment.googleDriveLink && (
                            <a
                              href={assignment.googleDriveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Assignment
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <p className="font-medium">{assignment.position}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex gap-2">
                        {assignment.figmaLink && (
                          <a
                            href={assignment.figmaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Portfolio
                          </a>
                        )}
                        {assignment.googleDriveLink && (
                          <a
                            href={assignment.googleDriveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Assignment
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <p className="text-sm text-gray-500">
                        {new Date(assignment.submittedAt).toLocaleDateString()}
                      </p>
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openConfirmDialog(assignment._id)}
                            className="text-red-600"
                          >
                            Delete
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

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this assignment?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeConfirmDialog}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}