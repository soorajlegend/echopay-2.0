"use server";

import { EchopayTextAssistantPrompt } from "@/prompts/echopay-text-assistant";
// import OpenAI from "openai";
import Groq from "groq-sdk";

// const openai = new OpenAI();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export type ChatStructure = {
  role: "user" | "assistant";
  content: string;
};

export type NewChat = {
  prompt: string;
  memory: ChatStructure[];
};

type ChatData = {
  messages: ChatStructure[];
  beneficiaries: string;
  transactions: string;
  name: string;
  balance: number;
  records: string;
};

export async function EchoTextChat(data: ChatData) {
  try {
    const { messages, beneficiaries, transactions, name, balance, records } =
      data;

    const completion = await groq.chat.completions.create({
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
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      top_p: 1,
      stream: false,
      response_format: {
        type: "json_object",
      },
      stop: null,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.log(error);
    return "";
  }
}
