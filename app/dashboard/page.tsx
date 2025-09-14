"use client";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import axios from "axios";
import { StatsCard } from "./_components/stats-card";
import { JobCard } from "./_components/job-card";
import { ArrowDownIcon, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onAuthStateChanged, User } from "firebase/auth";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import App from "next/app";

interface Job {
  id: string;
  jobTitle: string;
  location: string;
  exp: string;
  jobType: string;
  ctc: string;
  shortDesciption: string;
  positionDesciption: string;
  companyDesciption: string;
  companyCulture: string;
  Benefits: string;
  responsibilty: string;
  workType: string;
  Tags: string[];
  date: any;
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicationCount, setApplicationCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized");
      router.push("/");
      return;
    }

    const allowedEmails = [
      "varidhsrivastava19145@gmail.com",
      "divyankithub@gmail.com",
    ];
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (!user || !allowedEmails.includes(user.email || "")) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("/api/applications");
        setApplicationCount(response.data.length);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  });
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs");
        if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else if (response.data?.jobs && Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/jobs/${id}`);
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleEdit = (job: Job) => {
    setEditJob(job);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editJob) return;
    try {
      const response = await axios.put(`/api/jobs/${editJob.id}`, {
        jobTitle: editJob.jobTitle || "",
        location: editJob.location || "",
        exp: editJob.exp || "",
        jobType: editJob.jobType || "",
        ctc: editJob.ctc || "",
        shortDesciption: editJob.shortDesciption || "",
        positionDesciption: editJob.positionDesciption || "",
        companyDesciption: editJob.companyDesciption || "",
        companyCulture: editJob.companyCulture || "",
        Benefits: editJob.Benefits || "",
        responsibilty: editJob.responsibilty || "",
        workType: editJob.workType || "",
        Tags: editJob.Tags || [],
      });

      if (response.data.success) {
        setJobs(jobs.map((job) => (job.id === editJob.id ? editJob : job)));
        setModalOpen(false);
        console.log("Job updated successfully");
      }
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };
  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Jobs posted"
          value={jobs.length.toString()}
          icon={<ArrowDownIcon className="h-6 w-6 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Total Applicants"
          value={applicationCount.toString()}
          icon={<Users className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-100"
        />
        <StatsCard
          title="New Applicants this week"
          value="10"
          icon={<UserPlus className="h-6 w-6 text-green-600" />}
          iconBg="bg-green-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>No jobs found</p>
        )}
      </div>

      {editJob && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-[1072px] max-h-[90vh] overflow-y-auto">
            <div className=" w-full ">
              <div className="pb-8 font-Manrope text-[26px] text-black leading-[32px] font-semibold pt-6">
                Job Information
              </div>
              <div className="flex flex-row w-full gap-6 pb-6">
                <div className="w-full">
                  <Label className="text-[#1E1E1E] text-sm  font-Nunito pb-2">
                    Job Title
                  </Label>
                  <Input
                    value={editJob.jobTitle || ""}
                    onChange={(e) =>
                      setEditJob({ ...editJob, jobTitle: e.target.value })
                    }
                    className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]"
                  />
                </div>
                <div className="w-full">
                  <Label className="text-[#1E1E1E] text-sm  font-Nunito pb-2">
                    Location
                  </Label>
                  <Input
                    value={editJob.location || ""}
                    onChange={(e) =>
                      setEditJob({ ...editJob, location: e.target.value })
                    }
                    className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]"
                  />
                </div>
              </div>
              <div className="flex flex-row gap-6  pb-6">
                <div className="w-full">
                  <Label className="text-[#1E1E1E] text-sm  font-Nunito pb-2">
                    Job Type
                  </Label>
                  <Input
                    value={editJob.jobType}
                    onChange={(e) =>
                      setEditJob({ ...editJob, jobType: e.target.value })
                    }
                    className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]"
                  />
                </div>
                <div className="w-full">
                  <Label className="text-[#1E1E1E] text-sm  font-Nunito pb-2">
                    Experience
                  </Label>
                  <Input
                    value={editJob.exp}
                    onChange={(e) =>
                      setEditJob({ ...editJob, exp: e.target.value })
                    }
                    className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]"
                  />
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="w-1/2">
                  <Label className="text-black font-Nunito">CTC/Salary</Label>
                  <Input
                    value={editJob.ctc}
                    onChange={(e) =>
                      setEditJob({ ...editJob, ctc: e.target.value })
                    }
                    className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]"
                  />
                </div>
                <div className="w-1/2">
                  <Label className="text-black font-Nunito">Work Type</Label>
                  <Input
                    value={editJob.workType}
                    onChange={(e) =>
                      setEditJob({ ...editJob, workType: e.target.value })
                    }
                    className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]"
                  />
                </div>
              </div>
              <div className="pb-8 font-Manrope text-black text-[26px] leading-[32px] font-semibold pt-6">
                Job Details
              </div>
              <div className="flex flex-row gap-6  pb-6">
                <div className="w-full">
                  <div className="flex flex-col">
                    <Label className="text-[#1E1E1E] text-sm font-Nunito pb-2">
                    About Us
                  </Label>
                  <Label
                      className="text-red-500 text-xs  font-Nunito font-bold py-3"
                      htmlFor="responsibilty"
                    >
                      ( Default template don't change unless it's old )
                    </Label>
                  </div>
                  <Textarea
                    rows={6}
                    value={editJob.companyDesciption || ""}
                    onChange={(e) =>
                      setEditJob({
                        ...editJob,
                        companyDesciption: e.target.value,
                      })
                    }
                    className="text-black resize-none h-72"
                  />
                </div>
                <div className="w-full">
                  <div className="flex flex-col">
                    <Label className="text-[#1E1E1E] text-sm  font-Nunito pb-2">
                    Job Responsibilities
                  </Label>
                  <Label
                      className="text-red-500 text-xs  font-Nunito font-bold py-3"
                      htmlFor="responsibilty"
                    >
                      ( use ' . ' to make sentence end and bullets point )
                    </Label>
                  </div>
                  <Textarea
                    value={editJob.responsibilty || ""}
                    rows={6}
                    onChange={(e) =>
                      setEditJob({
                        ...editJob,
                        responsibilty: e.target.value,
                      })
                    }
                    className="text-black resize-none h-72"
                  />
                </div>
              </div>
              <div className="flex flex-row gap-6  pb-6">
                <div className="w-full">
                  <div className="flex flex-col">
                    <Label className="text-[#1E1E1E] text-sm font-Nunito pb-2">
                      Benefits
                    </Label>
                    <Label
                      className="text-red-500 text-xs  font-Nunito font-bold py-3"
                      htmlFor="responsibilty"
                    >
                      ( use ' . ' to make sentence end and bullets point )
                    </Label>
                  </div>
                  <Textarea
                    rows={6}
                    value={editJob.Benefits || ""}
                    onChange={(e) =>
                      setEditJob({
                        ...editJob,
                        Benefits: e.target.value,
                      })
                    }
                    className="text-black resize-none h-72"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setModalOpen(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
