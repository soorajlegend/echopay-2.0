"use server";

import { EchopayTextAssistantPrompt } from "@/prompts/echopay-text-assistant";
import OpenAI from "openai";
import Groq from "groq-sdk";

// const openai = new OpenAI();

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const apiKey1 = process.env.GROQ_API_KEY;
const apiKey2 = process.env.GROQ_API_KEY_I;
const apiKey3 = process.env.GROQ_API_KEY_II;
const apiKey4 = process.env.GROQ_API_KEY_III;
const apiKey5 = process.env.GROQ_API_KEY_IV;

const apiKeys = [apiKey1, apiKey2, apiKey3, apiKey4, apiKey5];

const randomApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

const groq = new Groq({ apiKey: randomApiKey });

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
      model: "llama-3.1-70b-versatile",
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
