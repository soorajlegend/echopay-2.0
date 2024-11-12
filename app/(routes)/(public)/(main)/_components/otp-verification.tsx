"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

interface OTPVerificationProps {
  mobile: string;
  setStage: (value: number) => void;
  setIsVerifying: (value: boolean) => void;
  setVerified: (value: boolean) => void;
}

const OTPVerification = ({
  mobile,
  setStage,
  setIsVerifying,
  setVerified,
}: OTPVerificationProps) => {
  const [value, setValue] = useState("");

  return (
    <div className="text-center relative w-[85%] h-screen">
      <div className="mt-[77px] mb-[88px]">
        <h2 className="text-2xl font-medium text-center text-[#1A1A1A]">
          Enter your mobile number
        </h2>
      </div>
      <div className="flex flex-col gap-3 items-start">
        <Label htmlFor="terms" className="w-full text-left text-xl">
          We've sent an OTP to {mobile}
        </Label>
        <InputOTP
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
