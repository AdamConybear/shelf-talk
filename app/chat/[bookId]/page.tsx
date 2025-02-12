"use client";

import { useBookChat } from "@/hooks/use-book-chat"
import { Button } from "@/components/ui/button"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { ArrowDownCircle } from "lucide-react"
import { useState, useCallback } from "react"
import { ChatInput } from "@/components/chat-input"
import { ChatMessages } from "@/components/chat-messages"
import { useParams } from "next/navigation"

export default function BookChat() {
  const params = useParams();
  const { messages, addMessage } = useBookChat(String(params.bookId));
  const [containerRef, endRef, shouldAutoScroll, setShouldAutoScroll] = useScrollToBottom<HTMLDivElement>();
  const [showScrollButton, setShowScrollButton] = useState(false);

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

  const handleSubmit = async (content: string) => {
    await addMessage(content);
  }

  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
      {/* Messages container */}
      <div 
        className="flex-grow overflow-y-auto overflow-x-hidden relative w-full" 
        ref={containerRef}
        onScroll={handleScroll}
      >
        <div>
          <ChatMessages messages={messages} />
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
      {/* Messages container */}
      <div className="flex-shrink-0">
        <ChatInput onSubmit={handleSubmit} />
      </div>
    </div>
  )
}