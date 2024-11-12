"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileInput = () => {
  const [mobile, setMobile] = useState("");

  return (
    <div className="text-center relative w-[85%] h-screen">
      <div className="mt-[77px] mb-[88px]">
        <h2 className="text-2xl font-medium text-center text-[#1A1A1A]">
          Choose your language
        </h2>
        <p className="text-[18px] font-medium text-[#434343]">
          Select your preferred language to continue
        </p>
      </div>

      <InputWithIcon icon={PhoneCall} placeholder="Enter your mobile number" />

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
