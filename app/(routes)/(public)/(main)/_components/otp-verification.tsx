"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface OTPVerificationProps {
  mobile: string;
  setStage: (value: number) => void;
  setIsVerifying: (value: boolean) => void;
  setIsVerified: (value: boolean) => void;
}

const OTPVerification = ({
  mobile,
  setStage,
  setIsVerifying,
  setIsVerified,
}: OTPVerificationProps) => {
  const [value, setValue] = useState("");

  console.log(setStage, setIsVerified, setIsVerifying);

  return (
    <div className="text-center relative w-[85%] h-screen">
      <div className="mt-[77px] mb-[88px]">
        <h2 className="text-2xl font-medium text-center text-[#1A1A1A]">
          Verify your mobile number
        </h2>
      </div>
      <div className="w-full items-center flex flex-col gap-3">
        <Label htmlFor="terms" className="w-full text-left ">
          We&apos;ve sent an OTP to {mobile} -{" "}
          <Button onClick={() => setStage(4)} variant="link">
            Edit <Edit />
          </Button>
        </Label>
        <InputOTP
          type="password"
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={4} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="absolute bottom-0 mb-32 w-full">
        <Button
          className={` ${
            !value.length
              ? "opacity-80 cursor-not-allowed hover:bg-none"
              : "bg-theme-primary hover:bg-[#0c2941]"
          } mt-[48px] bottom-0 text-[18px] font-medium text-white w-full py-[24px]`}
          onClick={() => {}}
          disabled={!value.length}
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
