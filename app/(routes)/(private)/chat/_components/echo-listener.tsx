"use client";

import React, { useEffect } from "react";
import Echo from "./echo";
import useEcho from "@/hooks/use-echo";

const EchoListener = () => {
  const { openEcho, setOpenEcho } = useEcho();

  useEffect(() => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let stream: MediaStream | null = null;

    recognition.onresult = async (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase();
        console.log("Heard:", transcript);

        if (
          !openEcho &&
          (transcript.includes("hey echo") || transcript.includes("echo"))
        ) {
          // Stop recognition and cleanup audio resources
          recognition.stop();
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            stream = null;
          }
          setOpenEcho(true);
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
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
    };

    const startListening = async () => {
      try {
        if (!openEcho) {
          // Get microphone access
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          recognition.start();
        }
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
    };

    startListening();

    return () => {
      recognition.stop();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [openEcho]);

  return <Echo />;
};

export default EchoListener;
