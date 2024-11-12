"use client";

import { useState } from "react";
import PasswordInput from "../password-input";

interface UpsetPasswordProps {
  onFinish: (value: string) => void;
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
    if (pass1 !== pass1) {
      return setError("Password did not match");
    }

    onFinish(pass1);
  };

  return (
    <div className="relative text-center w-full flex flex-col justify-center h-screen">
      {/* TODO: create back button */}
      <div className="mt-[50px] mb-[40px] flex flex-col gap-5">
        <h2 className="text-2xl font-medium text-center text-[#1A1A1A]">
          Create your 6-digit password
        </h2>
        {/* create password */}
        {passStage === 1 && (
          <PasswordInput
            label="Create password"
            onComplete={() => setPassStage(2)}
            setValue={setPass1}
            value={pass1}
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
          />
        )}
      </div>
    </div>
  );
};

export default UpsetPassword;
