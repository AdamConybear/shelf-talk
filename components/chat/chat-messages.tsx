"use client";

import { cn } from "@/lib/utils"
import { Message } from "ai"
import { Bot } from "lucide-react"

interface MessagesProps {
  messages: Message[]
  isLoading: boolean
}

const UserMessage = ({ content }: { content: string }) => (
  <div className="max-w-[80%] rounded-3xl p-3 px-4 bg-secondary text-primary break-words">
    {content}
  </div>
)

const LoadingDots = () => (
  <div className="flex gap-1">
    <span className="w-1.5 h-1.5 bg-current rounded-full animate-[bounce_1.4s_infinite] [animation-delay:-0.32s]" />
    <span className="w-1.5 h-1.5 bg-current rounded-full animate-[bounce_1.4s_infinite] [animation-delay:-0.16s]" />
    <span className="w-1.5 h-1.5 bg-current rounded-full animate-[bounce_1.4s_infinite]" />
  </div>
)

const BotMessage = ({ content, isLoading }: { content: string; isLoading?: boolean }) => (
  <div className="flex gap-3 max-w-[80%]">
    <Bot className={cn("w-6 h-6 flex-shrink-0", isLoading && "animate-pulse")} />
    <div className={cn("rounded-2xl break-words", isLoading && "flex items-center mt-2")}>
      {isLoading ? <LoadingDots /> : content}
    </div>
  </div>
)

export function ChatMessages({ messages, isLoading }: MessagesProps) {
  return (
    <div className="w-full flex justify-center p-4">
      <div className="flex flex-col gap-8 w-full max-w-3xl">
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
              <BotMessage content={message.content}  />
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex w-full justify-start">
            <BotMessage content="" isLoading={true} />
          </div>
        )}
      </div>
    </div>
  )
}