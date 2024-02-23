"use client";

import { useServerAction } from "@/hooks/useServerActions";
import { LoginAction } from "@/server/authActions";
import { hasCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [runAction, isRunning] = useServerAction(LoginAction);

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
          router.replace("/dashboard");
        } else {
          setError(result?.error as string);
        }
      });
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="w-full">
      <div className="w-full h-dvh m-0 flex flex-wrap items-center justify-center bg-primary">
        <div
          className="w-full overflow-hidden bg-[#fff] flex flex-wrap items-stretch 
        flex-row-reverse"
        >
          <form
            action={handleSubmit}
            className="md:w-[50%] min-h-dvh flex items-center justify-center mx-auto 
          flex-col md:p-20 space-y-4
          "
          >
            <span className="text-3xl font-semibold pb-10">
              Login to Inventory Application
            </span>
            <div className="flex flex-col w-full text-lg">
              Email
              <input
                type="email"
                className="border p-2 rounded-md"
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
                className="border p-2 rounded-md"
                id="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="mt-8 w-full">
              <button
                disabled={isRunning}
                className="bg-purple-400 w-full p-2.5 rounded-md text-white font-semibold 
                hover:bg-purple-500
                "
                name="login"
              >
                Login
              </button>
            </div>
          </form>

          <div className="w-[50%] h-dvh relative hidden md:flex items-center justify-center p-6 bg-[#f2f2f2]">
            <Image
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              alt="brand"
              width={500}
              height={500}
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
