"use client";

import { useState } from "react";
import PasswordInput from "../password-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TransactionInputProps {
    onContinue: (pin: string) => void;
    value: string;
    isLoading: boolean;
    error: string;
    setPin: (value: string) => void;
  }

const TransactionInput = ({ onContinue, isLoading, value, setPin,  error }: TransactionInputProps) => {

  return (
    <div className="relative textcenter max-w-lg mx-auto flex flex-col justifycenter h-full gap-5">
      {/* TODO: create back button */}

      <div className="mt-[77px] mb[20px] text-start">
      <h2 className="text-2xl font-medium space-y-5 text-[#1A1A1A]">
        Transction Pin
      </h2>
      <p>Enter your 5-digit PIN to authenticate this transactions. </p>
      </div>

      <div className="w-full items-center mt-[68px] flex flex-col gap-5">
        
        <InputOTP
          type="password"
          maxLength={5}
          value={value}
          onChange={(newValue) => setPin(newValue)}
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
        </InputOTP>
        <span className="text-rose-700">{error}</span>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <div className="absolute bottom-0 mb-32 w-full flex justify-cente">

      <button
        disabled={isLoading}
        onClick={() => onContinue(value)}
        className="bg-[#003056] text-white py-2 px-4 w-full rounded mt-4"
      >
        {isLoading ? "processing..." : "Continue"}
      </button>
      </div>
    </div>
  );
};

export default TransactionInput;
