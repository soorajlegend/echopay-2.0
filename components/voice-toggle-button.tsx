import React from "react";
import { Mic } from "lucide-react";
import useVoice from "@/hooks/use-voice";

export default function VoiceToggleButton() {
  const { active, setActive } = useVoice();
  return (
    <button
      aria-label="Toggle voice mode"
      onClick={() => setActive(true)}
      disabled={active}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
    >
      <Mic className="w-5 h-5" />
    </button>
  );
}
