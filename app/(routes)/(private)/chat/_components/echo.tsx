"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Mic,
  Pause,
  Play,
  X,
  SendHorizonal,
  Loader,
  Volume2,
} from "lucide-react";
import axios from "axios";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import useEcho from "@/hooks/use-echo";
import useChat from "@/hooks/use-chat";
import useTransaction from "@/hooks/use-transaction";
import useBeneficiary from "@/hooks/use-beneficiary";
import useUserInfo from "@/hooks/use-userinfo";
import { toast } from "sonner";
import { Chat, NewTransactionType } from "@/types";
import { nanoid } from "nanoid";
import { ChartType } from "./chart";
import TransactionChart from "./transaction-chart";
import ConfirmTransaction from "@/components/confirm-transaction";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const Echo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [newTransaction, setNewTransaction] =
    useState<NewTransactionType | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<Window["SpeechRecognition"] | null>(null);
  const [voiceChats, setVoiceChats] = useState<Chat[]>([]);
  const [chartType, setChartType] = useState<ChartType>(null);

  const { chats } = useChat();
  const { info } = useUserInfo();
  const { beneficiaries } = useBeneficiary();
  const { transactions } = useTransaction();
  const { openEcho, setOpenEcho } = useEcho();

  const speak = async (text: string): Promise<void> => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      return new Promise<void>((resolve) => {
        utterance.onend = () => resolve();
        window.speechSynthesis.speak(utterance);
      });
    }
  };

  useEffect(() => {
    if (openEcho) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      startRecording();
    } else {
      stopRecording();
    }
  }, [openEcho]);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US"; // Set language to English

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
      await speak("Hi");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up audio context and analyzer
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Initialize speech recognition if not already initialized
      if (
        !recognitionRef.current &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
      ) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US"; // Set language to English

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

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        console.error("Speech recognition not supported");
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
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Stop animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Stop all tracks from media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
        streamRef.current = null;
      }

      setIsRecording(false);
      setIsPaused(false);
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
    setOpenEcho(false);
  };

  const sendTranscript = async () => {
    if (!transcript.trim()) return;

    if (!info) {
      return toast.error("Unauthorized");
    }

    try {
      setIsThinking(true);

      const messages = [
        ...[...chats, ...voiceChats].map((chat) => ({
          role: chat.role === "model" ? "assistant" : "user",
          content: `${chat.content}`,
        })),
        {
          role: "user",
          content: `${transcript}`,
        },
      ];

      const data = JSON.stringify({
        messages,
        beneficiaries: JSON.stringify(
          beneficiaries.map((b) => `${b.acc_name} - ${b.id} |`)
        ),
        transactions: JSON.stringify(
          transactions.map(
            (t) =>
              `${t.isCredit ? t.senderName : t.receiverName} - ${
                t.isCredit ? "Credit" : "Debit"
              } - NGN${t.amount} - ${t.date} |`
          )
        ),
        name: info.fullname,
        balance: info.balance,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://raj-assistant-api.vercel.app/api/echopay-models/voice",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);
      const jsonData = JSON.parse(response.data);

      setIsThinking(false);

      if (jsonData.newTransaction) {
        setNewTransaction(jsonData.newTransaction);
      }

      if (jsonData.message) {
        setIsSpeaking(true);
        await speak(jsonData.message);
        setIsSpeaking(false);
        startRecording();

        const userMessage: Chat = {
          id: nanoid(),
          role: "user",
          content: transcript,
          createdAt: new Date(),
        };
        const modelMessage: Chat = {
          id: nanoid(),
          role: "model",
          content: jsonData.message,
          createdAt: new Date(),
        };

        setVoiceChats((state) => [...state, userMessage, modelMessage]);
      }

      if (jsonData.transactionChart) {
        setChartType("TRANSACTIONS");
      }

      // Reset after successful send
      setVisualizerData([]);
      setTranscript("");
      setInterimTranscript("");
      setOpenEcho(false);
    } catch (error) {
      console.error("Error sending transcript:", error);
      setIsThinking(false);
      setIsSpeaking(false);
      // Restart recording even if there's an error
      startRecording();
    }
  };

  return (
    <Drawer open={openEcho} onClose={() => setOpenEcho(false)}>
      <DrawerContent className="min-h-[60%] w-full">
        <div className="flex-1 flex flex-col items-center justify-between">
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
            {chartType === "TRANSACTIONS" && <TransactionChart />}
            <ConfirmTransaction
              data={newTransaction}
              setNewTransaction={setNewTransaction}
            />
            {isThinking && (
              <div className="flex items-center gap-2 mb-4">
                <Loader className="w-6 h-6 animate-spin text-theme-primary" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-6 h-6 animate-pulse text-theme-primary" />
                <span className="text-sm text-gray-600">Speaking...</span>
              </div>
            )}
            {!isThinking && !isSpeaking && (
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
            )}
            {(transcript || interimTranscript) && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-xs text-sm">
                {transcript}
                <span className="text-gray-500 text-center">
                  {interimTranscript}
                </span>
              </div>
            )}
          </div>

          <div className="w-full flex justify-evenly gap-4 p-4 pb-8 lg:pb-4 bg-white mt-auto sticky bottom-0 max-w-lg mx-auto">
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

            {!isRecording && (
              <button
                onClick={startRecording}
                className="w-16 h-16 mx-auto rounded-full bg-theme-primary hover:opacity-90 flex items-center justify-center aspect-square"
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Echo;
