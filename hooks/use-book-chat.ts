"use client";

import { useLiveQuery } from 'dexie-react-hooks';
import { Chat, db } from '@/db';
import { v4 as uuidv4 } from 'uuid';
import { getPercentageOfString } from '@/lib/utils';

export function useBookChat(bookId: string) {
  
  const chat = useLiveQuery(
    () => db.chats.where('bookId').equals(bookId).first(),
    [bookId]
  );
  
  const percentCompleted = useLiveQuery(
    async () => {
      const book = await db.books.where('id').equals(bookId).first();
      return book?.percentCompleted ?? 0;
    },
    [bookId]
  );

  const addMessage = async (content: string, role: 'user' | 'assistant' = 'user') => {
    const newMessage = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date()
    };

    const existingChat = await db.chats.where('bookId').equals(bookId).first();

    if(existingChat) {
      await db.chats.update(existingChat.id, {
        messages: [...existingChat.messages, newMessage]
      } as Partial<Chat>);
    } else {
      await db.chats.add({
        id: uuidv4(),
        bookId: bookId,
        messages: [newMessage]
      });
    }
  };

  const getBookName = async () => {
    const book = await db.books.where('id').equals(bookId).first();
    return book?.name;
  };

  return {
    messages: chat?.messages ?? [],
    percentCompleted,
    addMessage,
    getBookName,
  };
}