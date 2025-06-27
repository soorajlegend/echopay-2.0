import { useCallback, useRef, useState } from "react";
import useVoice from "@/hooks/use-voice";
import { EchoVoiceChat } from "@/actions/voice-chat";
import useChat from "@/hooks/use-chat";
import useBeneficiary from "@/hooks/use-beneficiary";
import useTransaction from "@/hooks/use-transaction";
import useNewTransaction from "@/hooks/use-new-transaction";
import useShowChart from "@/hooks/use-show-chart";
import useUserInfo from "@/hooks/use-userinfo";
import useBookKeeping from "@/hooks/use-book-keeping";
import { owner } from "@/store";
import { nanoid } from "nanoid";
import { Chat } from "@/types";
import { toast } from "sonner";
import { speak, stopSpeaking } from "@/lib/utils";

export default function useVoiceRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const startRef = useRef<() => void>(() => {});
  const [recording, setRecording] = useState(false);
  const recordingRef = useRef(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const speechDetectedRef = useRef(false);
  const abortRef = useRef(false);

  const start = useCallback(async () => {
    if (recordingRef.current) return;
    stopSpeaking();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    abortRef.current = false;
    speechDetectedRef.current = false;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      toast.error("Microphone access denied");
      return;
    }
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    const chunks: Blob[] = [];

    // setup audio context for silence detection
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    analyserRef.current = analyser;
    let silenceStart = Date.now();
    silenceIntervalRef.current = setInterval(() => {
      if (!analyserRef.current || !recordingRef.current) return;

      const data = new Uint8Array(analyserRef.current.fftSize);
      analyserRef.current.getByteTimeDomainData(data);
      const avg =
        data.reduce((sum, v) => sum + Math.abs(v - 128), 0) / data.length;
      if (avg > 5) {
        speechDetectedRef.current = true;
        silenceStart = Date.now();
      } else if (Date.now() - silenceStart > 2500) {
        stop();
      }
    }, 200);

    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      let objectUrl: string | null = null;
      setRecording(false);
      recordingRef.current = false;
      useVoice.getState().stopRecording();
      stream.getTracks().forEach((t) => t.stop());
      if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
      silenceIntervalRef.current = null;
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      if (abortRef.current) {
        abortRef.current = false;
        useVoice.getState().setStatus("idle");
        if (useVoice.getState().active) {
          startRef.current();
        }
        return;
      }

      if (!speechDetectedRef.current || blob.size === 0) {
        useVoice.getState().setStatus("idle");
        if (useVoice.getState().active) {
          startRef.current();
        }
        return;
      }

      objectUrl = URL.createObjectURL(blob);
      setAudioUrl(objectUrl);

      try {
        const buffer = await blob.arrayBuffer();
        const bytes = Array.from(new Uint8Array(buffer));
        const base64 = btoa(String.fromCharCode(...bytes));

        const { chats } = useChat.getState();
        const { beneficiaries } = useBeneficiary.getState();
        const { transactions } = useTransaction.getState();
        const { setNewTransaction } = useNewTransaction.getState();
        const { setShowChart } = useShowChart.getState();
        const { records, addRecord } = useBookKeeping.getState();
        const { info } = useUserInfo.getState();
        const user = info || owner;
        if (!user) throw new Error("Unauthorized");

        const messages = chats.map((chat) => ({
          role:
            chat.role === "user"
              ? "user"
              : ("assistant" as "user" | "assistant"),
          content: chat.content,
        }));

        const data = {
          audio: base64,
          messages,
          beneficiaries: JSON.stringify(
            beneficiaries.map((b) => `${b.acc_name} - ${b.id} |`),
          ),
          transactions: JSON.stringify(
            transactions.map(
              (t) =>
                `${t.isCredit ? t.senderName : t.receiverName} - ${
                  t.isCredit ? "Credit" : "Debit"
                } - ₦${t.amount} - ${t.date} |`,
            ),
          ),
          records: JSON.stringify(
            records.map((r) => `${r.narration} - ₦${r.amount} - ${r.date} |`),
          ),
          name: user.fullname || "",
          balance: Number(user.balance) || 0,
        };

        const result = await EchoVoiceChat(data);
        if (result.transcript) {
          useVoice.getState().addTranscript(result.transcript);
        }

        if (result.reply) {
          const jsonData = JSON.parse(result.reply || "{}");
          if (jsonData.newTransaction) {
            setNewTransaction(jsonData.newTransaction);
          }
          if (jsonData.message) {
            const modelMessage: Chat = {
              id: nanoid(),
              role: "assistant",
              content: jsonData.message,
              createdAt: new Date(),
            };
            useChat.getState().addChat(modelMessage);
            if (useVoice.getState().active) {
              useVoice.getState().setStatus("speaking");
              await speak(jsonData.message);
            }
          }
          if (jsonData?.transactionChart) {
            setShowChart("TRANSACTIONS");
          }
          if (jsonData?.newRecord) {
            const record = {
              id: nanoid(),
              amount: jsonData.newRecord.amount,
              narration: jsonData.newRecord.narration,
              date: new Date().toISOString(),
            };
            addRecord(record);
          }
          if (jsonData?.incomeVsSpendingChart) {
            setShowChart("INCOME_VS_SPENDING");
          }
          if (jsonData?.beneficiaryChart) {
            setShowChart("BENEFICIARY_CHART");
          }
        }
      } catch (err) {
        console.error("voice pipeline error", err);
        toast.error("Failed to process voice message. Please try again.");
      } finally {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
          setAudioUrl(null);
        } else if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
          setAudioUrl(null);
        }
        useVoice.getState().setStatus("idle");
        if (useVoice.getState().active) {
          startRef.current();
        }
      }
    };

    recorder.start();
    setRecording(true);
    recordingRef.current = true;
    useVoice.getState().startRecording();
    stopTimeoutRef.current = setTimeout(() => {
      stop();
    }, 30000);
  }, []);
  startRef.current = start;

  const stop = useCallback((abort = false) => {
    abortRef.current = abort;
    if (!recordingRef.current) return;
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
    silenceIntervalRef.current = null;
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    mediaRecorderRef.current?.stop();
    recordingRef.current = false;
  }, []);

  return {
    start,
    stop,
    recording,
    audioUrl,
  };
}
