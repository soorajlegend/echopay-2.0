"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { speak } from "@/lib/utils";

interface MobileInputProps {
  mobile: string;
  name: string;
  email: string;
  setMobile: (value: string) => void;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  onProceed: () => void;
  isLoading: boolean;
  stageChange: () => void;
}

const MobileInput = ({
  mobile,
  name,
  email,
  setMobile,
  setName,
  setEmail,
  onProceed,
  isLoading,
  stageChange,
}: MobileInputProps) => {
  return (
    <div className="text-center relative w-full h-screen">
      <div className="w-full mt-[77px] mb-[88px]">
        <h2 className="text-2xl font-medium text-start text-[#1A1A1A]">
          Register
        </h2>
      </div>
      <div className="w-full flex flex-col gap-3 items-start">
        <Label htmlFor="name" className="w-full text-left text-xl">
          Name
        </Label>
        <Input
          // icon={PhoneCall}
          type="text"
          id="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => speak("Please enter your full name")}
        />
      </div>

      <div className="mt-4 w-full flex flex-col gap-3 items-start">
        <Label htmlFor="mobile" className="w-full text-left text-xl">
          Mobile
        </Label>
        <InputWithIcon
          icon={PhoneCall}
          type="tel"
          id="mobile"
          placeholder="Enter your mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          onFocus={() => speak("Please enter your mobile number")}
        />
      </div>

      <div className="mt-4 w-full flex flex-col gap-3 items-start">
        <Label htmlFor="email" className="w-full text-left text-xl">
          Email
        </Label>
        <Input
          // icon={Inbox}
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => speak("Please enter your email address")}
        />
      </div>

      <div className="absolte bottom0 mb32 w-full flex justify-center">
        <Button
          className={` ${
            !mobile.length
              ? "opacity-80 cursor-not-allowed hover:bg-none"
              : "bg-theme-primary hover:bg-[#0c2941]"
          } mt-[48px] bottom-0 text-[18px] font-medium text-white w-full py-[24px]`}
          onClick={onProceed}
          disabled={!mobile.length || isLoading}
        >
          {isLoading ? "Sending OTP" : "proceed"}
        </Button>
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="">
          <p className="text-center w-full">Don&apos;t have an account?</p>
        </div>
        <Button
          variant="link"
          onClick={stageChange}
          className="text-[18px] font-medium py-[24px]"
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default MobileInput;
