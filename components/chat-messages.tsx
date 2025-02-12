"use client";

import { cn } from "@/lib/utils"
import { Message } from "@/db"
import { Bot } from "lucide-react"

interface MessagesProps {
  messages: Message[]
}

const UserMessage = ({ content }: { content: string }) => (
  <div className="max-w-[80%] rounded-2xl p-3 bg-secondary text-primary break-words">
    {content}
  </div>
)

const BotMessage = ({ content }: { content: string }) => (
  <div className="flex gap-3 max-w-[80%]">
    <Bot className="w-6 h-6 flex-shrink-0" />
    <div className="rounded-2xl break-words">
      {content}
    </div>
  </div>
)

export function ChatMessages({ messages }: MessagesProps) {
  return (
    <div className="w-full flex justify-center p-4">
      <div className="flex flex-col gap-8 w-full max-w-2xl">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex w-full", 
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "user" ? (
              <UserMessage content={message.content} />
            ) : (
              <BotMessage content={message.content} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}