import React from "react";
import { Mic, X, RotateCcw } from "lucide-react";
import useVoiceRecorder from "@/hooks/use-voice-recorder";
import useVoice from "@/hooks/use-voice";
import useChat from "@/hooks/use-chat";
import { speak } from "@/lib/utils";
import ThreeDotLoader from "@/components/ui/three-dot-loader";

export default function VoiceUI() {
  const { start, stop } = useVoiceRecorder();
  const { status, setStatus, active, setActive } = useVoice();
  const { chats } = useChat();

  React.useEffect(() => {
    if (active && status === "idle") {
      start();
    }
  }, [active, status, start]);

  const repeatLast = async () => {
    const last = [...chats].reverse().find((c) => c.role === "assistant");
    if (last) {
      if (status === "recording") {
        stop();
      }
      setStatus("speaking");
      await speak(last.content);
      setStatus("idle");
    }
  };

  const cancel = () => {
    if (status === "recording") {
      stop();
    }
    setStatus("idle");
    if (active) setActive(false);
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 text-white">
      <button
        aria-label="Close voice mode"
        onClick={cancel}
        className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"
      >
        <X className="w-4 h-4" />
      </button>

      {status === "recording" && (
        <>
          <div className="relative flex flex-col items-center">
            <div className="absolute -inset-4 rounded-full border border-white/40 animate-ping" />
            <Mic className="w-20 h-20" />
          </div>
          <p className="mt-4 text-sm">Listening...</p>
        </>
      )}

      {status === "processing" && (
        <div className="flex flex-col items-center">
          <ThreeDotLoader />
          <p className="mt-4 text-sm">Processing...</p>
        </div>
      )}

      {status === "speaking" && (
        <div className="flex flex-col items-center">
          <ThreeDotLoader />
          <p className="mt-4 text-sm">Speaking...</p>
        </div>
      )}

      <button
        onClick={repeatLast}
        className="mt-6 flex items-center gap-1 text-sm opacity-80 hover:opacity-100"
      >
        <RotateCcw className="w-4 h-4" /> Repeat last reply
      </button>
    </div>
  );
}
