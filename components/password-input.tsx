"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "./ui/label";
import { useEffect } from "react";

interface PasswordInputProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  error?: string;
  onComplete: () => void;
  disabled?: boolean;
}

const PasswordInput = ({
  value,
  setValue,
  label,
  error,
  onComplete,
  disabled,
}: PasswordInputProps) => {
  useEffect(() => {
    if (value.length === 6) {
      onComplete();
    }
  }, [value, onComplete]);

  return (
    <div className="relative text-center w-full">
      <div className="w-full items-center flex flex-col gap-5">
        <Label htmlFor={label} className="w-full text-center capitalize">
          {label}
        </Label>
        <InputOTP
          disabled={disabled}
          type="password"
          id={label}
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
        <span className="text-rose-700">{error}</span>
      </div>
    </div>
  );
};

export default PasswordInput;
