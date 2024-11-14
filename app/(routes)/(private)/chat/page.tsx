"use client";

import CustomTextareaForm from "@/components/ui/custom-textarea";
import { Chat, NewTransactionType } from "@/types";
import React, { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import ChatItem from "@/components/chat-item";
import axios from "axios";
import useChat from "@/hooks/use-chat";
import ConfirmTransaction from "@/components/confirm-transaction";

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
    userid: "user1",
    acc_name: "John Doe",
    acc_num: "1234567890",
    bank_name: "Bank of America",
    bank_code: "BOA001",
    status: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    userid: "user2",
    acc_name: "James Bond",
    acc_num: "0987654321",
    bank_name: "Chase Bank",
    bank_code: "CHASE001",
    status: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    userid: "user3",
    acc_name: "Muhammad Ali",
    acc_num: "5555555555",
    bank_name: "Wells Fargo",
    bank_code: "WF001",
    status: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const ChatPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");

  const { chats, addChat } = useChat();

  const [isLoading, setIsLoading] = useState(false);
  const [newTransaction, setNewTransaction] =
    useState<NewTransactionType | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    if (newTransaction) {
      // Reset transaction after handling
      setNewTransaction(null);
    }
  }, [newTransaction]);

  const handleSubmit = async () => {
    if (!newMessage) return;

    const history = [...chats];
    setIsLoading(true);

    const filteredPrompt = newMessage;

    const userMessage: Chat = {
      id: nanoid(),
      role: "user",
      content: filteredPrompt,
      createdAt: new Date(),
    };

    addChat(userMessage);
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
          beneficiaries.map((b) => `${b.acc_name} - ${b.id} |`)
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
        const modelMessage: Chat = {
          id: nanoid(),
          role: "model",
          content: jsonData.message,
          createdAt: new Date(),
        };
        addChat(modelMessage);
      }
    } catch (error) {
      console.error("API request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {chats.map((chat, index) => (
          <ChatItem
            key={chat.id}
            data={chat}
            isLast={index === chats.length - 1}
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
      <ConfirmTransaction
        data={newTransaction}
        setNewTransaction={setNewTransaction}
      />
    </div>
  );
};

export default ChatPage;
