"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, Mic, Pause, Play, Send, X } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const VoicePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
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

      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioData(blob);
        // Automatically send audio when recording stops
        sendAudio(blob);
      };

      mediaRecorderRef.current.start();
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
        .map((value) => value / 255);
      setVisualizerData(normalizedData);
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioData(null);
    setVisualizerData([]);
  };

  const sendAudio = async (blob: Blob) => {
    if (!blob) return;

    try {
      const formData = new FormData();
      formData.append("audio", blob);

      await axios.post(
        "https://raj-assistant-api.vercel.app/api/echopay-models/voice",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset after successful send
      setAudioData(null);
      setVisualizerData([]);
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  return (
    <div className="relative flex flex-col w-full max-w-lg mx-auto h-screen p-4 pt-0">
      <div className="flex items-center justify-between sticky top-0 bg-white px-4 py-2">
        <Link href="/chat" className="flex items-center">
          <ChevronLeft className="w-10 h-10 p-1.5" />
          <h2 className="text-xl font-medium">Voice Message</h2>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="flex-1 flex items-center justify-center w-full max-w-lg mx-auto">
          <div className="flex gap-1 h-40 max-w-xs mx-auto items-center">
            {visualizerData.map((value, index) => (
              <div
                key={index}
                className="w-1.5 bg-blue-500 rounded-full"
                style={{
                  height: `${value * 100}%`,
                  transition: "height 0.05s ease",
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-full flex justify-evenly gap-4 p-4 bg-white fixed bottom-0 left-0">
          {isRecording ? (
            <>
              <button
                onClick={cancelRecording}
                className="w-full p-4 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center"
              >
                <X className="w-8 h-8 text-red-600" />
              </button>

              <button
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="w-full p-4 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                {isPaused ? (
                  <Play className="w-8 h-8 text-gray-600" />
                ) : (
                  <Pause className="w-8 h-8 text-gray-600" />
                )}
              </button>

              <button
                onClick={stopRecording}
                className="w-full p-4 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
            </>
          ) : (
            <button
              onClick={startRecording}
              className="w-full p-4 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center col-span-3"
            >
              <Mic className="w-8 h-8 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoicePage;
