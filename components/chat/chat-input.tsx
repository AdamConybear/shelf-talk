"use client";

import { SendHorizontal } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ChatRequestOptions } from "ai";
import { useBookChat } from "@/hooks/use-book-chat";

interface InputProps {
  bookId: string;
  input: string;
  isLoading: boolean;
  setInput: (value: string) => void,
  setBookText: (value: string) => void,
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
}

export function ChatInput({ bookId, input, setInput, handleSubmit, isLoading, setBookText }: InputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { getBookTextBeforePercentage } = useBookChat(bookId);

  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = '0'
    element.style.height = `${element.scrollHeight + 2}px`
    // Check if height is greater than initial height (44px + padding)
    setIsExpanded(element.scrollHeight > 55)
  }

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current)
    }
  }, [input]) // This will run on mount and whenever message changes

  const submitForm = useCallback(async () => {
    if(input.trim()) {
      let text = await getBookTextBeforePercentage();
      setBookText(text ?? "");
      handleSubmit(undefined);
      setIsExpanded(false);
    }
  }, [handleSubmit, input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isLoading && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submitForm()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    adjustHeight(e.target)
  }
  return (
    <div className="w-full">
      <form onSubmit={submitForm} className="p-4 flex justify-center w-full">
        <div className="relative flex justify-center w-full max-w-2xl px-4">
          <Textarea 
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            className={`pr-12 w-full resize-none min-h-[55px] max-h-[200px] py-4 overflow-hidden ${
              isExpanded ? 'rounded-3xl' : 'rounded-full'
            }`}
            placeholder="Ask me anything..."
          />
          <Button
            type="submit"
            variant="secondary"
            size="icon"
            className="absolute right-7 top-1/2 -translate-y-1/2 rounded-full"
            disabled={!input.trim()}
          >
            <SendHorizontal />
          </Button>
        </div>
      </form>
    </div>
  )
}