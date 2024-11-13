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
import { cn } from "@/lib/utils";

interface OTPVerificationProps {
  mobile: string;
  setStage: (value: number) => void;
  onVerify: (value: string) => void;
}

const OTPVerification = ({
  mobile,
  setStage,
  onVerify,
}: OTPVerificationProps) => {
  const [value, setValue] = useState("");

  return (
    <div className="relative text-center w-full h-screen">
      <div className="mt-[77px] mb-[88px]">
        <h2 className="text-2xl font-medium text-center text-[#1A1A1A]">
          Verify your mobile number
        </h2>
      </div>
      <div className="w-full items-center flex flex-col gap-3">
        <Label htmlFor="terms" className="w-full text-center ">
          We&apos;ve sent an OTP to {mobile} -
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
          <InputOTPGroup className="gap-3">
            <InputOTPSlot index={0} />
          </InputOTPGroup>
          <InputOTPGroup className="gap-3">
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPGroup className="gap-3">
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPGroup className="gap-3">
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPGroup className="gap-3">
            <InputOTPSlot index={4} />
          </InputOTPGroup>
          <InputOTPGroup className="gap-3">
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="absolute bottom-0 mb-32 w-full flex justify-center">
        <Button
          className={cn(
            "mt-[48px] bottom-0 text-[18px] mx-auto font-medium text-white w-full py-[24px]",
            !value.length
              ? "opacity-80 cursor-not-allowed hover:bg-none"
              : "bg-theme-primary hover:bg-[#0c2941]"
          )}
          onClick={() => onVerify(value)}
          disabled={!value.length}
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
