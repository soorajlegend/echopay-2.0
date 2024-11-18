"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, Mic, Pause, Play, X, SendHorizonal } from "lucide-react";
import axios from "axios";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface RecorderProps {
  isDrawer?: boolean;
  isOpen?: boolean;
}

const Recorder = ({ isDrawer = false, isOpen = false }: RecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<Window["SpeechRecognition"] | null>(null);

  useEffect(() => {
    if (isDrawer && isOpen) {
      startRecording();
    }
  }, [isDrawer, isOpen]);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        let currentInterim = "";

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        setTranscript(finalTranscript);
        setInterimTranscript(currentInterim);
      };
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      setIsRecording(true);
      visualize();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const visualize = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const draw = () => {
      analyserRef.current!.getByteFrequencyData(dataArray);
      const normalizedData = Array.from(dataArray)
        .slice(0, 50)
        .map((value) => value / 255)
        .reverse();
      setVisualizerData(normalizedData);
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const pauseRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.start();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setIsPaused(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setInterimTranscript("");
      // Send the transcript instead of audio
      sendTranscript();
    }
  };

  const cancelRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    stopRecording();
    setVisualizerData([]);
    setTranscript("");
    setInterimTranscript("");
  };

  const sendTranscript = async () => {
    if (!transcript.trim()) return;

    try {
      await axios.post(
        "https://raj-assistant-api.vercel.app/api/echopay-models/voice",
        { text: transcript },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Reset after successful send
      setVisualizerData([]);
      setTranscript("");
      setInterimTranscript("");
    } catch (error) {
      console.error("Error sending transcript:", error);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col items-center">
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          <div
            className={`flex w-auto gap-1 h-20 max-w-xs mx-auto items-center justify-center ${
              isPaused ? "opacity-50" : ""
            }`}
          >
            {visualizerData.map((value, index) => (
              <div
                key={index}
                className={`w-1.5 rounded-full ${
                  isPaused ? "bg-rose-500" : "bg-theme-primary"
                }`}
                style={{
                  height: `${value * 100}%`,
                  transition: "height 0.05s ease",
                }}
              />
            ))}
          </div>
          {(transcript || interimTranscript) && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-xs text-sm">
              {transcript}
              <span className="text-gray-500 text-center">
                {interimTranscript}
              </span>
            </div>
          )}
        </div>

        <div className="w-full flex justify-evenly gap-4 p-4 bg-white fixed max-w-lg mx-auto bottom-0 left-0">
          {isRecording && (
            <>
              <button
                onClick={cancelRecording}
                className="w-16 h-16 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center aspect-square"
              >
                <X className="w-8 h-8 text-red-600" />
              </button>

              <button
                onClick={isPaused ? resumeRecording : pauseRecording}
                className={`w-16 h-16 rounded-full ${
                  isPaused
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-100 hover:bg-gray-200"
                } flex items-center justify-center aspect-square`}
              >
                {isPaused ? (
                  <Play className="w-8 h-8 text-white" />
                ) : (
                  <Pause className="w-8 h-8 text-gray-600" />
                )}
              </button>

              <button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-theme-primary hover:opacity-90 flex items-center justify-center aspect-square"
              >
                <SendHorizonal className="w-8 h-8 text-white" />
              </button>
            </>
          )}

          {!isRecording && !isDrawer && (
            <button
              onClick={startRecording}
              className="w-16 h-16 mx-auto rounded-full bg-theme-primary hover:opacity-90 flex items-center justify-center aspect-square"
            >
              <Mic className="w-8 h-8 text-white" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Recorder;
