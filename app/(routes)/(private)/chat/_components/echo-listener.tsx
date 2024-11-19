"use client";

import React, { useEffect, useState } from "react";
import Echo from "./echo";

const EchoListener = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        console.log("Heard:", transcript);

        if (transcript.includes("hey echo") || transcript.includes("echo")) {
          console.log("Trigger word detected!");
          setIsOpen(true);
          recognition.stop();
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.log("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        console.error("Microphone access denied");
      } else {
        recognition.stop();
        setTimeout(() => {
          console.log("Attempting to restart recognition...");
          recognition.start();
        }, 1000);
      }
    };

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      // Always restart recognition unless there was an error
      setTimeout(() => {
        if (!recognition.error) {
          console.log("Restarting recognition...");
          try {
            recognition.start();
          } catch (err) {
            console.error("Failed to restart recognition:", err);
          }
        }
      }, 1000);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
    }

    return () => {
      recognition.stop();
    };
  }, []); // Remove isOpen dependency

  if (!isOpen) return null;

  return <Echo isOpen={isOpen} setIsOpen={setIsOpen} />;
};

export default EchoListener;
