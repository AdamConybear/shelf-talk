"use client";

import { useLiveQuery } from 'dexie-react-hooks';
import { db, Book } from '../db';
import { v4 as uuidv4 } from 'uuid';

export function useBooks() {
  const books = useLiveQuery(() => db.books.toArray());

  const addBook = async (book: Omit<Book, 'id' | 'dateAdded' | 'percentCompleted' | 'text'>) => {
    return await db.books.add({
      ...book,
      id: uuidv4(),
      dateAdded: new Date(),
      percentCompleted: 0,
      text: '',
    });
  };

  const updateProgress = async (id: string, percentCompleted: number) => {
    await db.books.update(id, { percentCompleted });
  };

  const updateDisplayName = async (id: string, displayName: string) => {
    await db.books.update(id, { displayName });
  };

  const updateBookText = async (id: string, text: string) => {
    await db.books.update(id, { text });
  };

  const deleteBookAndChats = async (id: string) => {
    await db.books.delete(id);
    // Also delete associated chats
    await db.chats.where('bookId').equals(id).delete();
  }

  return {
    books,
    addBook,
    deleteBookAndChats,
    updateDisplayName,
    updateProgress,
    updateBookText,
  };
}