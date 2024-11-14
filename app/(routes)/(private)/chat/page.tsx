"use client";

import CustomTextareaForm from "@/components/ui/custom-textarea";
import React, { useState } from "react";

const ChatPage = () => {
  const [messages, setMessages] = useState<
    Array<{ text: string; sender: string }>
  >([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = async () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: "user" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col w-full h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[70%] ${
              message.sender === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {message.text}
          </div>
        ))}
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
