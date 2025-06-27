import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
];

function countDoubleQuotes(str: string) {
  // Use a regular expression to find all occurrences of double quotes
  const matches = str.match(/"/g);

  // If matches exist, return the length of the matches array, otherwise return 0
  return matches ? matches.length : 0;
}

import { TTS } from "@/actions/voice";

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

export const stopSpeaking = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (currentUtterance) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const speak = async (text: string) => {
  stopSpeaking();
  try {
    const audioSource = await TTS(text);
    const audio = new Audio(audioSource);
    currentAudio = audio;

    if (audio.setSinkId && typeof audio.setSinkId === "function") {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const outputs = devices.filter((d) => d.kind === "audiooutput");
        const bluetooth = outputs.find(
          (d) =>
            d.label.toLowerCase().includes("bluetooth") ||
            d.label.toLowerCase().includes("headphone"),
        );
        if (bluetooth) {
          await (audio as any).setSinkId(bluetooth.deviceId);
        }
      } catch (err) {
        console.warn("Unable to set audio output device:", err);
      }
    }

    return new Promise<void>((resolve) => {
      audio.onended = () => {
        currentAudio = null;
        resolve();
      };
      audio.onerror = () => {
        currentAudio = null;
        resolve();
      };
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        currentAudio = null;
        resolve();
      });
    });
  } catch (error) {
    console.error("Error in text-to-speech:", error);
  }

  return new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;
    utterance.onend = () => {
      currentUtterance = null;
      resolve();
    };
    utterance.onerror = () => {
      currentUtterance = null;
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
};

export const playAudio = async (audioSource: string) => {
  stopSpeaking();
  try {
    const audio = new Audio(audioSource);
    currentAudio = audio;

    if (audio.setSinkId && typeof audio.setSinkId === "function") {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const outputs = devices.filter((d) => d.kind === "audiooutput");
        const bluetooth = outputs.find(
          (d) =>
            d.label.toLowerCase().includes("bluetooth") ||
            d.label.toLowerCase().includes("headphone")
        );
        if (bluetooth) {
          await (audio as any).setSinkId(bluetooth.deviceId);
        }
      } catch (err) {
        console.warn("Unable to set audio output device:", err);
      }
    }

    return new Promise<void>((resolve) => {
      audio.onended = () => {
        currentAudio = null;
        resolve();
      };
      audio.onerror = () => {
        currentAudio = null;
        resolve();
      };
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        currentAudio = null;
        resolve();
      });
    });
  } catch (error) {
    console.error("Error playing audio:", error);
  }
  return Promise.resolve();
};

export function completeJsonStructure(jsonString: string) {
  // Initialize arrays to store opening and closing characters
  const closers = [];

  // Iterate through the string to track opening and closing characters
  for (let i = 0; i < jsonString?.length; i++) {
    const char = jsonString[i];
    if (char === "{") {
      closers.push("}");
    } else if (char === "[") {
      closers.push("]");
    }

    if (char === "}" || char === "]") {
      closers.pop();
    } else if (char === '"') {
      const count = countDoubleQuotes(jsonString.slice(0, i + 1));
      if (count % 2 === 1) {
        closers.push('"');
      } else {
        closers.pop();
      }
    }
  }

  // Append necessary closing characters to complete the structure
  //  const closingCharacters = [...openers.reverse(), ...closers.reverse()].join('');
  return (
    jsonString +
    closers.reverse().join(`
 `)
  );
}

export function isValidJson(text: string) {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const cleanPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/\D/g, "");
};

export const formatBalance = (balance: number): string => {
  return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
