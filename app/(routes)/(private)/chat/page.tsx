"use client";

import CustomTextareaForm from "@/components/ui/custom-textarea";
import { Chat, NewTransactionType } from "@/type";
import React, { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import ChatItem from "@/components/chat-item";
import axios from "axios";

const name = "Suraj Muhammad";
const balance = 10000;
// dummu data
const transactions = [
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
];

const beneficiaries = [
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
];

const ChatPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  //  const { verified, info } = useUserInfo();

  const [unSavedPrompt, setUnSavedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    if (newTransaction) {
      // Could integrate with a toast notification system here
      console.log("New transaction detected:", newTransaction, unSavedPrompt);

      // Reset transaction after handling
      setNewTransaction(null);
    }
  }, [newTransaction]);

  const handleSubmit = async () => {
    if (!newMessage) return;

    const history = [...allChats];
    setIsLoading(true);

    const filteredPrompt = newMessage;

    const userMessage: Chat = {
      id: nanoid(),
      role: "user",
      content: filteredPrompt,
      createdAt: new Date(),
    };

    setAllChats((state) => [...state, userMessage]);
    setUnSavedPrompt(filteredPrompt);
    setNewMessage("");

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

    try {
      const data = JSON.stringify({
        messages,
        beneficiaries: JSON.stringify(
          beneficiaries.map((b) => `${b.name} - ${b.id} |`)
        ),
        transactions: JSON.stringify(
          transactions.map(
            (t) => `${t.name} - ${t.type} - NGN${t.amount} - ${t.date} |`
          )
        ),
        name,
        balance,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://raj-assistant-api.vercel.app/api/echopay-models/chat",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);
      const jsonData = JSON.parse(response.data);

      if (jsonData.newTransaction) {
        setNewTransaction(jsonData.newTransaction);
      }

      if (jsonData.message) {
        // Update the last message with the response
        setAllChats((currentChats) => [
          ...currentChats,
          {
            id: nanoid(),
            role: "model",
            content: jsonData.message,
            createdAt: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("API request failed:", error);
      // Remove the empty model message if request fails
      setAllChats((currentChats) => currentChats.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
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

        {isLoading && (
          <div className="flex items-center gap-2 px-4">
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <CustomTextareaForm
        value={newMessage}
        onChange={setNewMessage}
        placeholder="Type your message..."
        className="flex-1 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
    </div>
  );
};

export default ChatPage;
