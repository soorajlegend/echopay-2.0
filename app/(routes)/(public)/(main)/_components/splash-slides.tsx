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
          className="text-center w-full h-full absolute p-3"
        >
          {stage && stage < 3 ? (
            <div className="flex justify-end mx-auto">
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
                      dot === stage ? `Current stage ${dot}` : `Stage ${dot}`
                    }
                  />
                ))}
              </div>

              <div className="w-full pb-10">
                <Button
                  className="lg:mt-[20px] mt-[40px] text-[18px] font-medium bg-[#003056] hover:bg-[#0c2941] text-[#FAFAFA] w-full py-[24px]"
                  onClick={onContinue}
                >
                  {stage === 3 ? "Get Started" : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashSlides;
