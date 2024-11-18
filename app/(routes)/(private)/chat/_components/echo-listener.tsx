"use client";

import React, { useEffect, useState } from "react";
import Echo from "./echo";
import useEcho from "@/hooks/use-echo";

const EchoListener = () => {
  const { setOpenEcho } = useEcho();

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
          setOpenEcho(true);
          recognition.stop();
          // Don't restart recognition after trigger word detected
          return;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.log("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        console.error("Microphone access denied");
      }
      recognition.stop();
    };

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
    }

    return () => {
      recognition.stop();
    };
  }, []);

  return <Echo />;
};

export default EchoListener;
