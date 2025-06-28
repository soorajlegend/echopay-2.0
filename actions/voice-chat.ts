"use server";

import OpenAI, { toFile } from "openai";
import { EchopayTextAssistantPrompt } from "@/prompts/echopay-text-assistant";
import { ChatStructure } from "@/actions/text-chat";

const openai = new OpenAI();

export type VoiceChatData = {
  audio: string;
  messages: ChatStructure[];
  beneficiaries: string;
  transactions: string;
  name: string;
  balance: number;
  records: string;
};

export type VoiceChatResult = {
  transcript: string;
  replyText: string;
  replyAudio: string;
};

export async function EchoVoiceChat(data: VoiceChatData): Promise<VoiceChatResult> {
  const { audio, messages, beneficiaries, transactions, name, balance, records } = data;

  try {
    const file = await toFile(Buffer.from(audio, "base64"), "audio.webm");

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    const transcript = transcription.text || "";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: EchopayTextAssistantPrompt({
            name,
            balance: balance.toString(),
            transactions,
            beneficiaries,
            records,
          }),
        },
        ...messages,
        { role: "user", content: transcript },
      ],
      response_format: { type: "json_object" },

    });

    const replyText =
      completion.choices?.[0]?.message?.content || "";

    const speech = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: "nova",
      input: replyText,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await speech.arrayBuffer());
    const replyAudio = `data:audio/mpeg;base64,${buffer.toString("base64")}`;

    return { transcript, replyText, replyAudio };
  } catch (error) {
    console.error("voice chat failed", error);
    return { transcript: "", replyText: "", replyAudio: "" };
  }
}
