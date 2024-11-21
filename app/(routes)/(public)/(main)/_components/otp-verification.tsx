"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { cn, speak } from "@/lib/utils";

interface OTPVerificationProps {
  mobile: string;
  setStage: (value: number) => void;
  onVerify: (value: string) => void;
  otpError: string;
}

const OTPVerification = ({
  mobile,
  setStage,
  onVerify,
  otpError,
}: OTPVerificationProps) => {
  const [value, setValue] = useState("");

  const handleVerify = () => {
    onVerify(value);
  };

  useEffect(() => {
    speak("Please enter the OTP sent to your email");
  }, []);

  return (
    <div className="relative text-center w-full h-screen">
      <div className="mt-[77px] mb-[20px]">
        <h2 className="text-2xl font-medium text-start text-[#1A1A1A]">
          Verify your mobile number
        </h2>
        <p className="text-[#434343] text-start mt-[6px] fontmedium text-[16px]">
          Enter the verification code sent to your [Email/Phone Number] to
          complete your registration
        </p>
      </div>
      <div className="w-full items-center mt-[48px] flex flex-col gap-3">
        <Label htmlFor="terms" className="w-full text-center ">
          We&apos;ve sent an OTP to {mobile} -
          <Button onClick={() => setStage(10)} variant="link">
            Edit <Edit />
          </Button>
        </Label>
        <InputOTP
          type="password"
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup className="gap-4">
            <InputOTPSlot index={0} />
          </InputOTPGroup>
          <InputOTPGroup className="gap-4">
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPGroup className="gap-4">
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPGroup className="gap-4">
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPGroup className="gap-4">
            <InputOTPSlot index={4} />
          </InputOTPGroup>
          <InputOTPGroup className="gap-4">
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      {otpError && (
        <p className="error-message text-red-500 mt-6 text-center">
          {otpError}
        </p>
      )}

      <div className="absolute bottom-0 mb-32 w-full flex justify-center">
        <Button
          className={cn(
            "mt-[48px] bottom-0 text-[18px] mx-auto font-medium text-white w-full py-[24px]",
            !value.length
              ? "opacity-80 cursor-not-allowed hover:bg-none"
              : "bg-theme-primary hover:bg-[#0c2941]"
          )}
          onClick={handleVerify}
          disabled={!value.length}
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
