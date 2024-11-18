"use client";
import React from "react";
import { useState } from "react";
import axios from "axios";
import { Inbox, Eye } from "lucide-react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // sigin in function
  const handleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://echo-pay.onrender.com/api/login",
        {
          phone,
          password,
        }
      );

      if (response.status === 200) {
        console.log("Login successful", response.data);
        router.push("/dashboard"); // Redirect to dashboard
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
      console.error("Error logging in:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-screen w-full relative">
      <div className="w-full mt-[77px] mb-[88px]">
        <h2 className="text-2xl font-medium text-start text-[#1A1A1A]">
          Welcome Back!
        </h2>
        <p className="text-base  mt-2">
          Log in to your EchoPay account to access your funds and manage your
          finances
        </p>
      </div>

      <div className="w-full flex flex-col gap-3 items-start">
        <Label htmlFor="email" className="w-full text-left text-xl">
          Email
        </Label>
        <InputWithIcon
          icon={Inbox}
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="w-full flex  mt-6 flex-col gap-3 items-start">
        <Label htmlFor="password" className="w-full text-left text-xl">
          Password
        </Label>
        <InputWithIcon
          icon={Eye}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="w-full flex flex-col gap-8">
        <Button
          className="mt-[48px] bottom-0 text-[18px] font-medium text-white w-full py-[24px]"
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="w-full flex justify-center items-center">
          <div className="">
            <p className="text-center w-full">Don&apos;t have an account?</p>
          </div>
          <Button
            variant="link"
            onClick={() => router.push("/signup")}
            className="text-[18px] font-medium py-[24px]"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
