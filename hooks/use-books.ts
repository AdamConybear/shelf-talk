"use client";

import { useLiveQuery } from 'dexie-react-hooks';
import { db, Book } from '../db';
import { v4 as uuidv4 } from 'uuid';
// import ePub from 'epubjs'

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

  // const getEpubFromBook = async (id: string) => {
  //   try {
  //     const book = await db.books.get(id);
  //     if (!book?.epubData) return null;
  //     const epubBook = ePub().open(book.epubData);
  //     return epubBook;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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