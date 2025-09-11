"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "../globals.css";
import React from "react";
import toast from "react-hot-toast";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  companyType: string;
  serviceRequired: string;
  projectBuget: string;
  message: string;
  brdUrl: string;
}

const CompanyLogo = () => (
  <svg
    width="216"
    height="40"
    viewBox="0 0 216 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.1931 12.735C9.13092 12.781 8.21876 13.0965 7.4092 13.7009C6.444 14.4197 5.86265 15.3968 5.61489 16.5574C5.50392 17.0857 5.53254 17.6482 5.53254 18.1961C5.52742 22.6812 5.52928 27.1667 5.53812 31.6523C5.53812 31.9371 5.4774 32.0571 5.16823 32.0299C4.49824 31.972 3.80174 32.0376 3.16037 31.877C2.04372 31.5979 1.27603 30.8393 0.829372 29.7673C0.495077 28.9696 0.575335 28.1335 0.573939 27.3072C0.56696 22.7271 0.56696 18.1463 0.573939 13.5648C0.573939 12.7803 0.547419 11.9945 0.578824 11.2114C0.64024 9.6635 1.70524 8.2635 3.23085 7.94037C4.05368 7.7666 4.92606 7.79591 5.7768 7.78963C8.14269 7.77241 10.5088 7.77404 12.8752 7.79451C13.5319 7.80149 14.1886 7.91036 14.8433 7.98992C15.0338 8.01296 15.1643 8.09252 15.1615 8.35981C15.1447 10.1416 15.1873 11.9233 15.1461 13.7044C15.0924 16.0535 13.6268 17.9029 11.2923 18.5129C11.0418 18.5785 10.771 18.5666 10.5107 18.6001C10.2504 18.6336 10.1889 18.5115 10.1903 18.2693C10.1994 16.5518 10.1959 14.8343 10.1966 13.1167L10.1931 12.735Z"
      fill="url(#paint0_linear_1451_7102)"
    />
    <path
      d="M15.149 27.0838C16.2168 27.0677 17.145 26.7614 17.9406 26.1577C19.2666 25.1562 19.8878 23.8009 19.8808 22.1322C19.8654 18.2518 19.8745 14.3715 19.8738 10.4912C19.8738 10.4277 19.8815 10.3648 19.8912 10.2162C20.1006 10.3725 20.2863 10.4912 20.4496 10.6307C21.4227 11.4481 22.2626 12.412 22.939 13.488C23.7241 14.7442 24.3264 16.0807 24.5623 17.549C24.7019 18.4249 24.8254 19.3189 24.8115 20.2011C24.7917 21.6331 24.498 23.0481 23.9461 24.3697C23.4721 25.5316 22.8284 26.6168 22.0359 27.5898C21.1631 28.6426 20.1211 29.5426 18.9526 30.253C17.8046 30.9556 16.5481 31.4631 15.2341 31.7549C14.6924 31.8705 14.1414 31.9382 13.5878 31.9572C12.5849 32.004 11.5792 31.9991 10.5749 32.0312C10.3202 32.0396 10.2483 31.9552 10.2497 31.7046C10.2581 29.7009 10.233 27.6966 10.2644 25.6936C10.2783 24.8275 10.6461 24.0465 11.15 23.3563C11.843 22.4058 12.7552 21.7427 13.9179 21.4643C14.2403 21.3868 14.569 21.3366 14.895 21.2821C15.1302 21.243 15.1476 21.3973 15.1469 21.5752C15.1434 22.5398 15.1469 23.505 15.1469 24.4695L15.149 27.0838Z"
      fill="url(#paint1_linear_1451_7102)"
    />
    <path
      d="M45.6751 16.4489C44.968 14.9674 43.9242 14.1592 42.4763 14.1592C40.0519 14.1592 38.301 16.4489 38.301 20.9946C38.301 24.8668 39.5805 27.5942 42.0049 27.5942C44.1262 27.5942 45.5404 25.5403 45.6751 21.6007V16.4489ZM40.9274 12.1726C42.813 12.1726 44.4629 12.9134 45.6751 14.2266V10.4554C45.6751 9.34419 45.2037 7.99732 44.5976 7.22287C44.3956 6.95349 44.3282 6.78514 44.3282 6.61678V6.54943C44.3282 6.3474 44.4629 6.24639 44.6649 6.21272L49.0759 5.43827C49.8504 5.30358 50.3555 5.74131 50.3555 6.54943V26.079C50.3555 26.5168 50.4901 26.7525 50.7932 26.7525C51.0289 26.7525 51.1299 26.5841 51.1972 26.4831C51.3993 26.18 51.534 26.079 51.7023 26.079C51.8707 26.079 52.0054 26.2137 52.0054 26.3821V26.7525C52.0054 28.6717 50.9615 29.6145 49.0423 29.6145C46.8199 29.6145 45.8434 28.4024 45.7088 26.0453C44.4966 28.2677 42.5436 29.6145 40.1193 29.6145C36.2133 29.6145 33.4186 26.079 33.4186 21.163C33.4186 15.6408 36.9204 12.1726 40.9274 12.1726ZM57.6022 20.5569C57.6022 22.0721 57.8043 23.419 58.1073 24.4965C63.0907 23.0822 63.1917 17.9978 63.1917 17.3581C63.1917 15.0684 62.0806 13.4858 60.7337 13.4858C58.8481 13.4858 57.6022 16.5163 57.6022 20.5569ZM64.6733 26.0117C65.5151 24.4965 66.7609 24.3618 67.6701 25.2709C68.5792 26.18 68.4109 27.4932 66.7946 28.4024C66.0202 28.8401 64.1345 29.6145 61.6092 29.6145C56.2217 29.6145 52.7198 26.1127 52.7198 20.8936C52.7198 15.5398 56.3564 12.1726 60.9021 12.1726C64.909 12.1726 67.8721 14.7317 67.8721 18.2672C67.8721 22.8129 63.0234 25.5403 58.3767 25.4393C59.1175 27.2575 60.2623 28.2677 61.5418 28.2677C63.3938 28.2677 64.5386 26.2137 64.6733 26.0117ZM69.4923 27.2912L79.1561 13.8225H75.6879C74.1053 13.8225 72.186 14.4623 70.9065 15.4051L70.6035 15.6408C70.4351 15.7755 70.1994 15.8428 70.031 15.8428C69.829 15.8428 69.6943 15.7081 69.728 15.5061L69.9637 13.1828C69.9974 12.7787 70.2667 12.5093 70.7045 12.5093H83.4661C84.9476 12.5093 85.3517 13.2838 84.4762 14.4623L74.8124 27.931H78.954C80.5366 27.931 82.4222 27.2912 83.7018 26.3484L84.0048 26.1127C84.1732 25.978 84.4089 25.9107 84.6109 25.9107C84.8129 25.9107 84.9476 26.0453 84.9139 26.2474L84.6782 28.5707C84.6446 28.9748 84.3415 29.2778 83.9038 29.2778H70.4688C69.0209 29.2778 68.6168 28.4697 69.4923 27.2912ZM96.5738 20.5232C93.678 20.5232 90.5466 20.8599 90.5466 24.025C90.5466 26.0453 91.7924 27.5942 93.4423 27.5942C95.2606 27.5942 96.4728 25.7086 96.5738 22.6108V20.5232ZM85.6642 24.3281C85.6642 19.4457 92.0281 19.1763 96.5738 19.21C96.4728 15.2367 95.3616 13.4858 93.8127 13.4858C92.0955 13.4858 90.9843 15.5398 90.5466 16.1122C90.0078 16.853 88.9977 17.3244 87.9875 16.4826C86.9437 15.6071 87.1121 14.2603 88.7283 13.3511C89.5028 12.9134 91.3547 12.1726 93.9474 12.1726C98.6278 12.1726 101.288 14.6306 101.288 19.8834V26.079C101.288 26.5168 101.423 26.7525 101.726 26.7525C101.961 26.7525 102.062 26.5841 102.13 26.4831C102.332 26.18 102.433 26.079 102.601 26.079C102.769 26.079 102.904 26.2137 102.904 26.3821V26.7525C102.904 28.6717 101.894 29.6145 99.941 29.6145C97.988 29.6145 96.9779 28.6717 96.6748 26.8871C95.631 28.6381 93.9474 29.6145 91.6577 29.6145C88.2232 29.6145 85.6642 27.4259 85.6642 24.3281ZM109.747 13.2501V25.0352C109.747 26.1464 110.218 27.4932 110.926 28.4024C111.027 28.5371 111.094 28.7054 111.094 28.8738V28.9411C111.094 29.1431 110.959 29.2778 110.757 29.2778H104.057C103.855 29.2778 103.72 29.1431 103.72 28.9411V28.8738C103.72 28.7054 103.787 28.5371 103.888 28.4024C104.595 27.5269 105.067 26.1464 105.067 25.0352V17.156C105.067 16.0449 104.595 14.698 103.888 13.7888C103.787 13.6542 103.72 13.4858 103.72 13.3174V13.2501C103.72 13.0481 103.855 12.9471 104.057 12.9134L108.468 12.1726C109.242 12.0379 109.747 12.4757 109.747 13.2501ZM103.989 8.50239C103.989 6.65045 105.235 5.4046 107.087 5.4046C108.939 5.4046 110.151 6.65045 110.151 8.50239C110.151 10.3543 108.939 11.6002 107.087 11.6002C105.235 11.6002 103.989 10.3543 103.989 8.50239ZM129.851 17.9978V25.0352C129.851 26.1464 130.322 27.4932 131.029 28.4024C131.13 28.5371 131.198 28.7054 131.198 28.8738V28.9411C131.198 29.1431 131.063 29.2778 130.861 29.2778H124.16C123.958 29.2778 123.823 29.1431 123.823 28.9411V28.8738C123.823 28.7054 123.891 28.5371 123.992 28.4024C124.699 27.5269 125.17 26.1464 125.17 25.0352V18.5366C125.17 16.1122 124.059 14.597 122.073 14.597C119.918 14.597 118.099 16.4152 118.099 19.21V25.0352C118.099 26.1464 118.571 27.4932 119.278 28.4024C119.379 28.5371 119.446 28.7054 119.446 28.8738V28.9411C119.446 29.1431 119.311 29.2778 119.109 29.2778H112.409C112.207 29.2778 112.072 29.1431 112.072 28.9411V28.8738C112.072 28.7054 112.139 28.5371 112.24 28.4024C112.947 27.5269 113.419 26.1464 113.419 25.0352V17.156C113.419 16.0449 112.947 14.698 112.24 13.7888C112.139 13.6542 112.072 13.4858 112.072 13.3174V13.2501C112.072 13.0481 112.207 12.9471 112.409 12.9134L116.82 12.1726C117.594 12.0379 118.099 12.4757 118.099 13.2501V15.1357C119.547 13.2164 121.971 12.1726 124.329 12.1726C127.763 12.1726 129.851 14.4286 129.851 17.9978ZM142.872 20.5232C139.977 20.5232 136.845 20.8599 136.845 24.025C136.845 26.0453 138.091 27.5942 139.741 27.5942C141.559 27.5942 142.771 25.7086 142.872 22.6108V20.5232ZM131.963 24.3281C131.963 19.4457 138.327 19.1763 142.872 19.21C142.771 15.2367 141.66 13.4858 140.111 13.4858C138.394 13.4858 137.283 15.5398 136.845 16.1122C136.306 16.853 135.296 17.3244 134.286 16.4826C133.242 15.6071 133.411 14.2603 135.027 13.3511C135.801 12.9134 137.653 12.1726 140.246 12.1726C144.926 12.1726 147.586 14.6306 147.586 19.8834V26.079C147.586 26.5168 147.721 26.7525 148.024 26.7525C148.26 26.7525 148.361 26.5841 148.428 26.4831C148.63 26.18 148.731 26.079 148.9 26.079C149.068 26.079 149.203 26.2137 149.203 26.3821V26.7525C149.203 28.6717 148.193 29.6145 146.24 29.6145C144.287 29.6145 143.276 28.6717 142.973 26.8871C141.93 28.6381 140.246 29.6145 137.956 29.6145C134.522 29.6145 131.963 27.4259 131.963 24.3281ZM155.911 6.54943V15.1357C157.359 13.2164 159.783 12.1726 162.14 12.1726C165.575 12.1726 167.662 14.4286 167.662 17.9978V25.0352C167.662 26.1464 168.134 27.4932 168.841 28.4024C168.942 28.5371 169.009 28.7054 169.009 28.8738V28.9411C169.009 29.1431 168.875 29.2778 168.673 29.2778H161.972C161.77 29.2778 161.635 29.1431 161.635 28.9411V28.8738C161.635 28.7054 161.703 28.5371 161.804 28.4024C162.511 27.5269 162.982 26.1464 162.982 25.0352V18.5366C162.982 16.1122 161.871 14.597 159.884 14.597C157.729 14.597 155.911 16.4152 155.911 19.21V25.0352C155.911 26.1464 156.382 27.4932 157.089 28.4024C157.191 28.5371 157.258 28.7054 157.258 28.8738V28.9411C157.258 29.1431 157.123 29.2778 156.921 29.2778H150.22C150.018 29.2778 149.884 29.1431 149.884 28.9411V28.8738C149.884 28.7054 149.951 28.5371 150.052 28.4024C150.759 27.5269 151.231 26.1464 151.231 25.0352V10.4554C151.231 9.34419 150.759 7.99732 150.052 7.08818C149.951 6.95349 149.884 6.78514 149.884 6.61678V6.54943C149.884 6.3474 150.018 6.24639 150.22 6.21272L154.631 5.43827C155.406 5.30358 155.911 5.74131 155.911 6.54943ZM170.301 23.722V17.156C170.301 16.0449 169.829 14.698 169.122 13.7888C169.021 13.6542 168.954 13.4858 168.954 13.3174V13.2501C168.954 13.0481 169.089 12.9471 169.291 12.9134L173.702 12.1726C174.476 12.0379 174.981 12.4757 174.981 13.2501V23.2169C174.981 25.6076 176.092 27.1228 178.079 27.1228C180.234 27.1228 182.052 25.3046 182.052 22.5435V17.156C182.052 16.0449 181.581 14.698 180.975 13.9235C180.773 13.6542 180.705 13.4858 180.705 13.3174V13.2501C180.705 13.0481 180.84 12.9471 181.042 12.9134L185.453 12.1726C186.194 12.0379 186.733 12.4757 186.733 13.2501V26.079C186.733 26.5168 186.867 26.7525 187.17 26.7525C187.406 26.7525 187.507 26.5841 187.574 26.4831C187.777 26.18 187.911 26.079 188.08 26.079C188.248 26.079 188.383 26.2137 188.383 26.3821V26.7525C188.383 28.6717 187.339 29.6145 185.419 29.6145C183.332 29.6145 182.355 28.5371 182.12 26.4831C180.672 28.436 178.214 29.5809 175.823 29.5809C172.422 29.5809 170.301 27.2912 170.301 23.722ZM195.206 25.3046C195.913 26.7861 196.957 27.5942 198.404 27.5942C200.829 27.5942 202.613 25.3046 202.613 20.7926C202.613 16.8866 201.3 14.1592 198.876 14.1592C196.755 14.1592 195.34 16.2132 195.206 20.1865V25.3046ZM193.387 29.2778H189.515C189.313 29.2778 189.178 29.1431 189.178 28.9411V28.8738C189.178 28.7054 189.246 28.5371 189.347 28.4024C190.054 27.5269 190.525 26.1464 190.525 25.0352V10.4554C190.525 9.34419 190.054 7.99732 189.347 7.08818C189.246 6.95349 189.178 6.78514 189.178 6.61678V6.54943C189.178 6.3474 189.313 6.24639 189.515 6.21272L193.926 5.43827C194.701 5.30358 195.206 5.74131 195.206 6.54943V15.6745C196.418 13.4521 198.371 12.1726 200.761 12.1726C204.701 12.1726 207.462 15.6745 207.462 20.6242C207.462 26.1127 203.994 29.6145 199.953 29.6145C198.068 29.6145 196.418 28.8401 195.206 27.5269C195.172 28.5707 194.465 29.2778 193.387 29.2778ZM211.094 29.6145C209.512 29.6145 208.468 28.5707 208.468 26.9882C208.468 25.4056 209.512 24.3281 211.094 24.3281C212.677 24.3281 213.755 25.4056 213.755 26.9882C213.755 28.5707 212.677 29.6145 211.094 29.6145ZM211.936 22.2741C211.835 22.6782 211.532 22.9139 211.128 22.9139C210.724 22.9139 210.421 22.6782 210.32 22.2741L209.781 19.7824C209.209 17.0887 208.771 13.4185 208.771 10.6911V8.06466C208.771 6.65045 209.68 5.74131 211.094 5.74131C212.542 5.74131 213.485 6.65045 213.485 8.06466V10.6911C213.485 13.4185 213.047 17.0887 212.475 19.7824L211.936 22.2741Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1451_7102"
        x1="13.9039"
        y1="29.1238"
        x2="0.161479"
        y2="5.65893"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.05" stopColor="#1660A3" />
        <stop offset="0.21" stopColor="#1B7EB9" />
        <stop offset="0.42" stopColor="#1F9BCF" />
        <stop offset="0.62" stopColor="#22B0DF" />
        <stop offset="0.81" stopColor="#24BDE9" />
        <stop offset="1" stopColor="#25C1EC" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_1451_7102"
        x1="22.1483"
        y1="32.9141"
        x2="11.9386"
        y2="14.0163"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.05" stopColor="#1660A3" />
        <stop offset="0.06" stopColor="#1663A5" />
        <stop offset="0.24" stopColor="#1C85BF" />
        <stop offset="0.42" stopColor="#209FD3" />
        <stop offset="0.6" stopColor="#23B2E1" />
        <stop offset="0.79" stopColor="#24BDE9" />
        <stop offset="1" stopColor="#25C1EC" />
      </linearGradient>
    </defs>
  </svg>
);

