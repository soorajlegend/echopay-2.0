"use client";

import { useState } from "react";
import PasswordInput from "../password-input";

interface ExistingUserLoginProps {
    onLogin: (password: string, phone: string) => void;
    isLoading: boolean;
    mobile: string
  }

const ExistingUserLogin = ({ onLogin, isLoading, mobile }: ExistingUserLoginProps) => {

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (password.length !== 6) {
          setError("Password must be 6 digits");
          return;
        }
    
        // Call the onLogin function passed in props with the password
        onLogin(password, mobile);
      };
    

  return (
    <div className="relative text-center w-full justifycenter h-full gap-5">
      {/* TODO: create back button */}

      <div className="mt-[77px] mb-[20px]">
      <h2 className="text-2xl font-medium text-center space-y-5 text-[#1A1A1A]">
        Enter your 6-digit password
      </h2>
      </div>
      {/* create password */}
        <div className="w-[90%] mx-auto">

         <PasswordInput
         label="Password"
         value={password}
         setValue={setPassword}
         onComplete={handleLogin}
         error={error}
       />
        </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="absolute bottom-0 mb-32 w-full flex justify-cente">

      <button
        disabled={isLoading}
        onClick={handleLogin}
        className="bg-[#003056] text-white py-2 px-4 w-full rounded mt-4"
      >
        {isLoading ? "Logging in..." : "Continue"}
      </button>
      </div>
    </div>
  );
};

export default ExistingUserLogin;
