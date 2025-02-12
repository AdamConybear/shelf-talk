"use client";

import { SendHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface InputProps {
  onSubmit: (message: string) => void
}

export function ChatInput({ onSubmit }: InputProps) {
  const [message, setMessage] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
  }, [message]) // This will run on mount and whenever message changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSubmit(message.trim())
      setMessage("")
      setIsExpanded(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    adjustHeight(e.target)
  }
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="p-4 flex justify-center w-full">
        <div className="relative flex justify-center w-full max-w-2xl px-4">
          <Textarea 
            ref={textareaRef}
            value={message}
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
            disabled={!message.trim()}
          >
            <SendHorizontal />
          </Button>
        </div>
      </form>
    </div>
  )
}