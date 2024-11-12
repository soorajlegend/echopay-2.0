"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileInputProps {
  mobile: string;
  setMobile: (value: string) => void;
}

const MobileInput = ({ mobile, setMobile }: MobileInputProps) => {
  return (
    <div className="text-center relative w-[85%] h-screen">
      <div className="mt-[77px] mb-[88px]">
        <h2 className="text-2xl font-medium text-center text-[#1A1A1A]">
          Enter your mobile number
        </h2>
      </div>
      <div className="flex flex-col gap-3 items-start">
        <Label htmlFor="terms" className="w-full text-left text-xl">
          Mobile
        </Label>
        <InputWithIcon
          icon={PhoneCall}
          type="tel"
          placeholder="Enter your mobile number"
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>

      <div className="absolute bottom-0 mb-32 w-full">
        <Button
          className={` ${
            !mobile.length
              ? "opacity-80 cursor-not-allowed hover:bg-none"
              : "bg-theme-primary hover:bg-[#0c2941]"
          } mt-[48px] bottom-0 text-[18px] font-medium text-white w-full py-[24px]`}
          onClick={() => {}}
          disabled={!mobile.length}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default MobileInput;
