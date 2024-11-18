"use client";

import CustomTextareaForm from "@/components/ui/custom-textarea";
import { Chat, NewTransactionType } from "@/types";
import React, { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import ChatItem from "@/components/chat-item";
import axios from "axios";
import useChat from "@/hooks/use-chat";
import ConfirmTransaction from "@/components/confirm-transaction";
import useBeneficiary from "@/hooks/use-beneficiary";
import { AudioLines, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Chart, { ChartType } from "./_components/chart";
import useTransaction from "@/hooks/use-transaction";

const name = "Suraj Muhammad";
const balance = 100000;

const ChatPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");

  const { chats, addChat } = useChat();
  const { beneficiaries } = useBeneficiary();
  const { transactions } = useTransaction();

  const [isLoading, setIsLoading] = useState(false);
  const [newTransaction, setNewTransaction] =
    useState<NewTransactionType | null>(null);
  const [chartType, setChartType] = useState<ChartType>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  // useEffect(() => {
  //   if (newTransaction) {
  //     // Reset transaction after handling
  //     setNewTransaction(null);
  //   }
  // }, [newTransaction]);

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
            (t) =>
              `${t.isCredit ? t.senderName : t.receiverName} - ${
                t.isCredit ? "Credit" : "Debit"
              } - NGN${t.amount} - ${t.date} |`
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

      if (jsonData.transactionChart) {
        setChartType("TRANSACTIONS");
      }

      console.log(jsonData);
    } catch (error) {
      console.error("API request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-screen p-4 pt-0">
      <div className="flex items-center justify-between sticky top-0 z-50 bg-white px-4 py-2">
        <Link href="/dashboard" className="flex items-center">
          <ChevronLeft className="w-10 h-10 p-1.5" />
          <h2 className="text-base lg:text-lg font-semibold">Chat</h2>
        </Link>
        <Link href="/voice">
          <AudioLines className="w-10 h-10 p-1.5" />
        </Link>
      </div>
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
      {chartType && <Chart type={chartType} setType={setChartType} />}
    </div>
  );
};

export default ChatPage;
