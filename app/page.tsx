"use client";
import Image from "next/image";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TbEyeHeart } from "react-icons/tb";
import Loader from "./components/Loader";
import ProcessTimeline from "./components/scroll-section";
import ReasonToJoin from "./components/reason-to-join";
import Footer from "./components/footer";
import TeamMarquee from "./components/team-marquee";
import "./globals.css";

interface Job {
  date: string | number | Date;
  id: string;
  jobTitle: string;
  location: string;
  exp: string;
  jobType: string;
  ctc: string;
  shortDesciption: string;
  workType: string;
  Tags: string[];
  viewCount: number;
}

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const jobTypes = ["Full Time", "Part Time", "Contract", "Internship"];

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleJobTypeChange = (jobType: string) => {
    setSelectedJobTypes((prevTypes) =>
      prevTypes.includes(jobType)
        ? prevTypes.filter((type) => type !== jobType)
        : [...prevTypes, jobType]
    );
  };

  const incrementViewCount = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/views`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to increment view count");
      }
      setJobs(
        jobs.map((job) =>
          job.id === jobId ? { ...job, viewCount: job.viewCount + 1 } : job
        )
      );
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs?public=true");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        if (data.success) {
          setJobs(data.jobs);
        } else {
          throw new Error(data.error || "Failed to fetch jobs");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as "newest" | "oldest");
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    const dataA = new Date(a.date).getTime();
    const dataB = new Date(b.date).getTime();
    return sortOrder === "newest" ? dataB - dataA : dataA - dataB;
  });

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <section className="px-3">
        {/* hero section */}
        <div className="pt-[192px] pb-[64px] px-0 w-full">
          <div className="flex items-center justify-center flex-col">
            <div className="flex flex-col justify-center items-center  pt-8 sm:pt-12 md:pt-20 w-full">
              <div className="text-white font-Nunito font-normal px-3 sm:px-4 py-1.5 sm:py-2 border border-hero_section_border rounded-full bg-button-card-gradient text-sm sm:text-base">
                Career
              </div>
              <div className="w- sm:w-[60%] md:max-w-[1240px] pt-2 sm:pt-4 text-white text-center font-Manrope text-[32px] sm:text-4xl leading-[40px] md:text-5xl lg:text-[80px] md:leading-[100px] font-semibold">
                Join Us to Inspire and Be Inspired
              </div>
              <div className="w-[70%] pt-3 sm:pt-4 pb-[64px] md:pb-[96px] sm:pb-8 font-Nunito text-base text-[16px] md:text-[20px] leading-[24px]  md:leading-[32px] text-[#738287] font-normal text-center">
                Be part of a team that values creativity, collaboration, and
                impact.
              </div>
              <div className="w-full h-full">
                <Image
                  src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741605730/career3x_pq2j7h.png"
                  alt="Jobs Hero"
                  width={1240}
                  height={633}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
        {/* short desccription */}
        <div className="py-16 sm:py-16 md:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
            <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12">
              <div className="font-Manrope text-3xl sm:text-4xl md:text-5xl lg:text-[64px] max-w-[604px] font-semibold">
                We’re Committed To Quality
              </div>
              <div className="hidden sm:flex gap-4 sm:gap-6">
                <div className="rounded-full bg-button-card-gradient border border-hero_section_border p-2 sm:p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.4997 6.5H17.5097M15.9997 11.37C16.1231 12.2022 15.981 13.0522 15.5935 13.799C15.206 14.5458 14.5929 15.1514 13.8413 15.5297C13.0898 15.9079 12.2382 16.0396 11.4075 15.9059C10.5768 15.7723 9.80947 15.3801 9.21455 14.7852C8.61962 14.1902 8.22744 13.4229 8.09377 12.5922C7.96011 11.7616 8.09177 10.9099 8.47003 10.1584C8.84829 9.40685 9.45389 8.79374 10.2007 8.40624C10.9475 8.01874 11.7975 7.87659 12.6297 8C13.4786 8.12588 14.2646 8.52146 14.8714 9.12831C15.4782 9.73515 15.8738 10.5211 15.9997 11.37Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="rounded-full bg-button-card-gradient border border-hero_section_border p-2 sm:p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9.198 21.5H13.198V13.49H16.802L17.198 9.51H13.198V7.5C13.198 7.23478 13.3034 6.98043 13.4909 6.79289C13.6784 6.60536 13.9328 6.5 14.198 6.5H17.198V2.5H14.198C12.8719 2.5 11.6002 3.02678 10.6625 3.96447C9.72479 4.90215 9.198 6.17392 9.198 7.5V9.51H7.198L6.802 13.49H9.198V21.5Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className="rounded-full bg-button-card-gradient border border-hero_section_border p-2 sm:p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4.75 1.875C4.18641 1.875 3.64591 2.09888 3.2474 2.4974C2.84888 2.89591 2.625 3.43641 2.625 4C2.625 4.56359 2.84888 5.10409 3.2474 5.5026C3.64591 5.90112 4.18641 6.125 4.75 6.125C5.31359 6.125 5.85409 5.90112 6.2526 5.5026C6.65112 5.10409 6.875 4.56359 6.875 4C6.875 3.43641 6.65112 2.89591 6.2526 2.4974C5.85409 2.09888 5.31359 1.875 4.75 1.875ZM2.75 7.875C2.71685 7.875 2.68505 7.88817 2.66161 7.91161C2.63817 7.93505 2.625 7.96685 2.625 8V21C2.625 21.069 2.681 21.125 2.75 21.125H6.75C6.78315 21.125 6.81495 21.1118 6.83839 21.0884C6.86183 21.0649 6.875 21.0332 6.875 21V8C6.875 7.96685 6.86183 7.93505 6.83839 7.91161C6.81495 7.88817 6.78315 7.875 6.75 7.875H2.75ZM9.25 7.875C9.21685 7.875 9.18505 7.88817 9.16161 7.91161C9.13817 7.93505 9.125 7.96685 9.125 8V21C9.125 21.069 9.181 21.125 9.25 21.125H13.25C13.2832 21.125 13.3149 21.1118 13.3384 21.0884C13.3618 21.0649 13.375 21.0332 13.375 21V14C13.375 13.5027 13.5725 13.0258 13.9242 12.6742C14.2758 12.3225 14.7527 12.125 15.25 12.125C15.7473 12.125 16.2242 12.3225 16.5758 12.6742C16.9275 13.0258 17.125 13.5027 17.125 14V21C17.125 21.069 17.181 21.125 17.25 21.125H21.25C21.2832 21.125 21.3149 21.1118 21.3384 21.0884C21.3618 21.0649 21.375 21.0332 21.375 21V12.38C21.375 9.953 19.265 8.055 16.85 8.274C16.1029 8.34254 15.371 8.52744 14.681 8.822L13.375 9.382V8C13.375 7.96685 13.3618 7.93505 13.3384 7.91161C13.3149 7.88817 13.2832 7.875 13.25 7.875H9.25Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12">
              <div className="font-Nunito text-base sm:text-lg md:text-xl max-w-[604px]">
                Which is the foundation of everything we do. Our dedicated team
                of designers and developers ensures that every project reflects
                our commitment to excellence. We meticulously craft each
                element, from branding to UI/UX design, prioritizing both
                aesthetics and functionality. Our rigorous quality assurance
                processes guarantee that our websites, applications, and SaaS
                products not only dazzle but also perform seamlessly
              </div>
              <div className="flex flex-row justify-between sm:grid sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex flex-col">
                  <div className="font-Manrope text-lg sm:text-2xl lg:text-[32px] font-semibold whitespace-nowrap">
                    80+
                  </div>
                  <div className="font-Nunito text-xs sm:text-sm lg:text-base whitespace-nowrap">
                    Projects Completed
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="font-Manrope text-lg sm:text-2xl lg:text-[32px] font-semibold whitespace-nowrap">
                    15+
                  </div>
                  <div className="font-Nunito text-xs sm:text-sm lg:text-base whitespace-nowrap">
                    Industries served
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="font-Manrope text-lg sm:text-2xl lg:text-[32px] font-semibold whitespace-nowrap">
                    95%
                  </div>
                  <div className="font-Nunito text-xs sm:text-sm lg:text-base whitespace-nowrap">
                    Client satisfaction
                  </div>
                </div>
              </div>
              <div className="sm:hidden flex gap-4 sm:gap-6">
                <div className="rounded-full bg-button-card-gradient border border-hero_section_border p-2 sm:p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.4997 6.5H17.5097M15.9997 11.37C16.1231 12.2022 15.981 13.0522 15.5935 13.799C15.206 14.5458 14.5929 15.1514 13.8413 15.5297C13.0898 15.9079 12.2382 16.0396 11.4075 15.9059C10.5768 15.7723 9.80947 15.3801 9.21455 14.7852C8.61962 14.1902 8.22744 13.4229 8.09377 12.5922C7.96011 11.7616 8.09177 10.9099 8.47003 10.1584C8.84829 9.40685 9.45389 8.79374 10.2007 8.40624C10.9475 8.01874 11.7975 7.87659 12.6297 8C13.4786 8.12588 14.2646 8.52146 14.8714 9.12831C15.4782 9.73515 15.8738 10.5211 15.9997 11.37Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="rounded-full bg-button-card-gradient border border-hero_section_border p-2 sm:p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9.198 21.5H13.198V13.49H16.802L17.198 9.51H13.198V7.5C13.198 7.23478 13.3034 6.98043 13.4909 6.79289C13.6784 6.60536 13.9328 6.5 14.198 6.5H17.198V2.5H14.198C12.8719 2.5 11.6002 3.02678 10.6625 3.96447C9.72479 4.90215 9.198 6.17392 9.198 7.5V9.51H7.198L6.802 13.49H9.198V21.5Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className="rounded-full bg-button-card-gradient border border-hero_section_border p-2 sm:p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4.75 1.875C4.18641 1.875 3.64591 2.09888 3.2474 2.4974C2.84888 2.89591 2.625 3.43641 2.625 4C2.625 4.56359 2.84888 5.10409 3.2474 5.5026C3.64591 5.90112 4.18641 6.125 4.75 6.125C5.31359 6.125 5.85409 5.90112 6.2526 5.5026C6.65112 5.10409 6.875 4.56359 6.875 4C6.875 3.43641 6.65112 2.89591 6.2526 2.4974C5.85409 2.09888 5.31359 1.875 4.75 1.875ZM2.75 7.875C2.71685 7.875 2.68505 7.88817 2.66161 7.91161C2.63817 7.93505 2.625 7.96685 2.625 8V21C2.625 21.069 2.681 21.125 2.75 21.125H6.75C6.78315 21.125 6.81495 21.1118 6.83839 21.0884C6.86183 21.0649 6.875 21.0332 6.875 21V8C6.875 7.96685 6.86183 7.93505 6.83839 7.91161C6.81495 7.88817 6.78315 7.875 6.75 7.875H2.75ZM9.25 7.875C9.21685 7.875 9.18505 7.88817 9.16161 7.91161C9.13817 7.93505 9.125 7.96685 9.125 8V21C9.125 21.069 9.181 21.125 9.25 21.125H13.25C13.2832 21.125 13.3149 21.1118 13.3384 21.0884C13.3618 21.0649 13.375 21.0332 13.375 21V14C13.375 13.5027 13.5725 13.0258 13.9242 12.6742C14.2758 12.3225 14.7527 12.125 15.25 12.125C15.7473 12.125 16.2242 12.3225 16.5758 12.6742C16.9275 13.0258 17.125 13.5027 17.125 14V21C17.125 21.069 17.181 21.125 17.25 21.125H21.25C21.2832 21.125 21.3149 21.1118 21.3384 21.0884C21.3618 21.0649 21.375 21.0332 21.375 21V12.38C21.375 9.953 19.265 8.055 16.85 8.274C16.1029 8.34254 15.371 8.52744 14.681 8.822L13.375 9.382V8C13.375 7.96685 13.3618 7.93505 13.3384 7.91161C13.3149 7.88817 13.2832 7.875 13.25 7.875H9.25Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* job card */}
        <div className="flex flex-col py-16 md:py-24 gap-8">
          <div className="pb-12 md:pb-16">
            <div className="flex flex-wrap sm:justify-center sm:items-center text-[36px] sm:text-[64px] leading-[44px] md:leading-[80px] font-Manrope font-semibold">
              <span>We are currently </span>
              <span>
                <Image
                  src="/logo/whatlooking.gif"
                  alt="looking for"
                  width={200}
                  height={200}
                  className="w-[44px] h-[44px] sm:w-[80px] sm:h-[80px]"
                />
              </span>
              <span>for</span>
            </div>
          </div>
          {sortedJobs.map((job) => (
            <div
              key={job.id}
              className="border-hero_section_border bg-[radial-gradient(153.71%_117.75%_at_100%_0%,_#01222E_0%,_#021921_100%)] rounded-[24px] border-[1px] p-8 flex flex-col justify-center items-center w-full gap-6"
            >
              <div className="flex justify-between w-full">
                <div className="font-Manrope font-semibold leading-[32px] sm:leading-[40px] text-[24px] sm:text-[32px]">
                  {" "}
                  {job.jobTitle}{" "}
                </div>
                <div className="hidden sm:flex">
                  <button
                    onClick={() => {
                      incrementViewCount(job.id);
                      router.push(`/jobs/${job.id}`);
                    }}
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
              <div className="flex md:flex-row flex-col justify-between w-full gap-8">
                <div className="flex flex-col md:flex-row w-full  md:text-[20px] leading-[24px] md:leading-[32px]  text-[16px] gap-2">
                  <div className="flex flex-row gap-4 ">
                    <div className="border-r-[1px]  border-hero_section_border md:pr-6 max-w-[156px] flex-resize">
                      {job.jobType}
                    </div>
                    <div className="md:border-r-[1px] md:border-hero_section_border md:px-6 max-w-[156px] flex-resize">
                      {job.exp} years
                    </div>
                  </div>
                  <div className="flex  flex-row gap-4">
                    <div className="border-r-[1px] border-hero_section_border md:px-6 min-w-[156px] flex-resize">
                      {job.workType}
                    </div>
                    <div className="md:pl-6 min-w-[156px] flex-resize">
                      {job.ctc}{" "}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:gap-4">
                  <div className="sm:hidden flex">
                    <button
                      onClick={() => {
                        incrementViewCount(job.id);
                        router.push(`/jobs/${job.id}`);
                      }}
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
                  <div className="flex flex-wrapper flex-row gap-1 justify-center items-center pl-3 md:pl-0">
                    <TbEyeHeart />
                    <div className="">
                      {job.viewCount < 10 ? `0${job.viewCount}` : job.viewCount}
                    </div>
                    <div>visits</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* reason to join us  */}
        <div className="">
          <div className="text-center font- font-Manrope md:text-[64px] text-[36px] md:leading-[84px] leading-[44px] font-semibold">
            Reason to Join us
          </div>
          <ReasonToJoin />
        </div>

        {/* scroll section */}
        <div>
          <ProcessTimeline />
        </div>

        {/* team marquee */}
        <div className="my-24">
          <div className="text-center font- font-Manrope md:text-[64px] text-[36px] md:leading-[84px] leading-[44px] font-semibold py-12 md:py-16">
            Meet Our Team
          </div>
          <TeamMarquee />
        </div>
        <div className="my-24">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="text-[36px] md:text-[80px] leading-[44px] md:leading-[100px] font-semibold font-Manrope">
              Be one with us, thrive
            </div>
            <div className="max-w-[393px] max-h-[185px]  ">
              <Image
                src="/logo/among-us.gif"
                alt="Among Us characters walking together"
                width={393}
                height={150}
                className="rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default JobsPage;
