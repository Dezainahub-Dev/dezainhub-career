"use client";
import Image from "next/image";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const Login = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      console.log('Auth state changed in login page:', loggedInUser?.email);
      
      if (loggedInUser) {
        // User is logged in - go back to previous page
        setUser(loggedInUser);
        console.log('User logged in, going back');
        router.back();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast.error("Firebase authentication is not initialized");
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      console.log('Starting Google login...');
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      console.log('Login successful, user:', loggedInUser.email);
      toast.success(`Welcome, ${loggedInUser.displayName}!`);
      
      // Don't navigate here - let the useEffect handle it
      
    } catch (err) {
      toast.error("Failed to log in with Google. Please try again.");
      console.error('Login error:', err);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className=" min-h-[100svh] max-h-[100svh] md:flex-row p-4 max-w-full sm:flex flex-col gap-4 py-10">
        <div className="relative p-8 flex flex-col justify-between flex-1 rounded-[24px] bg-transparent">
          <Image
            src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741813835/Frame_1_kox5a0.png"
            alt="company logo"
            width={215}
            height={40}
            className="absolute top-0 w-full h-full left-0 -z-10"
          />
          <div className="w-full">
            <Image
              src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741675497/Dezainahub_Logo_1_gtugu3.png"
              alt="company logo"
              width={215}
              height={40}
            />
          </div>
          <div className="w-full py-10">
            <div className="text-[40px] md:text-[80px] md:leading-[100px] font-semibold font-Manrope">
              Get Started <br /> with Us
            </div>
            <div className="text-[20px] leading-[32px] font-Nunito">
              Complete these easy steps to register your account.
            </div>
          </div>
        </div>
        <div className="flex-1 rounded-[24px] bg-[#021921] flex flex-col justify-center items-center gap-8 py-10">
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="text-[32px] leading-[40px] font-Manrope font-semibold">
              Hey there,
            </div>
            <div className="text-[20px] leading-[32px] font-Nunito text-[#738287]">
              Signup to get started
            </div>
          </div>
          <div className="flex flex-col gap-6 ">
            <div className="flex flex-row gap-6">
              <div
                onClick={handleGoogleLogin}
                className="rounded-full cursor-pointer border-2 border-hero_section_border flex flex-row justify-between items-center pl-4 pr-2 py-2 w-[248px] font-Manrope"
              >
                <div>Sign up with Google</div>
                <div className="rounded-full bg-white p-2 w-[32px] h-[32px]">
                  <Image
                    src="https://res.cloudinary.com/dsalsyu0z/image/upload/v1741763006/google_kbtalr.png"
                    alt="Google Logo"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;