"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { MdContentPaste } from "react-icons/md";

interface Job {
  title: string;
}

const SubmitForm: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [jobTitles, setJobTitles] = useState<Job[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    figmaLink: "",
    googleDriveLink: "",
  });
  const [submissionExists, setSubmissionExists] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const response = await fetch("/api/jobs");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data.success && Array.isArray(data.jobs)) {
          const titles = data.jobs.map((job: any) => ({ title: job.jobTitle }));
          setJobTitles(titles);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching job titles:", error);
      }
    };

    fetchJobTitles();
  }, []);

  useEffect(() => {
    let unsubscribe: () => void;

    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setFormData((prev) => ({
            ...prev,
            name: currentUser.displayName || "",
            email: currentUser.email || "",
          }));
          checkExistingSubmission(currentUser.email);
        } else {
          router.push("/login");
        }
      });
    } else {
      toast.error("Firebase auth is not initialized");
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const checkExistingSubmission = async (email: string | null) => {
    if (!email) return;
    try {
      const response = await fetch(`/api/check-submission?email=${email}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissionExists(data.exists);
      }
    } catch (error) {
      console.error("Error checking submission:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || submissionExists || isButtonDisabled) return;

    setIsSubmitting(true);
    setIsButtonDisabled(true);

    try {
      await checkExistingSubmission(formData.email);
      if (submissionExists) {
        toast.error("You have already submitted an assignment.");
        return;
      }

      await toast.promise(submitAssignment(), {
        loading: "Submitting assignment...",
        success: <b>Assignment submitted successfully!</b>,
        error: <b>Failed to submit assignment. Please try again.</b>,
      });

      setSubmissionExists(true);
    } catch (error) {
      console.error("Error submitting assignment:", error);
    } finally {
      setIsSubmitting(false);
      setIsButtonDisabled(false);
    }
  };

  const submitAssignment = async () => {
    const response = await fetch("/api/assignment-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit assignment");
    }

    setFormData({
      name: user?.displayName || "",
      email: user?.email || "",
      phone: "",
      position: "",
      figmaLink: "",
      googleDriveLink: "",
    });

    return "Assignment submitted successfully";
  };

  const inputClass =
    "w-full bg-transparent text-white font-Nunito py-2 border-b border-hero_section_border focus:outline-none focus:border-primary_light_blue placeholder:text-text_dark_gray transition-colors duration-300";
  const labelClass =
    "block mb-2 font-Nunito text-sm text-text_gray group-focus-within:text-white transition-colors duration-300";

  const pasteButton = (field: "figmaLink" | "googleDriveLink") => (
    <button
      type="button"
      onClick={async () => {
        try {
          const text = await navigator.clipboard.readText();
          setFormData((prev) => ({ ...prev, [field]: text }));
        } catch (err) {
          console.error("Failed to read clipboard contents: ", err);
        }
      }}
      className="flex items-center gap-1.5 absolute right-0 top-1/2 -translate-y-1/2 border border-hero_section_border bg-button-card-gradient text-text_gray hover:text-white px-3 py-1 rounded-full text-xs font-Nunito transition-colors duration-300"
    >
      <MdContentPaste />
      Paste
    </button>
  );

  return (
    <section className="px-3">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="pt-[24px] pb-16 flex flex-col items-center">
        <Image
          src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png"
          alt="Dezainahub logo"
          width={315}
          height={40}
          className="mb-6 h-auto w-[300–px]"
        />
        {/* <div className="text-white font-Nunito px-4 py-1.5 border border-hero_section_border rounded-full bg-button-card-gradient text-sm">
          Career
        </div> */}
        <h1 className="pt-4 text-center font-Manrope font-semibold text-[36px] leading-[44px] md:text-[56px] md:leading-[68px]">
          Submit Assignment
        </h1>
        {/* <p className="pt-3 font-Nunito text-base md:text-[18px] text-text_gray text-center max-w-[560px]">
          Every submission brings you one step closer to success.
        </p> */}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 pb-16">
        {/* Promo panel */}
        <div className="lg:w-[420px] shrink-0 rounded-[24px] border border-hero_section_border bg-radial-gradient-custom p-8 md:p-10 flex flex-col justify-between gap-10 min-h-[300px]">
          <div>
            <h2 className="font-Manrope font-semibold text-[28px] leading-[38px] md:text-[40px] md:leading-[52px]">
              Your talent could be the next big thing{" "}
              <span className="text-primary_light_blue">we&rsquo;re waiting</span>{" "}
              for.
            </h2>
          </div>
          <p className="font-Manrope font-semibold text-text_gray">
            &mdash; Dezainahub!
          </p>
        </div>

        {/* Form panel */}
        <div className="flex-1 rounded-[24px] border border-hero_section_border bg-radial-gradient-custom p-8 md:p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="name" className={labelClass}>
                  Full Name <span className="text-primary_light_blue">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
              <div className="group">
                <label htmlFor="email" className={labelClass}>
                  Email <span className="text-primary_light_blue">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="phone" className={labelClass}>
                  Phone Number{" "}
                  <span className="text-primary_light_blue">*</span>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                  placeholder="Enter Phone Number"
                />
              </div>
              <div className="group">
                <label htmlFor="position" className={labelClass}>
                  Position <span className="text-primary_light_blue">*</span>
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`${inputClass} cursor-pointer`}
                  required
                >
                  <option value="" className="bg-[#02141a] text-white">
                    Select a position
                  </option>
                  {jobTitles.map((job, index) => (
                    <option
                      key={index}
                      value={job.title}
                      className="bg-[#02141a] text-white"
                    >
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="group">
              <label htmlFor="figmaLink" className={labelClass}>
                Drop Portfolio Link{" "}
                <span className="text-primary_light_blue">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="eg. behance, figma, dribbble"
                  id="figmaLink"
                  name="figmaLink"
                  value={formData.figmaLink}
                  onChange={handleInputChange}
                  className={`${inputClass} pr-24`}
                  required
                />
                {pasteButton("figmaLink")}
              </div>
            </div>

            <div className="group">
              <label htmlFor="googleDriveLink" className={labelClass}>
                Assignment Link{" "}
                <span className="text-primary_light_blue">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="Drop your Assignment Link"
                  id="googleDriveLink"
                  name="googleDriveLink"
                  value={formData.googleDriveLink}
                  onChange={handleInputChange}
                  className={`${inputClass} pr-24`}
                  required
                />
                {pasteButton("googleDriveLink")}
              </div>
            </div>

            <div className="pt-2">
              <Tooltip id="submit-tooltip" place="top" style={{ zIndex: 50 }} />
              <button
                type="submit"
                disabled={submissionExists || isButtonDisabled || isSubmitting}
                data-tooltip-id="submit-tooltip"
                data-tooltip-content={
                  submissionExists
                    ? "You have already submitted an assignment. Only one submission is allowed."
                    : isSubmitting
                    ? "Submitting..."
                    : "Submit your assignment"
                }
                className={`group/btn pl-5 pr-2 py-2 rounded-full h-12 font-Manrope font-semibold flex items-center justify-between gap-3 text-white transition-opacity duration-300 ${
                  submissionExists || isButtonDisabled || isSubmitting
                    ? "bg-text_dark_gray cursor-not-allowed opacity-70"
                    : "bg-primary-gradient hover:opacity-90"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
                <span className="p-2 bg-white rounded-full w-8 h-8 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M2.66602 8H13.3327M13.3327 8L9.33268 4M13.3327 8L9.33268 12"
                      stroke="url(#paint0_linear_submit)"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_submit"
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
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-hero_section_border py-6">
        <Tooltip id="support-email" place="top" style={{ zIndex: 50 }} />
        <div className="font-Nunito text-text_gray text-sm">
          © 2026 Dezainahub! |{" "}
          <span
            className="cursor-pointer hover:text-primary_light_blue transition-colors"
            data-tooltip-id="support-email"
            data-tooltip-content="divyankit@dezainahub.com"
          >
            Need Help?
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() =>
              window.open(
                "https://www.instagram.com/dezainahub_?igsh=MWY3NzgxYWd4b3Q2",
                "_blank"
              )
            }
            className="border border-hero_section_border bg-button-card-gradient rounded-full w-9 h-9 flex items-center justify-center text-white hover:text-primary_light_blue transition-colors"
          >
            <FaInstagram />
          </button>
          <button
            onClick={() => window.open("", "_blank")}
            className="border border-hero_section_border bg-button-card-gradient rounded-full w-9 h-9 flex items-center justify-center text-white hover:text-primary_light_blue transition-colors"
          >
            <FaLinkedinIn />
          </button>
          <button
            onClick={() =>
              window.open(
                "https://www.facebook.com/dezainahub?mibextid=ZbWKwL",
                "_blank"
              )
            }
            className="border border-hero_section_border bg-button-card-gradient rounded-full w-9 h-9 flex items-center justify-center text-white hover:text-primary_light_blue transition-colors"
          >
            <FaFacebookF />
          </button>
          <button
            onClick={() => window.open("", "_blank")}
            className="border border-hero_section_border bg-button-card-gradient rounded-full w-9 h-9 flex items-center justify-center text-white hover:text-primary_light_blue transition-colors"
          >
            <FaTwitter />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SubmitForm;
