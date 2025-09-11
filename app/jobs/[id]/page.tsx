"use client";

import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import ApplicationModal from "../../components/ApplicationModal";
import { auth } from "../../firebase";
import {
  Auth,
  User,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { Input } from "@/components/ui/input";
import { ArrowLeft, LogOut, Paperclip } from "lucide-react";
import Loader from "@/app/components/Loader";
import { toast } from "sonner";
import Image from "next/image";
import { useCallback } from "react";
import { Toast as toast2 } from "react-hot-toast";

const JobDescriptionPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    portfolio: "",
    experience: "",
    resumeUrl: "",
  });
  const [job, setJob] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("isEmailTaken state updated:", isEmailTaken);
  }, [isEmailTaken]);

  const checkExistingApplication = useCallback(async (email: string) => {
    try {
      const response = await fetch(
        `/api/check-applications?email=${encodeURIComponent(email)}`
      );
      if (!response.ok) throw new Error("Failed to check existing application");

      const data = await response.json();
      setIsEmailTaken(data.exists);
      if (data.exists)
        toast.error("You have already applied for this position.");
    } catch (error) {
      console.error("Error checking existing application:", error);
    }
  }, []);

  useEffect(() => {
    // @ts-ignore
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setFormData((prev) => ({
        ...prev,
        email: currentUser?.email || "",
        name: currentUser?.displayName || "",
      }));
      if (currentUser?.email) checkExistingApplication(currentUser.email);
    });
    return () => unsubscribe();
  }, [checkExistingApplication]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelection = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
  }, []);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = e.target.files?.[0];
      if (!uploadedFile) return;

      // Validate file size and type first
      if (uploadedFile.size > 5 * 1024 * 1024) {
        return toast.error("File size exceeds 5MB limit.");
      }
      if (uploadedFile.type !== "application/pdf") {
        return toast.error("Please upload a PDF file");
      }

      // Optionally simulate a delay before setting the file state
      setTimeout(() => {
        setFile(uploadedFile);
      }, 1500);

      try {
        const uploadData = new FormData();
        uploadData.append("file", uploadedFile);
        uploadData.append("upload_preset", "sourav0299");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: uploadData,
          }
        );

        if (!response.ok) throw new Error("Failed to upload resume");
        const data = await response.json();
        setFormData((prev) => ({ ...prev, resumeUrl: data.secure_url }));
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        toast.error("Failed to upload resume. Please try again.");
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const response = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to submit application");

        const jobId = window.location.pathname.split("/").pop();

        const evaluationResponse = await fetch("/api/candidate-evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          jobId
        }),
      });

      if (!evaluationResponse.ok) {
        console.error("Evaluation process failed");
      }

        toast.success("Application submitted successfully!", {
          duration: 2000,
        });

        setTimeout(async () => {
          try {
            await fetch("/api/send-confirmation-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                jobTitle: formData.jobTitle,
              }),
            });
          } catch (error) {
            console.error("Error sending confirmation email:", error);
            // Don't show error to user since main operation succeeded
          }
        }, 120000); // 2 minutes in milliseconds

        setTimeout(() => router.push("/"), 2000);
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          jobTitle: "",
          portfolio: "",
          experience: "",
          resumeUrl: "",
        });
      } catch (error) {
        console.error("Error submitting application:", error);
        toast.error("Failed to submit application. Please try again.", {
          duration: 2000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, router]
  );

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const id = window.location.pathname.split("/").pop();
        const response = await fetch(`/api/jobs?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch job details");

        const data = await response.json();
        if (data.success) {
          setJob(data.job);
          setFormData((prev) => ({
            ...prev,
            jobTitle: data.job.jobTitle || "",
          }));
        } else {
          throw new Error(data.error || "Failed to fetch job details");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, []);

  const toggleLogin = useCallback(() => {
    sessionStorage.setItem("previousPath", window.location.pathname);
    router.push("/login");
  }, [router]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#02141a]">
        {/* Navbar */}
        <header className="w-full fixed top-0 left-0 right-0 z-50 bg-[#02141a] px-5">
          <div className="flex items-center justify-between max-w-[1440px] mx-auto py-4 md:py-6">
            <div className="w-[150px] sm:w-[180px] md:w-[215px]">
              <Image
                src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png"
                alt="company logo"
                width={215}
                height={40}
                className="w-full h-auto"
              />
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden sm:block">
                    <Image
                      src={user.photoURL || "/default-avatar.png"}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                    />
                  </div>
                  <div className="flex flex-col pr-3">
                    <div className="text-[12px] sm:text-[14px] leading-[16px] sm:leading-[20px] text-[#738287]">
                      Welcome
                    </div>
                    <div className="text-[12px] sm:text-[14px] leading-[16px] sm:leading-[20px] text-white">
                      {user.displayName}
                    </div>
                  </div>
                  <div className="ml-0 sm:ml-2">
                    <button
                      className="flex flex-row justify-center items-center rounded-full border-2 p-[6px] sm:p-[8px] bg-[#FFE5E5] cursor-pointer"
                      onClick={() => signOut(auth as Auth)}
                    >
                      <LogOut className="text-red-400 w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={toggleLogin}
                  className="pl-3 sm:pl-4 pr-1 sm:pr-2 py-1.5 sm:py-2 cursor-pointer rounded-full h-9 sm:h-10 md:h-12 bg-primary-gradient text-white font-Manrope font-semibold flex items-center justify-between gap-2 text-sm sm:text-base"
                >
                  <span className="whitespace-nowrap">Login to apply</span>
                  <span className="p-1.5 sm:p-2 bg-white rounded-full w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 flex items-center justify-center">
                    {/* ... keep existing SVG ... */}
                  </span>
                </button>
              )}
            </div>
          </div>
        </header>
        <main className="pb-16 flex flex-col md:flex-row relative mt-[103px] overflow-hidden">
          {/* Left section: Back button and job title */}
          <div className="mb-8 md:fixed md:w-[50%] border-gray-300">
            <button
              className="flex items-center text-gray-400 mb-4"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <h1 className="mb-4 font-Manrope text-[32px] md:text-[52px] leading-[40px] md:leading-[64px] font-semibold">
              {job.jobTitle}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="border-r-[1px] border-hero_section_border pr-6 text-white text-Nunito text-[16px] md:text-[20px] font-normal leading-[24px] md:leading-[32px]">
                {job.jobType}
              </span>
              <span className="border-r-[1px] border-hero_section_border pr-6 text-white text-Nunito text-[16px] md:text-[20px] font-normal leading-[24px] md:leading-[32px]">
                {job.exp} years
              </span>
              <span className="border-r-[1px] border-hero_section_border pr-6 text-white text-Nunito text-[16px] md:text-[20px] font-normal leading-[24px] md:leading-[32px]">
                {job.workType}
              </span>
              <span className="border-r-[1px] border-hero_section_border pr-6 text-white text-Nunito text-[16px] md:text-[20px] font-normal leading-[24px] md:leading-[32px]">
                {job.ctc}
              </span>
            </div>
          </div>
          {/* Right section */}
          <div className="flex md:flex-row flex-col w-full">
            <div className="w-full sm:min-w-[50%]"></div>
            <div className="min-h-[100svh] w-full sm:min-w-[50%] relative p-l-[50%]">
              {/* About Us */}
              <div className="mb-12 flex flex-col gap-2">
                <h2 className="text-[28px] md:text-[40px] leading-[36px] md:leading-[52px] font-semibold font-Manrope text-white">
                  About Us
                </h2>
                <p className="text-white font-Nunito text-[16px] md:text-[20px] leading-[24px] md:leading-[32px] font-normal">
                  {job.companyDesciption}
                </p>
              </div>
              {/* Job Description */}
              <section className="mb-12 flex flex-col gap-4">
                <h2 className="text-[28px] md:text-[40px] leading-[36px] font-semibold font-Manrope text-white">
                  Job Description
                </h2>
                <div className="list-decimal text-white font-Nunito text-[20px] leading-[32px] font-normal">
                  <ol className="list-decimal pl-5">
                    {(job.responsibilty || "")
                      .split(".")
                      .filter((item: string) => item.trim())
                      .map((item: string, index: number) => (
                        <li
                          key={index}
                          className="md:mb-2 text-[16px] md:text-[20px] leading-[24px] md:leading-[32px] font-normal font-Nunito"
                        >
                          {item.trim()}
                        </li>
                      ))}
                  </ol>
                </div>
              </section>
              {/* Benefits */}
              <section className="mb-8 flex flex-col gap-4">
                <h2 className="text-[28px] md:text-[40px] leading-[36px] font-semibold font-Manrope text-white">
                  Benefits
                </h2>
                <ol className="list-decimal pl-5">
                  {(job.Benefits || "").split(".")
                    .filter((benefit: string) => benefit.trim())
                    .map((benefit: string, index: number) => (
                      <li
                        key={index}
                        className="md:mb-2 text-[16px] md:text-[20px] leading-[24px] md:leading-[32px] font-normal font-Nunito"
                      >
                        {benefit.trim()}
                      </li>
                    ))}
                </ol>
              </section>
              {/* Form */}
              {user ? (
                isEmailTaken ? (
                  <div className="text-red-500 font-Manrope font-semibold">
                    You have already applied for this position.
                  </div>
                ) : (
                  <section>
                    <form onSubmit={handleSubmit}>
                      <div className="flex flex-col w-full gap-8">
                        <div className="text-[26px] font-Manrope font-semibold">
                          Personal details
                        </div>
                        <div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Full name"
                            className="w-full pb-3 bg-transparent border-b border-hero_section_border text-text_gray font-Nunito focus:outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="w-full pb-3 bg-transparent border-b border-hero_section_border text-text_gray font-Nunito focus:outline-none"
                          />
                        </div>
                        <div className="flex border-b border-hero_section_border">
                          <span className="text-text_gray font-Nunito mr-2 flex gap-2">
                            <div className="">🇮🇳</div>+91
                          </span>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={`${formData.phoneNumber}`}
                            onChange={handleInputChange}
                            placeholder="Phone number"
                            className="w-full pb-3 bg-transparent  text-text_gray font-Nunito focus:outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            disabled
                            placeholder="Job Title" 
                            className="w-full cursor-not-allowed pb-3 bg-transparent border-b border-hero_section_border text-text_gray font-Nunito focus:outline-none"
                          />
                        </div>
                        <div className="text-[26px] font-Manrope font-semibold">
                          Profile Information
                        </div>
                        <div>
                          <input
                            type="url"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleInputChange}
                            placeholder="Portfolio Link"
                            className="w-full pb-3 bg-transparent border-b border-hero_section_border text-text_gray font-Nunito focus:outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            placeholder="Experience"
                            className="w-full pb-3 bg-transparent border-b border-hero_section_border text-text_gray font-Nunito focus:outline-none"
                          />
                        </div>
                        <div className="text-[26px] font-Manrope font-semibold">
                          Resume or CV
                        </div>
                        <div className="font-Nunito">
                          Kindly Attach your resume below. (File size up to
                          5MB.)
                        </div>
                        <div className="font-Nunito flex gap-2 max-w-[200px] items-center justify-between px-4 py-2 border border-white rounded-full cursor-pointer relative">
                          <input
                            type="file"
                            name="resumeUrl"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="resumeUpload"
                          />
                          <label
                            htmlFor="resumeUpload"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M21.1527 10.899L12.1371 19.9146C10.0869 21.9648 6.76275 21.9648 4.71249 19.9146C2.66224 17.8643 2.66224 14.5402 4.71249 12.49L13.7281 3.47435C15.0949 2.10751 17.311 2.10751 18.6779 3.47434C20.0447 4.84118 20.0447 7.05726 18.6779 8.42409L10.0158 17.0862C9.33238 17.7696 8.22434 17.7696 7.54092 17.0862C6.8575 16.4027 6.8575 15.2947 7.54092 14.6113L15.1423 7.00988"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span className="text-white truncate max-w-[150px]">
                              {isLoading
                                ? "Uploading..."
                                : file
                                ? file.name
                                : "Add attachment"}
                            </span>
                          </label>
                          {file && (
                            <button
                              onClick={handleRemoveFile}
                              className="flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 p-1 rounded-full hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                              title="Remove file"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <button
                          onClick={handleSubmit}
                          disabled={isLoading}
                          className="max-w-[208px] text-sm pl-4 pr-2 py-2 mt-16 cursor-pointer rounded-full h-12 bg-primary-gradient text-white font-Manrope font-semibold flex items-center justify-between gap-2"
                        >
                          {isLoading ? "Submitting..." : "Submit Application"}
                          <span className="p-2 bg-white rounded-full w-8 h-8">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M2.66602 8H13.3327M13.3327 8L9.33268 4M13.3327 8L9.33268 12"
                                stroke="url(#paint0_linear_1309_28693)"
                                strokeWidth="1.33333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
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
                          </span>
                        </button>
                      </div>
                    </form>
                  </section>
                )
              ) : (
                <div className="flex flex-col gap-2">
                  <p>You need to be logged in to apply.</p>
                  <div>
                    <button
                      onClick={toggleLogin}
                      className="pl-3 sm:pl-4 pr-1 sm:pr-2 py-1.5 sm:py-2 cursor-pointer rounded-full h-10 sm:h-12 bg-primary-gradient text-white font-Manrope font-semibold flex items-center justify-between gap-2 text-sm sm:text-base"
                    >
                      Apply Now
                      <span className="p-1.5 sm:p-2 bg-white rounded-full w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M2.66602 8H13.3327M13.3327 8L9.33268 4M13.3327 8L9.33268 12"
                            stroke="url(#paint0_linear_1309_28693)"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
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
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default JobDescriptionPage;
