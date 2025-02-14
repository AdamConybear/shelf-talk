"use client";

import { useLiveQuery } from 'dexie-react-hooks';
import { Chat, db } from '@/db';
import { v4 as uuidv4 } from 'uuid';

export function useBookChat(bookId: string) {
  
  const chat = useLiveQuery(
    () => db.chats.where('bookId').equals(bookId).first(),
    [bookId]
  );

  const addMessage = async (content: string, role: 'user' | 'assistant' = 'user') => {
    console.log('addMessage', content, role);
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

    // const bookChat = await db.chats.where('bookId').equals(bookId).first();

    // // Mock AI response
    // if (bookChat && role === 'user') {
    //   // Simulate network delay
    //   await new Promise(resolve => setTimeout(resolve, 1000));
      
    //   const aiMessage = {
    //     id: uuidv4(),
    //     role: 'assistant',
    //     content: `This is a mock response to your message: "${content}"`,
    //     timestamp: new Date()
    //   };
      
    //   await db.chats.update(bookChat.id, {
    //     messages: [...bookChat.messages, aiMessage]
    //   } as Partial<Chat>);
    // }
  };

  return {
    messages: chat?.messages ?? [],
    addMessage,
  };
}