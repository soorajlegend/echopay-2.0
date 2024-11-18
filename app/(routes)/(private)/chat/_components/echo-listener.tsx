"use client";

import React, { useEffect, useState } from "react";
import Echo from "./echo";

const EchoListener = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true; // Changed to true to get interim results
    recognition.lang = "en-US"; // Set language explicitly

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        console.log("Heard:", transcript); // Debug what's being heard

        if (transcript.includes("hey echo") || transcript.includes("echo")) {
          console.log("Trigger word detected!"); // Debug trigger detection
          setIsOpen(true);
          recognition.stop();
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.log("Speech recognition error:", event.error); // More visible error logging
      if (event.error === "not-allowed") {
        console.error("Microphone access denied");
      } else {
        if (!isOpen) {
          recognition.stop();
          setTimeout(() => {
            console.log("Attempting to restart recognition..."); // Debug restart attempts
            recognition.start();
          }, 1000);
        }
      }
    };

    recognition.onstart = () => {
      console.log("Speech recognition started"); // Debug when recognition starts
    };

    recognition.onend = () => {
      console.log("Speech recognition ended"); // Debug when recognition ends
      if (!isOpen) {
        console.log("Restarting recognition..."); // Debug restart
        recognition.start();
      }
    };

    if (!isOpen) {
      try {
        recognition.start();
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
    }

    return () => {
      recognition.stop();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return <Echo isOpen={isOpen} setIsOpen={setIsOpen} />;
};

export default EchoListener;
