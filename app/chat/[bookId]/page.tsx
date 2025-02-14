"use client";

import { useBookChat } from "@/hooks/use-book-chat"
import { useParams } from "next/navigation"
import Chat from "@/components/chat/chat";

export default function BookChat() {
  const { bookId } = useParams();
  const { messages } = useBookChat(String(bookId));

  return (
    <Chat bookId={String(bookId)} initialMessages={messages} />
  )
}