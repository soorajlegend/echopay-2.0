"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { slideVariants } from "@/components/slide-container";

interface SplashslidesProps {
  show: boolean;
  stage: number;
  setStage: (value: number) => void;
  onContinue: () => void;
}

const SplashSlides = ({
  show,
  stage,
  setStage,
  onContinue,
}: SplashslidesProps) => {
  const stages = [
    {
      image: "/stage1.png",
      text: "Your Future, Your Finance, Your Way",
      subText: "Join the future of payments, effortlessly",
    },
    {
      image: "/stage2.png",
      text: "Simple. Secure. Smart",
      subText: "Experience the power of voice and chat for your finances",
    },
    {
      image: "/stage3.png",
      text: "Your Money, Your Control",
      subText: "Manage your finances anytime, anywhere, anyhow",
    },
  ];

  return (
    <AnimatePresence initial={false} custom={stage}>
      {!show && stage >= 1 && stage <= 3 && (
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
          className="text-center w-full h-full flex flex-col absolute p-3"
        >
          {stage && stage < 3 ? (
            <div className="flex justify-end">
              <Button
                onClick={() => setStage(4)}
                className="p-0 ml-auto w-auto"
                variant="link"
              >
                Skip
              </Button>
            </div>
          ) : (
            ""
          )}
          <div className="flex-1 flex flex-col gap-10 w-full h-full">
            <div className="flex justify-center ">
              <Image
                src={stages[stage - 1].image}
                alt={`Stage ${stage}`}
                width={382}
                height={400}
                className="text-center"
              />
            </div>
            <div className="flex flex-col gap-3 justify-between w-full h-full">
              <div className="flex flex-col w-full gap-3">
                <p className="text-[20px] font-semibold text-[#1A1A1A]">
                  {stages[stage - 1].text}
                </p>
                <p className="text-[#020202] mx-auto font-medium text-[18px]">
                  {stages[stage - 1].subText}
                </p>
                <div className="flex justify-center items-center ">
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
                        dot === stage ? `Current stage ${dot}` : `Stage ${dot}`
                      }
                    />
                  ))}
                </div>
              </div>
              <Button
                size="lg"
                className="text-[18px] py-[24px] my-0 mb-10 font-medium bg-[#003056] hover:bg-[#0c2941] text-[#FAFAFA] w-full"
                onClick={onContinue}
              >
                {stage === 3 ? "Get Started" : "Continue"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashSlides;
