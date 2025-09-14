"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onAuthStateChanged, User } from "firebase/auth";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface Job {
  jobTitle: string;
  location: string;
  exp: string;
  jobType: string;
  ctc: string;
  shortDescription: string;
  positionDescription: string;
  companyDesciption: string;
  companyCulture: string;
  benefits: string;
  responsibilty: string;
  workType: string;
  tags: string[];
}

export default function PostJobPage() {
  const [newJob, setNewJob] = useState<Job>({
    jobTitle: "",
    location: "",
    exp: "",
    jobType: "",
    ctc: "",
    shortDescription: "",
    positionDescription: "",
    companyDesciption: "DezainaHub is your premier partner for innovative design and technology development. We bring ideas to life through thoughtful branding, intuitive UI/UX design, and seamless technology solutions. Whether it's crafting a brand identity that resonates or developing websites, apps, and SaaS products that perform, our work is all about creating meaningful connections. We believe in designs that tell stories and technology that makes life easier—helping businesses not just look good but work smarter.",
    companyCulture: "",
    benefits: "",
    responsibilty: "",
    workType: "",
    tags: [],
  });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setNewJob((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: keyof Job, value: string) => {
    setNewJob((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newJob,
          Benefits: newJob.benefits,
          responsibilty: newJob.responsibilty,
        }),
      });

      if (!response.ok) throw new Error("Failed to add job");

      const result = await response.json();
      if (result.success) {
        setNewJob({
          jobTitle: "",
          location: "",
          exp: "",
          jobType: "",
          ctc: "",
          shortDescription: "",
          positionDescription: "",
          companyDesciption: "DezainaHub is your premier partner for innovative design and technology development. We bring ideas to life through thoughtful branding, intuitive UI/UX design, and seamless technology solutions. Whether it's crafting a brand identity that resonates or developing websites, apps, and SaaS products that perform, our work is all about creating meaningful connections. We believe in designs that tell stories and technology that makes life easier—helping businesses not just look good but work smarter.",
          companyCulture: "",
          benefits: "",
          responsibilty: "",
          workType: "",
          tags: [],
        });
        toast.success("New Job Posted")
      } else {
        throw new Error(result.error || "Failed to add job");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto ">
      <Card className="border-none shadow-none ">
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="font-Manrope text-[26px] text-black leading-[32px] font-semibold pt-6">
              Job Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="jobTitle"
                  className="text-[#1E1E1E] text-sm  font-Nunito pb-2"
                >
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. UI/UX Designer"
                  value={newJob.jobTitle}
                  onChange={handleChange}
                  className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-[#1E1E1E] text-sm  font-Nunito pb-2"
                >
                  Job Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. New York, NY"
                  value={newJob.location}
                  onChange={handleChange}
                  className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#1E1E1E] text-sm  font-Nunito pb-2">
                  Experience Level
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("exp", value)}
                >
                  <SelectTrigger className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent className=" font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]">
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3+">3+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#1E1E1E] text-sm  font-Nunito pb-2">
                  Job Type
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("jobType", value)
                  }
                >
                  <SelectTrigger className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent className=" font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]">
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  className="text-[#1E1E1E] text-sm  font-Nunito pb-2"
                  htmlFor="ctc"
                >
                  CTC/Salary
                </Label>
                <Input
                  id="ctc"
                  placeholder="e.g. 0-1 lpa"
                  value={newJob.ctc}
                  onChange={handleChange}
                  className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  className="text-[#1E1E1E] text-sm  font-Nunito pb-2"
                  htmlFor="workType"
                >
                  Work type
                </Label>
                <Input
                  id="workType"
                  placeholder="e.g. 3 months internship"
                  value={newJob.workType}
                  onChange={handleChange}
                  className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc]"
                />
              </div>
            </div>
            <div className=" font-Manrope text-[26px] text-black leading-[32px] font-semibold pt-6">
              About Us
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex flex-col">
                  <Label
                  className="text-[#1E1E1E] text-sm  font-Nunito"
                  htmlFor="companyDesciption"
                >
                  Company Description
                </Label>
                <Label
                  className="text-red-500 text-xs  font-Nunito font-bold"
                  htmlFor="companyDesciption"
                >
                  (Don't Change this field unless you really want to change)
                </Label>
                </div>
                <Textarea
                  id="companyDesciption"
                  className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc] resize-none"
                  rows={6}
                  value={newJob.companyDesciption}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className=" font-Manrope text-[26px] text-black leading-[32px] font-semibold pt-6">
              Job Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
    <div className="flex flex-col">
      <Label
        className="text-[#1E1E1E] text-sm  font-Nunito"
        htmlFor="responsibilty"
      >
        Job Description
      </Label>
      <Label
        className="text-red-500 text-xs  font-Nunito font-bold"
        htmlFor="responsibilty"
      >
        ( use ' . ' to make sentence end and bullets point )
      </Label>
    </div>
    <Textarea
      id="responsibilty"
      className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc] resize-none"
      rows={6}
      value={newJob.responsibilty}
      onChange={handleChange}
    />
  </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <Label
                    className="text-[#1E1E1E] text-sm  font-Nunito"
                    htmlFor="benefits"
                  >
                    Benefits
                  </Label>
                  <Label
                    className="text-red-500 text-xs  font-Nunito font-bold"
                    htmlFor="benefits"
                  >
                    ( use ' . ' to make sentence end and bullets point )
                  </Label>
                </div>
                <Textarea
                  className="p-3 font-Nunito text-[16px] text-[#999] rounded-[8px] border border-[#ccc] resize-none"
                  id="benefits"
                  placeholder="e.g. Health insurance, flexible hours, remote work..."
                  rows={6}
                  value={newJob.benefits}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Post Job
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
