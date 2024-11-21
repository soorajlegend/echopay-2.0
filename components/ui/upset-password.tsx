"use client";

import { useState } from "react";
import PasswordInput from "../password-input";
import { speak } from "@/lib/utils";

interface UpsetPasswordProps {
  onFinish: (password: string) => void;
}

const UpsetPassword = ({ onFinish }: UpsetPasswordProps) => {
  const [passStage, setPassStage] = useState(1);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");

  const handleMatch = () => {
    if (pass1.length !== 6) {
      return setError("Password must be 6-digits");
    }

    if (pass1 !== pass2) {
      return setError("Passwords did not match");
    }

    console.log("Password verified:", pass1);
    onFinish(pass1);
  };

  const handleFocus = (text: string) => {
    return speak(text);
  };

  return (
    <div className="relative text-center w-full flex flex-col justify-center h-full gap-5">
      {/* TODO: create back button */}
      <h2 className="text-2xl font-medium text-center space-y-5 text-[#1A1A1A]">
        Create your 6-digit password
      </h2>
      {/* create password */}
      {passStage === 1 && (
        <PasswordInput
          label="Create password"
          onComplete={() => setPassStage(2)}
          setValue={setPass1}
          value={pass1}
          onFocus={() => handleFocus("Please create 6 digit password")}
        />
      )}
      {/* confirm password */}
      {passStage === 2 && (
        <PasswordInput
          label="Confirm password"
          onComplete={handleMatch}
          setValue={setPass2}
          value={pass2}
          error={error}
          onFocus={() => handleFocus("Please confirm your 6 digit password")}
        />
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default UpsetPassword;
