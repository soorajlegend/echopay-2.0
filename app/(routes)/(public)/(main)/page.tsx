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

const OnboardingPage = () => {
  const [stage, setStage] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [zoomLogo, setZoomLogo] = useState(false);
  const [mobile, setMobile] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [loading, setLoading] = useState(false)

  const newUser = true;

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

        console.log(response, " response")
  
        if (response.status === 200) {
          // OTP sent successfully, move to OTP entry stage
          console.log(response.data)
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
    console.log("Verifying OTP:", otp, "for phone:", phone);
    // setLoading(true)
    try {
      const response = await axios.post("https://echo-pay.onrender.com/api/verify-otp", {
        otp,
        phone
        
      })

      console.log(response.data, "fom otp")
      if (response.status === 200) {
        // Mark as verified and proceed to next stage
        console.log(response.data)
        setIsVerifying(false);
        setIsVerified(true);
        setStage(6); // Proceed to password setup or dashboard
      } else {
        // Handle OTP verification failure
        console.error("OTP verification failed");
        setIsVerifying(false);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    setIsVerifying(false);
    }
  };

  const handlePasswordVerification = (password: string) => {
    //if user is existing user then redirect to dashboard

    // move to language selection stage
    setStage(7);
    console.log(password);
  };

  const onLanguageSelection = () => {
    // TODO: save info to database
    // redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="w-full h-full flex flex-col gap-10 relative">
      <div className="h-screen w-full flex flex-col p-3 items-center justify-center">
        {showLogo && (
          <motion.div
            className={`transition-transform duration-1000 ${
              zoomLogo ? "scale-110" : "scale-100"
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
              setStage={setStage}
              onVerify={(otp, phone) =>handleOTPVerification(otp, phone)}
            />
          </SlideContainer>
        )}
      </div>

      {/* if verified and is new user */}
      {stage === 6 && newUser && isVerified && (
        <SlideContainer custom={stage}>
          <UpsetPassword onFinish={handlePasswordVerification} />
        </SlideContainer>
      )}

      {/* if verified and is existing user */}
      {stage === 6 && !newUser && isVerified && (
        <SlideContainer custom={stage}>
          <UpsetPassword onFinish={handlePasswordVerification} />
        </SlideContainer>
      )}

      {/* after password creation for new users Language selection*/}
      {stage === 7 && newUser && isVerified && (
        <SlideContainer custom={stage}>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            onContinue={onLanguageSelection}
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
