"use client";

import { useBookChat } from "@/hooks/use-book-chat"
import { Button } from "@/components/ui/button"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { ArrowDownCircle } from "lucide-react"
import { useState, useCallback, useEffect } from "react"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import { useChat } from '@ai-sdk/react'
import { Message } from "ai";
import { useBooks } from "@/hooks/use-books";
import { useToast } from "@/hooks/use-toast"

interface ChatProps {
  bookId: string;
  initialMessages: Message[];
}

export default function Chat({ bookId, initialMessages }: ChatProps) {
  const [containerRef, endRef, , setShouldAutoScroll] = useScrollToBottom<HTMLDivElement>();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { addMessage, percentCompleted } = useBookChat(bookId);
  const { getBookName, getBookTextBeforePercentage } = useBooks();
  const [bookText, setBookText] = useState("");
  const [bookName, setBookName] = useState("");
  const { toast } = useToast()

  useEffect(() => {
    const fetchBookText = async () => {
      if (percentCompleted && percentCompleted > 0) {
        const text = await getBookTextBeforePercentage(bookId);
        setBookText(String(text));
      }
    };
    fetchBookText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentCompleted]);

  useEffect(() => {
    const fetchBookName = async () => {
      const name = await getBookName(bookId);
      setBookName(String(name));
    };
    fetchBookName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const { messages, input, setInput, handleSubmit, isLoading } = useChat({ 
    id: bookId,
    initialMessages,
    body: { bookText, bookName },
    maxSteps: 3,
    onFinish: async (message) => {
      // Add user message to local db
      await addMessage(input, "user");
      // Add ai message to local db
      await addMessage(message.content, "assistant");
    },
    onError: (error) => {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "An error occured getting response from server",
        variant: "destructive",
      });
    },
  });

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
    setShouldAutoScroll(isNearBottom);
  }, [setShouldAutoScroll]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    setShouldAutoScroll(true);
    setShowScrollButton(false);
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
      {percentCompleted === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-lg text-gray-500">
            Update your progress to start chatting
          </p>
        </div>
      ) : (
        <>
          {/* Messages container */}
          <div
            className="flex-grow overflow-y-auto overflow-x-hidden relative w-full" 
            ref={containerRef}
            onScroll={handleScroll}
          >
            <div>
              <ChatMessages messages={messages} isLoading={isLoading} />
              <div ref={endRef} />
              {showScrollButton && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollToBottom}
                  className="sticky bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-full"
                  aria-label="Scroll to bottom"
                >
                  <ArrowDownCircle size={24} />
                </Button>
              )}
            </div>
          </div>
          {/* Input container */}
          <div className="flex-shrink-0">
            <ChatInput
              bookId={bookId}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </div>
  )
}