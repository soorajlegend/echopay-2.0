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
      }
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  return (
    <Drawer open={open}>
      <DrawerContent>
        <Recorder isDrawer isOpen={open} />
      </DrawerContent>
    </Drawer>
  );
};

export default Assistant;
