"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isListening, setIsListening] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(0);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("");

          if (
            transcript.toLowerCase().includes("hey echo") ||
            transcript.toLowerCase().includes("echo")
          ) {
            setIsListening(true);
            setTimeout(() => setIsListening(false), 3000);
          }
        };

        recognitionRef.current.start();
      }
    }

    const animateGradient = () => {
      setGradientAngle((prev) => (prev + 1) % 360);
      requestAnimationFrame(animateGradient);
    };

    const animation = requestAnimationFrame(animateGradient);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      cancelAnimationFrame(animation);
    };
  }, []);

  return (
    <div
      className={cn("min-h-screen w-full relative p-6", isListening && "p-10")}
      style={{
        background: `linear-gradient(${gradientAngle}deg, 
          ${isListening ? "#4f46e5" : "#1a1a1a"}, 
          ${isListening ? "#9333ea" : "#2d2d2d"})`,
        transition: "background 0.5s ease",
      }}
    >
      <div className="w-full h-full bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
}
