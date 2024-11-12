"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import MobileInput from "./_components/mobile-input";
import SplashSlides from "./_components/splash-slides";
import OTPVerification from "./_components/otp-verification";

const OnboardingPage = () => {
  const [stage, setStage] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [zoomLogo, setZoomLogo] = useState(false);

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
  };

  return (
    <div className="w-full h-full flex flex-col gap-10 relative">
      <div className="min-h-screen flex flex-col items-center justify-center">
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

        {stage === 4 && <MobileInput />}

        {/* verification stage */}
        {stage === 5 && <OTPVerification />}

      </div>
    </div>
  );
};

export default OnboardingPage;
