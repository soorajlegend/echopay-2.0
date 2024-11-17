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

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
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
        .slice(0, 50) // Increased number of bars
        .map(value => value / 255);
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
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioData(null);
    setVisualizerData([]);
  };

  const sendAudio = async () => {
    if (!audioData) return;

    try {
      const formData = new FormData();
      formData.append("audio", audioData);

      await axios.post("https://raj-assistant-api.vercel.app/api/echopay-models/voice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset after successful send
      setAudioData(null);
      setVisualizerData([]);
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-screen p-4 pt-0">
      <div className="flex items-center justify-between sticky top-0 bg-white px-4 py-2">
        <Link href="/chat" className="flex items-center">
          <ChevronLeft className="w-10 h-10 p-1.5" />
          <h2 className="text-xl font-medium">Voice Message</h2>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="flex-1 flex items-center justify-center w-full max-w-lg mx-auto">
          <div className="flex gap-1 h-40 items-center">
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

        <div className="w-full grid grid-cols-3 gap-4 p-4 bg-white fixed bottom-0 left-0">
          {isRecording ? (
            <>
              <button
                onClick={cancelRecording}
                className="w-full p-4 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center"
              >
                <X className="w-6 h-6 text-red-600" />
              </button>
              
              <button
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="w-full p-4 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                {isPaused ? (
                  <Play className="w-6 h-6 text-gray-600" />
                ) : (
                  <Pause className="w-6 h-6 text-gray-600" />
                )}
              </button>

              <button
                onClick={stopRecording}
                className="w-full p-4 rounded-xl bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
              >
                <Mic className="w-6 h-6 text-white" />
              </button>
            </>
          ) : audioData ? (
            <>
              <button
                onClick={startRecording}
                className="w-full p-4 rounded-xl bg-blue-500 hover:bg-blue-600 flex items-center justify-center col-span-2"
              >
                <Mic className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={sendAudio}
                className="w-full p-4 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center"
              >
                <Send className="w-6 h-6 text-green-600" />
              </button>
            </>
          ) : (
            <button
              onClick={startRecording}
              className="w-full p-4 rounded-xl bg-blue-500 hover:bg-blue-600 flex items-center justify-center col-span-3"
            >
              <Mic className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoicePage;