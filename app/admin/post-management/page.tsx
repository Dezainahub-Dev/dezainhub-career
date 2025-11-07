"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebase";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/app/components/Loader";

interface Job {
  id: string;
  jobTitle: string;
  shortDesciption: string;
  ctc: string;
}

const PostManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [jobToEdit, setJobToEdit] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.push("/");
      return;
    }

    const allowedEmails = [
      "divyankithub@gmail.com",
      "varidhsrivastava19145@gmail.com",
    ];
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (!user || !allowedEmails.includes(user.email || "")) {
        router.push("/");
      } else {
        fetchJobs();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs");
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      } else {
        throw new Error(data.error || "Failed to fetch jobs");
      }
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setJobToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`/api/jobs/${jobToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete job");
      }

      const data = await response.json();
      setJobs(jobs.filter((job) => job.id !== jobToDelete));
      toast.success(data.message || "Job deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete job"
      );
    } finally {
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  const confirmEdit = (id: string) => {
    setJobToEdit(id);
    setShowEditModal(true);
  };

  const handleEdit = () => {
    if (jobToEdit) {
      router.push(`/admin/job/edit/${jobToEdit}`);
      setShowEditModal(false);
      setJobToEdit(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Job Management</h1>
      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">Title - {job.jobTitle}</h2>
              <p className="mt-2">Description - {job.shortDesciption}</p>
              <p className="mt-2">Salary - {job.ctc}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => confirmEdit(job.id)}
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(job.id)}
                  className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl mb-4 font-semibold text-black">
              Confirm Deletion
            </h2>
            <p className="mb-4 text-black">
              Are you sure you want to delete this job? This action cannot be
              undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setJobToDelete(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl mb-4 font-semibold text-black">
              Confirm Edit
            </h2>
            <p className="mb-4 text-black">
              Are you sure you want to edit this job? You will be redirected to
              the edit page.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setJobToEdit(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManagement;
