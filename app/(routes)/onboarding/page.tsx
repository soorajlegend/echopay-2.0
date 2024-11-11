"use client";

import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Label } from "@/components/ui/label";
import { Eye, Mail, Phone } from "lucide-react";
import React from "react";

const OnboardingPage = () => {
  return (
    <div className="w-full h-full flex flex-col justify-end gap-10 pt-20 px-3 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold">Join the Future of Finance</h1>
        <p className="text-base">
          Create your EchoPay account today and experience AI powered financial
          transactions
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label>Phone Number</Label>
          <InputWithIcon
            type="text"
            icon={Phone}
            placeholder="Enter your phone number"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between gap-3">
            <Label>Email</Label>
            <span className="text-yellow-600 capitalize">(Optioal)</span>
          </div>
          <InputWithIcon
            type="email"
            icon={Mail}
            placeholder="Enter your email address"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Password</Label>
          <InputWithIcon
            type="password"
            icon={Eye}
            placeholder="Create a password"
          />
        </div>
        <div className="flex gap-2">
          <p>
            I agree to the <a href="#">Terms and Conditions</a> and{" "}
            <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-8">
        <Button>Create Account</Button>
        <p>
          Already have an account? <a href="#">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;
