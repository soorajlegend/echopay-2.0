"use client";

import CustomTextareaForm from "@/components/ui/custom-textarea";
import { completeJsonStructure, isValidJson } from "@/lib/utils";
import { Chat, NewTransactionType } from "@/type";
import React, { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import ChatItem from "@/components/chat-item";

const name = "Suraj Muhammad";
const balance = 10000;
// dummu data
const transactions = `[
  {
    id: 1,
    name: "John Doe",
    amount: 100,
    date: "2024-10-15",
    type: "send",
  },
  {
    id: 2,
    name: "James Bond",
    amount: 200,
    date: "2024-10-14",
    type: "receive",
  },
  {
    id: 3,
    name: "Muhammad Ali",
    amount: 300,
    date: "2024-10-13",
    type: "send",
  },
]`;

const beneficiaries = `[
  {
    id: 1,
    name: "John Doe",
  },
  {
    id: 2,
    name: "James Bond",
  },
  {
    id: 3,
    name: "Muhammad Ali",
  },
]`;

const ChatPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  //  const { verified, info } = useUserInfo();

  const [unSavedPrompt, setUnSavedPrompt] = useState("");
  const [stream, setStream] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [newTransaction, setNewTransaction] =
    useState<NewTransactionType | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allChats]);

  useEffect(() => {
    if (stream === "") return;

    console.log(newTransaction, unSavedPrompt);

    const jsonStream = completeJsonStructure(stream);
    if (!isValidJson(jsonStream)) {
      return;
    }

    const jsonData = JSON.parse(jsonStream);

    if (!isStreaming) {
      if (jsonData.newTransaction) {
        setNewTransaction(jsonData.newTransaction);
      }
    }

    const updateLastObject = () => {
      const lastChat = allChats[allChats.length - 1];
      const updatedArray = [...allChats];
      updatedArray[allChats.length - 1] = {
        ...updatedArray[allChats.length - 1],
        ...{
          ...lastChat,
          content: jsonData.message,
        },
      };
      setAllChats(updatedArray);
    };

    updateLastObject();
  }, [stream, isStreaming]);

  const handleSubmit = async () => {
    if (!newMessage) return;

    const history = [...allChats];
    setIsStreaming(true);

    const filteredPrompt = newMessage;

    setAllChats((state) => [
      ...state,
      {
        id: nanoid(),
        role: "user",
        content: filteredPrompt,
        createdAt: new Date(),
      },
      {
        id: nanoid(),
        role: "model",
        content: "",
        createdAt: new Date(),
      },
    ]);

    setUnSavedPrompt(filteredPrompt);
    setNewMessage("");
    setStream("");

    const messages = [
      ...history.map((chat) => ({
        role: chat.role === "model" ? "assistant" : "user",
        content: `${chat.content}`,
      })),
      {
        role: "user",
        content: `${filteredPrompt}`,
      },
    ];

    const response = await fetch("/api/custom-model/route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        beneficiaries,
        transactions,
        name,
        balance,
      }),
    });

    // Check for successful response
    if (!response.body || !response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const reader = response.body.getReader();

    // Process data chunks in a loop
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        setIsStreaming(false);
        break;
      }
      setStream((state) => state + new TextDecoder().decode(value));
    }

    reader.cancel();
  };

  return (
    <div className="flex flex-col w-full h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {allChats.map((chat, index) => (
          <ChatItem
            key={chat.id}
            data={chat}
            isLast={index === allChats.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <CustomTextareaForm
        value={newMessage}
        onChange={setNewMessage}
        placeholder="Type your message..."
        className="flex-1 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ChatPage;
