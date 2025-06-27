"use server";

import OpenAI from "openai";

const openai = new OpenAI();

export async function TTS(text: string) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  const base64Audio = buffer.toString("base64");

  return `data:audio/mpeg;base64,${base64Audio}`;
}
