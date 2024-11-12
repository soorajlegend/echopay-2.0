"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import MobileInput from "./_components/mobile-input";
import SplashSlides from "./_components/splash-slides";
import OTPVerification from "./_components/otp-verification";
import { Loader2 } from "lucide-react";
import UpsetPassword from "@/components/ui/upset-password";
import SlideContainer from "@/components/slide-container";

const OnboardingPage = () => {
  const [stage, setStage] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [zoomLogo, setZoomLogo] = useState(false);
  const [mobile, setMobile] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const newUser = true;

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

  const handleContinue = () => {
    if (stage < 5) {
      setStage(stage + 1);
    }

    console.log(isVerifying, isVerified);
  };

  const handleOTPVerification = async (otp: string) => {
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);

      console.log(otp);
      setStage(6);
    }, 3000);
  };

  const handlePasswordVerification = (password: string) => {
    console.log(password);
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
            />
          </SlideContainer>
        )}

        {/* verification stage */}
        {stage === 5 && (
          <SlideContainer custom={stage}>
            <OTPVerification
              mobile={mobile}
              setStage={setStage}
              onVerify={handleOTPVerification}
            />
          </SlideContainer>
        )}
      </div>

      {/* if verified and is new user */}
      {newUser && isVerified && (
        <SlideContainer custom={stage}>
          <UpsetPassword onFinish={handlePasswordVerification} />
        </SlideContainer>
      )}

      {/* if verified and is existing user */}
      {!newUser && isVerified && (
        <SlideContainer custom={stage}>
          <UpsetPassword onFinish={handlePasswordVerification} />
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
