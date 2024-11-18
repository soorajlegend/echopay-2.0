"use client";

import React, { useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import Recorder from "./recorder";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const Assistant = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (transcript.includes("hey echo") || transcript.includes("echo")) {
        setOpen(true);
        recognition.stop(); // Stop listening when drawer opens
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        console.error("Microphone access denied");
      } else {
        console.error("Speech recognition error:", event.error);
        // Only attempt restart if drawer is closed
        if (!open) {
          recognition.stop();
          setTimeout(() => recognition.start(), 1000);
        }
      }
    };

    recognition.onend = () => {
      // Only restart if drawer is closed
      if (!open) {
        recognition.start();
      }
    };

    // Only start initially if drawer is closed
    if (!open) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [open]);

  return (
    <Drawer open onClose={() => setOpen(false)}>
      <DrawerContent>
        <Recorder isDrawer isOpen={open} />
      </DrawerContent>
    </Drawer>
  );
};

export default Assistant;
