"use client";

import { Button } from "@/components/ui/button";
import { useServerAction } from "@/hooks/useServerAction";
import { RegisterAction } from "@/server/authActions";
import { hasCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [runAction, isRunning] = useServerAction(RegisterAction);

  const token = hasCookie("token");
  const router = useRouter();

  // automatic redirect to /dashboard when already authenticated
  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, router]);

  const handleSubmit = async (e: FormData) => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Call server action to authenticate the user
    try {
      await runAction(e).then((result) => {
        if (result?.success) {
          window.location.href = "/auth/login";
        } else {
          setError(result?.error as string);
        }
      });
    } catch (error) {
      console.error("Error register:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="w-full">
      <div className="w-full h-dvh flex flex-wrap items-center justify-center bg-primary">
        <div
          className="w-full overflow-hidden bg-background flex flex-wrap items-stretch
        flex-row-reverse"
        >
          <form
            action={handleSubmit}
            className="md:w-[50%] min-h-dvh flex items-center justify-center mx-auto 
          flex-col md:p-20 space-y-4
          "
          >
            <span className="text-xl sm:text-3xl font-semibold pb-10 break-words">
              Register to Inventory Application
            </span>
            <div className="flex flex-col w-full text-lg">
              Email
              <input
                type="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                id="email"
                aria-describedby="emailHelp"
                name="email"
                placeholder="Enter Email Address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col w-full text-lg">
              Password
              <input
                type="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                id="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="mt-2 self-end text-xs">
              Already have account ?{" "}
              <Link href="/auth/login" className="underline">
                login
              </Link>
            </div>

            <div className="mt-8 w-full">
              <Button
                disabled={isRunning}
                className="bg-purple-400 w-full p-2.5 rounded-md text-white font-semibold 
                hover:bg-purple-500 text-base
                "
                name="register"
              >
                {isRunning ? (
                  <div className="flex items-center justify-center gap-2 mx-auto">
                    <p className="text-xs font-semibold">
                      Redirecting to Login
                    </p>
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  </div>
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </form>

          <div className="w-[50%] h-dvh relative hidden md:flex items-center justify-center p-6 bg-[#f2f2f2]">
            <Image
              src="/bg-01.jpg"
              alt="brand"
              fill
              fetchPriority="high"
              objectFit="cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
