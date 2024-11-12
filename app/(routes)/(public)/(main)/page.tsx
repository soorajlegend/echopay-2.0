"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/language-selector";

const OnboardingPage = () => {
  const [stage, setStage] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [zoomLogo, setZoomLogo] = useState(false);

  const stages = [
    {
      image: "stage1.png",
      text: "Your Future, Your Finance, Your Way",
      subText: "Join the future of payments, effortlessly",
    },
    {
      image: "stage2.png",
      text: "Simple. Secure. Smart",
      subText: "Experience the power of voice and chat for your finances",
    },
    {
      image: "stage3.png",
      text: "Your Money, Your Control",
      subText: "Manage your finances anytime, anywhere, anyhow",
    },
  ];

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
    if (stage < 4) {
      setStage(stage + 1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 900 : -900,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 900 : -900,
        opacity: 0,
      };
    },
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

        <AnimatePresence initial={false} custom={stage}>
          {!showLogo && stage >= 1 && stage <= 3 && (
            <motion.div
              key={stage}
              custom={stage}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="text-center w-[90%] absolute"
            >
              {stage && stage < 3 ? (
                <div className="flex justify-end mx-auto md:w-[84%]">
                  <Button
                    onClick={() => setStage(4)}
                    className="p-0"
                    variant="link"
                  >
                    Skip
                  </Button>
                </div>
              ) : (
                ""
              )}
              <div className="">
                <div className="flex justify-center ">
                  <Image
                    src={stages[stage - 1].image}
                    alt={`Stage ${stage}`}
                    width={382}
                    height={400}
                    className="mb-[80px] text-center"
                  />
                </div>
                <div className="">
                  <p className="text-[20px] font-semibold text-[#1A1A1A]">
                    {stages[stage - 1].text}
                  </p>
                  <p className="text-[#434343] mt-[6px] mx-auto font-medium text-[18px]">
                    {stages[stage - 1].subText}
                  </p>

                  <div className="flex justify-center items-center mt-6 mb-8">
                    {[1, 2, 3].map((dot) => (
                      <motion.div
                        key={dot}
                        className={`mx-1 rounded-full ${
                          dot === stage ? "bg-[#003056]" : "bg-gray-300"
                        }`}
                        initial={false}
                        animate={{
                          width: dot === stage ? 30 : 15,
                          height: 9,
                        }}
                        transition={{ duration: 0.3 }}
                        aria-label={
                          dot === stage
                            ? `Current stage ${dot}`
                            : `Stage ${dot}`
                        }
                      />
                    ))}
                  </div>

                  <div className="w-[90%] mx-auto">
                    <Button
                      className="lg:mt-[20px] mt-[40px] text-[18px] font-medium bg-[#003056] hover:bg-[#0c2941] text-[#FAFAFA] w-full py-[24px]"
                      onClick={handleContinue}
                    >
                      {stage === 3 ? "Get Started" : "Continue"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {stage === 4 && <LanguageSelector />}
      </div>
    </div>
  );
};

export default OnboardingPage;
