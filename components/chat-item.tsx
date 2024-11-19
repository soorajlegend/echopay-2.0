"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import rehypePrism from "rehype-prism";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "./ui/skeleton";
import { Chat } from "@/types";

interface Chatcontent {
  data: Chat;
  isLast: boolean;
}

const ResponseSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-start items-start shadow-none relative p-3 my-3">
      <Skeleton className="ring-2 ring-gray-200 dark:ring-arsenic w-9 h-9 rounded-full bg-gray-200 dark:bg-arsenic" />
      <div className="w-full flex flex-col gap-y-2 rounded-custom shadow-none p-2">
        <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-arsenic" />
        <Skeleton className="h-4 w-2/4 bg-gray-200 dark:bg-arsenic" />
        <div className="h-2 w-full" />
        <Skeleton className="h-4 w-4/5 bg-gray-200 dark:bg-arsenic" />
        <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-arsenic" />
        <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-arsenic" />
      </div>
    </div>
  );
};

const ChatItem = ({ data, isLast }: Chatcontent) => {
  if (!data?.content?.length && isLast) {
    return <ResponseSkeleton />;
  }

  if (!data?.content?.length && !isLast) {
    return;
  }

  const isAssistant = data.role === "assistant";

  return (
    <div
      className={cn(
        " top-0 w-full h-auto  flex  bg-transparent p-0 overflows-y-scroll hidden-scrollbar rounded-custom cursor-pointer "
      )}
    >
      <motion.div
        initial={{ rotateX: 5, scale: 0.9 }}
        whileInView={{ rotateX: 0, scale: 1 }}
        transition={{
          bounce: 1,
          duration: 0.5,
          ease: "easeInOut",
        }}
        className={cn(
          "max-w-4xl  rounded-custom  w-auto min-w-[80px] ",
          !isAssistant &&
            `bg-gray-300/40 text-gray-600 dark:text-white max-w-[80%] ml-auto rounded-3xl p-2`
        )}
      >
        <div
          className={cn(
            "flex flex-row gap-3 lg:gap-2 w-full relative mt-0 p-1"
          )}
        >
          {data.role === "assistant" && (
            <Avatar
              className={cn("w-9 h-9 aspect-square dark:bg-gray-900/40 ")}
            >
              <AvatarImage src="/apple-touch-icon.png" />
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
          )}

          <Card
            className={cn(
              "relative bg-red-50 overflow-hidden w-full flex flex-col gap-y-1 rounded-[8px] border-none shadow-none bg-transparent px-3 p-0 lg:pl-0",
              isAssistant && "mt-2"
            )}
          >
            <div
              className={cn(
                "w-full text-sm   overflow-x-auto hide-scrollbar whitespace-pre-wrap transition  bg-transparent"
              )}
            >
              <ReactMarkdown
                className="styled-scrollbar"
                rehypePlugins={[rehypePrism]}
              >
                {data.content}
              </ReactMarkdown>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatItem;
