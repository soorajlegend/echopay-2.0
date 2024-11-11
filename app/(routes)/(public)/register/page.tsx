"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Label } from "@/components/ui/label";
import { Eye, Mail, Phone } from "lucide-react";
import React, { useState } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({
    phoneNumber: "",
    email: "",
    password: "",
    agreeToTerms: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      phoneNumber: "",
      email: "",
      password: "",
      agreeToTerms: "",
    };

    // Phone validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
      isValid = false;
    }

    // Email validation (optional)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Ready for API call
      const payload = {
        phoneNumber: formData.phoneNumber,
        email: formData.email || undefined, // Only include if provided
        password: formData.password,
      };

      // API call would go here
      console.log("Form data ready for submission:", payload);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col justify-end gap-20 pt-40 px-3 pb-10"
    >
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
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
          {errors.phoneNumber && (
            <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between gap-3">
            <Label>Email</Label>
            <span className="text-yellow-600 capitalize">(Optional)</span>
          </div>
          <InputWithIcon
            type="email"
            icon={Mail}
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Password</Label>
          <InputWithIcon
            type="password"
            icon={Eye}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Checkbox
            checked={formData.agreeToTerms}
            onCheckedChange={(checked: boolean) =>
              setFormData({ ...formData, agreeToTerms: checked as boolean })
            }
          />
          <p>
            I agree to the <a href="#">Terms and Conditions</a> and{" "}
            <a href="#">Privacy Policy</a>
          </p>
        </div>
        {errors.agreeToTerms && (
          <span className="text-red-500 text-sm">{errors.agreeToTerms}</span>
        )}
      </div>
      <div className="w-full flex flex-col gap-8">
        <Button type="submit">Create Account</Button>
        <p className="w-full text-center">
          Already have an account? <a href="#">Sign In</a>
        </p>
      </div>
    </form>
  );
};

export default RegisterPage;
