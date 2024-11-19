"use server";

import { EchopayVoiceAssistantPrompt } from "@/prompts/echopay-voice-assistant";
import OpenAI from "openai";
// import Groq from "groq-sdk";

const openai = new OpenAI();

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
};

export async function EchoVoiceChat(data: ChatData) {
  try {
    const { messages, beneficiaries, transactions, name, balance } = data;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: EchopayVoiceAssistantPrompt({
            name,
            balance: balance.toString(),
            transactions,
            beneficiaries,
          }),
        },
        ...messages,
      ],
      response_format: {
        type: "json_object",
      },
      stream: false,
      temperature: 1.5,
    });

    return completion.choices[0].message.content;

    // const chatCompletion = await groq.chat.completions.create({
    //   messages: [
    //     {
    //       role: "system",
    //       content: EchopayTextAssistantPrompt({
    //         name,
    //         balance,
    //         transactions,
    //         beneficiaries,
    //       }),
    //     },
    //     ...messages,
    //   ],
    //   model: "llama-3.1-70b-versatile",
    //   temperature: 1,
    //   top_p: 1,
    //   stream: false,
    //   response_format: {
    //     type: "json_object",
    //   },
    //   stop: null,
    // });

    // return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.log(error);
    return "";
  }
}
