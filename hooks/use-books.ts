"use client";

import { useLiveQuery } from 'dexie-react-hooks';
import { db, Book } from '../db';
import { v4 as uuidv4 } from 'uuid';
import ePub from 'epubjs';

export async function getTextUpToPercentage(id: string) {
  try {
    const book = await db.books.get(id);
    const percentage = book?.percentCompleted;
    if (!book?.epubData || !percentage) return null;
    
    const epubBook = ePub();
    await epubBook.open(book.epubData);
    
    // Generate locations if they don't exist
    await epubBook.locations.generate(1000);

    const startCfi = epubBook.locations.cfiFromPercentage(0);
    const endCfi = epubBook.locations.cfiFromPercentage(percentage / 100);
    
    const text = await epubBook.getRange(endCfi);
    console.log("found some text");
    console.log(text.toString());
    return text.toString();
  } catch (error) {
    console.error('Error getting text up to percentage:', error);
    // return null;
  }
};

export function useBooks() {
  const books = useLiveQuery(() => db.books.toArray());

  const addBook = async (book: Omit<Book, 'id' | 'dateAdded' | 'percentCompleted'>) => {
    return await db.books.add({
      ...book,
      id: uuidv4(),
      dateAdded: new Date(),
      percentCompleted: 0,
    });
  };

  const updateProgress = async (id: string, percentCompleted: number) => {
    await db.books.update(id, { percentCompleted });
  };

  const updateName = async (id: string, name: string) => {
    await db.books.update(id, { name });
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
    updateName,
    updateProgress,
  };
}