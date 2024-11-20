"use client";

import CustomTextareaForm from "@/components/ui/custom-textarea";
import { Chat, NewTransactionType } from "@/types";
import React, { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import ChatItem from "@/components/chat-item";
import useChat from "@/hooks/use-chat";
import ConfirmTransaction from "@/components/confirm-transaction";
import useBeneficiary from "@/hooks/use-beneficiary";
import { AudioLines, ChevronLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import Chart, { ChartType } from "./_components/chart";
import useTransaction from "@/hooks/use-transaction";
import Echo from "./_components/echo";
import useEcho from "@/hooks/use-echo";
import useUserInfo from "@/hooks/use-userinfo";
import { EchoTextChat } from "@/actions/text-chat";
import { ChatStructure } from "@/actions/voice-chat";
import { toast } from "sonner";
import { owner } from "@/store";
import useNewTransaction from "@/hooks/use-new-transaction";

const ChatPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [lastAttemptedMessage, setLastAttemptedMessage] = useState("");
  const [showRetry, setShowRetry] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState<ChartType>(null);

  const { info } = useUserInfo();
  const { openEcho, setOpenEcho } = useEcho();
  const { chats, addChat } = useChat();
  const { beneficiaries } = useBeneficiary();
  const { transactions } = useTransaction();
  const { newTransaction, setNewTransaction } = useNewTransaction();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const handleSubmit = async () => {
    // Get the message to send - either new message or last attempted message for retry
    const messageToSend = showRetry ? lastAttemptedMessage : newMessage.trim();

    const user = info || owner;

    if (!user) {
      toast.error("Unauthorized");
      return;
    }

    if (!messageToSend) {
      toast.error("Please enter a message");
      return;
    }

    const history = [...chats];
    setIsLoading(true);
    setShowRetry(false);
    setLastAttemptedMessage(messageToSend);

    const userMessage: Chat = {
      id: nanoid(),
      role: "user",
      content: messageToSend,
      createdAt: new Date(),
    };

    addChat(userMessage);
    setNewMessage("");

    const messages: ChatStructure[] = [
      ...history.map((chat) => ({
        role:
          chat.role === "user" ? "user" : ("assistant" as "user" | "assistant"),
        content: chat.content,
      })),
      {
        role: "user",
        content: messageToSend,
      },
    ];

    try {
      const data = {
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
        name: user.fullname || "",
        balance: Number(user.balance) || 0,
      };

      const response = await EchoTextChat(data);

      if (!response) {
        throw new Error("No response from server");
      }

      const jsonData = JSON.parse(response);

      console.log(data, response);

      if (
        !jsonData.message &&
        !jsonData.newTransaction &&
        !jsonData.transactionChart
      ) {
        throw new Error("Invalid response format");
      }

      if (jsonData.newTransaction) {
        setNewTransaction(jsonData.newTransaction);
      }

      if (jsonData.message) {
        const modelMessage: Chat = {
          id: nanoid(),
          role: "assistant",
          content: jsonData.message,
          createdAt: new Date(),
        };
        addChat(modelMessage);
      }

      if (jsonData.transactionChart) {
        setChartType("TRANSACTIONS");
      }
    } catch (error) {
      console.error("API request failed:", error);
      setShowRetry(true);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-screen p-4 pt-0">
      <div className="flex items-center justify-between sticky top-0 z-50 bg-white py-2">
        <Link href="/dashboard" className="flex items-center">
          <ChevronLeft className="w-10 h-10 p-1.5" />
          <h2 className="text-base lg:text-lg font-semibold">Chat</h2>
        </Link>
        <button onClick={() => setOpenEcho(true)}>
          <AudioLines className="w-10 h-10 p-1.5" />
        </button>
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

        {showRetry && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
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

      {chartType && <Chart type={chartType} setType={setChartType} />}
    </div>
  );
};

export default ChatPage;