interface ContactusProps {
  openModel: boolean
  setOpenModel: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Contactus({ openModel, setOpenModel }: ContactusProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    companyType: "",
    serviceRequired: "",
    projectBuget: "",
    message: "",
    brdUrl: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelection = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        toast.error("Something went wrong, please try again later")
      } else {
        toast.success("Your message has been sent successfully")
      }

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        companyType: "",
        serviceRequired: "",
        projectBuget: "",
        message: "",
        brdUrl: "",
      })
    } catch (err) {
      toast.error("Something went wrong, please try again later")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (openModel) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [openModel])
  if (!openModel) return null

  return (
    <div className="overflow-y-auto fixed inset-0 flex items-center z-50 modal-slide-up px-4 sm:px-8 md:px-16 lg:px-[100px] py-6 sm:py-8 md:py-12 flex-col bg-background_contact backdrop-blur-[50px]">
      <div
        className={`relative w-full flex flex-col items-center gap-8 sm:gap-12 md:gap-16
            transform transition-all duration-700 ease-in-out
            ${isClosing ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full">
          <div className="scale-75 sm:scale-90 md:scale-100">
            <CompanyLogo />
          </div>
          <button
            onClick={() => {
              setIsClosing(true)
              setTimeout(() => {
                setOpenModel(false)
                setIsClosing(false)
              }, 700) 
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M24 8L8 24M8 8L24 24"
                stroke="white"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-16">
          <div className="flex flex-col w-full">
            <div className="">
              <div className="font-Nunito max-w-[124px] px-4 py-2 rounded-full border border-hero_section_border bg-button-card-gradient">
                Get In Touch
              </div>
            </div>
            <div className="font-Manrope text-[28px] sm:text-[32px] md:text-[42px] lg:text-[52px] font-semibold">
              Have an Idea?<br></br> Connect with Experts
            </div>
            <div className="text-base sm:text-lg md:text-xl font-Nunito text-text_gray pt-4 sm:pt-6">
              You can also send an email at{" "}
              <span className="text-white font-Nunito text-xl underline">info@dezainahub.com</span>
            </div>
          </div>
          <div className="flex flex-col w-full gap-8">
            <div className="text-[26px] font-Manrope font-semibold">Personal details</div>
            <div className="">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full name"
                className="w-full pb-3 bg-transparent border-b border-hero_section_border text-text_gray font-Nunito focus:outline-none"
              />
            </div>
            <div className="">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full pb-3 bg-transparent border-b border-hero_section_border text-text_gray font-Nunito focus:outline-none"
              />
            </div>
            <div className="">
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone number"
                className="w-full pb-3 bg-transparent border-b border-hero_section_border text-text_gray font-Nunito focus:outline-none"
              />
            </div>
            <div className="">
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Company name (optional)"
                className="w-full pb-3 bg-transparent border-b border-hero_section_border text-text_gray font-Nunito focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="text-text_gray font-Nunito">Company type</div>
              <div className="flex gap-4 flex-wrap">
                <div
                  onClick={() => handleSelection("companyType", "Enterprises")}
                  className={`font-Nunito text-sm px-4 py-2 border border-hero_section_border rounded-full hover:bg-primary-gradient cursor-pointer ${
                    formData.companyType === "Enterprises" ? "bg-primary-gradient" : ""
                  }`}
                >
                  Enterprises
                </div>
                <div
                  onClick={() => handleSelection("companyType", "Medium scale")}
                  className={`font-Nunito text-sm px-4 py-2 border border-hero_section_border rounded-full hover:bg-primary-gradient cursor-pointer ${
                    formData.companyType === "Medium scale" ? "bg-primary-gradient" : ""
                  }`}
                >
                  Medium scale
                </div>
                <div
                  onClick={() => handleSelection("companyType", "Small scale business")}
                  className={`font-Nunito text-sm px-4 py-2 border border-hero_section_border rounded-full hover:bg-primary-gradient cursor-pointer ${
                    formData.companyType === "Small scale business" ? "bg-primary-gradient" : ""
                  }`}
                >
                  Small scale business
                </div>
                <div
                  onClick={() => handleSelection("companyType", "Start up")}
                  className={`font-Nunito text-sm px-4 py-2 border border-hero_section_border rounded-full hover:bg-primary-gradient cursor-pointer ${
                    formData.companyType === "Start up" ? "bg-primary-gradient" : ""
                  }`}
                >
                  Start up
                </div>
                <div
                  onClick={() => handleSelection("companyType", "Idea in progress")}
                  className={`font-Nunito text-sm px-4 py-2 border border-hero_section_border rounded-full hover:bg-primary-gradient cursor-pointer ${
                    formData.companyType === "Idea in progress" ? "bg-primary-gradient" : ""
                  }`}
                >
                  Idea in progress
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="text-[26px] font-Manrope font-semibold">Project details</div>
              <div className="flex flex-col gap-6">
                <div className="text-text_gray font-Nunito">Service required (select multiple if required)</div>
                <div className="flex gap-4 flex-wrap">
                  
                  {[
                    "Visual Design",
                    "UI/UX Design",
                    "Web Design",
                    "Brand Identity",
                    "Web Development",
                    "Web app",
                    "MVP Development",
                    "SaaS Design",
                  ].map((service) => (
                    <div
                      key={service}
                      onClick={() => handleSelection("serviceRequired", service)}
                      className={`font-Nunito text-sm px-4 py-2 border border-hero_section_border rounded-full hover:bg-primary-gradient cursor-pointer ${
                        formData.serviceRequired === service ? "bg-primary-gradient" : ""
                      }`}
                    >
                      {service}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="text-text_gray font-Nunito">Project Budget</div>
                <div className="flex gap-4 flex-wrap">
               
                  {["Less than $1K", "$1K to 5K", "$5K to $10K", "More than $10K"].map((budget) => (
                    <div
                      key={budget}
                      onClick={() => handleSelection("projectBuget", budget)}
                      className={`font-Nunito text-sm px-4 py-2 border border-hero_section_border rounded-full hover:bg-primary-gradient cursor-pointer ${
                        formData.projectBuget === budget ? "bg-primary-gradient" : ""
                      }`}
                    >
                      {budget}
                    </div>
                  ))}
                </div>
              </div>
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your project"
                className="w-full pb-3 bg-transparent border-b border-hero_section_border text-text_gray font-Nunito focus:outline-none"
              />
              {/* <div className="font-Nunito">
                If you have a document, kindly attach below (File size up to 5
                MB.)
              </div>
              <div className="font-Nunito flex gap-2 max-w-[182px] items-center px-4 py-2 border border-white rounded-full cursor-pointer">
                <span className="">
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
                Add attachment
              </div> */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`max-w-[208px] text-sm pl-4 pr-2 py-2 mt-16 cursor-pointer rounded-full h-12 bg-primary-gradient text-white font-Manrope font-semibold flex items-center justify-between gap-2`}
              >
                {isLoading ? "Submitting..." : "Submit Application"}
                <span className="p-2 bg-white rounded-full w-8 h-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
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
        </div>
      </div>
    </div>
  )
}

