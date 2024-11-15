"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";

import MobileInput from "./_components/mobile-input";
import SplashSlides from "./_components/splash-slides";
import OTPVerification from "./_components/otp-verification";
import { Loader2, Phone } from "lucide-react";
import UpsetPassword from "@/components/ui/upset-password";
import SlideContainer from "@/components/slide-container";
import LanguageSelector from "@/components/language-selector";
import { useRouter } from "next/navigation";
import ExistingUserLogin from "@/components/ui/ExistingUserLogin"
import PasswordInput from "@/components/password-input";

const OnboardingPage = () => {
  const [stage, setStage] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [zoomLogo, setZoomLogo] = useState(false);
  const [mobile, setMobile] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [loading, setLoading] = useState(false)
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [otpError, setOtpError] = useState("");
  const [userPassword, setUserPassword] = useState("")
 
  // const newUser = true;

  const router = useRouter();

  useEffect(() => {
    const timer1 = setTimeout(() => setZoomLogo(true), 2000);
    const timer2 = setTimeout(() => {
      setShowLogo(false);
      setStage(1);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleContinue = async () => {
    console.log("handleContinue called", stage);
    console.log(mobile)
    setLoading(true)
    if (stage === 4) {
      try {
        const response = await axios.post("https://echo-pay.onrender.com/api/send-otp", {
          phone: mobile,
        });

        if (response.status === 200) {
          // OTP sent successfully, move to OTP entry stage
          setLoading(false)
          setStage(5);
        } else {
          console.error("Failed to send OTP");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    } else {
      setStage(stage + 1);
      setLoading(false)
    }
  }



  const handleOTPVerification = async (otp: string, phone: string) => {
    setIsVerifying(true);
    setOtpError("");
    // setLoading(true)
    try {
      const response = await axios.post("https://echo-pay.onrender.com/api/verify-otp", {
        otp,
        phone: mobile
      })

      console.log(response.data.responseBody, "fom otp")

      if (response.status === 200) {
        setIsVerifying(false);
        setIsVerified(true);
        if (response.data.responseBody === null) {
          setIsNewUser(true);
          setStage(6); //
        } else {
          setIsNewUser(false)
          setStage(6)
        }
      } else {
        // Handle OTP verification failure
        console.error("OTP verification failed");
        setOtpError("OTP verification failed. Please try again.");
        setIsVerifying(false);
      }
    } catch (error) {
      setOtpError("Incorrect OTP. Please check and try again.");
      console.error("Error during OTP verification:", error);
      setIsVerifying(false);
    }
  };


  const handlePasswordAndProceed = (password: string) => {
    setUserPassword(password); // Temporarily store the password
    setStage(7); // Move to language selection
  };
  

  const handleLanguageAndRegister  = async (language: string) => {
    try {
      const response = await axios.post("https://echo-pay.onrender.com/api/register", {
        phone: mobile,
        password: userPassword,
        language,
      });
  
      if (response.status === 200) {
       console.log("User registered successfully");
        console.log(response.data, "from register")
        router.push("/dashboard"); // Redirect to dashboard
        if (response.data.isVerified === false) {
            
        }
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };


  const handleExistingUserLogin = async (password: string) => {
    try {
      const response = await axios.post("https://echo-pay.onrender.com/api/login", {
        phone: mobile,
        password,
      });
  
      if (response.status === 200) {
        console.log("Login successful");
        console.log(response.data, " from login")
        router.push("/dashboard"); // Redirect to dashboard
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  

  return (
    <div className="w-full h-full flex flex-col gap-10 relative">
      <div className="h-screen w-full flex flex-col p-3 items-center justify-center">
        {showLogo && (
          <motion.div
            className={`transition-transform duration-1000 ${zoomLogo ? "scale-110" : "scale-100"
              }`}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Image src="/e.svg" alt="Logo" width={200} height={200} />
          </motion.div>
        )}

        <SplashSlides
          show={showLogo}
          stage={stage}
          setStage={setStage}
          onContinue={handleContinue}
        />

        {/* mobile input stage */}

        {stage === 4 && (
          <SlideContainer custom={stage}>
            <MobileInput
              mobile={mobile}
              setMobile={setMobile}
              onProceed={handleContinue}
              isLoading={loading}
            />
          </SlideContainer>
        )}

        {/* verification stage */}
        {stage === 5 && (
          <SlideContainer custom={stage}>
            <OTPVerification
              mobile={mobile}
              otpError={otpError}
              setStage={setStage}
              onVerify={(otp, phone) => handleOTPVerification(otp, phone)}
            />
          </SlideContainer>
        )}
      </div>

      {/* if verified and is new user */}
      {stage === 6 && !isNewUser && isVerified && (
        <SlideContainer custom={stage}>
          <ExistingUserLogin mobile={mobile} isLoading={loading} onLogin={handleExistingUserLogin} />
        </SlideContainer>
      )}

      {/* if verified and is existing user */}
      {stage === 6 && isNewUser && isVerified && (
        <SlideContainer custom={stage}>
          <UpsetPassword onFinish={(password) => handlePasswordAndProceed(password)} mobile={mobile} />
        </SlideContainer>
      )}

      {stage === 7 && (
           <SlideContainer custom={stage}>
           <LanguageSelector
             selectedLanguage={selectedLanguage}
             setSelectedLanguage={setSelectedLanguage}
             onContinue={() => handleLanguageAndRegister(selectedLanguage)}
           />
         </SlideContainer>
      )}

      {/*
       loader 
       */}
      {isVerifying && (
        <div className="fixed z-50 inset-0 w-full h-full bg-black/70 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-white/90 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
