import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface SlideContainerProps {
  custom: string | number;
  children: React.ReactNode;
  className?: string;
}

export const slideVariants = {
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

const SlideContainer = ({
  custom,
  children,
  className,
}: SlideContainerProps) => {
  return (
    <AnimatePresence initial={false} custom={custom}>
      <motion.div
        key={custom}
        custom={custom}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        className={cn("text-center w-full absolute", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default SlideContainer;
