import Dexie, { Table } from 'dexie';
import { Message } from 'ai';

// Define types for our database entities
export interface Book {
  id: string;
  name: string;
  displayName: string;
  preview: string;
  epubData: ArrayBuffer;
  dateAdded: Date;
  percentCompleted: number;
  text: string;
}

export interface Chat {
  id: string;
  bookId: string;
  messages: Array<Message>;
}

// Define the database
export class ShelfTalkDB extends Dexie {
  books!: Table<Book>;
  chats!: Table<Chat>;

  constructor() {
    super('ShelfTalkDB');
    
    // Define tables and indexes
    this.version(1).stores({
      books: 'id, name',
      chats: 'id, bookId',
    });
  }
}

// Export a single instance of the database
export const db = new ShelfTalkDB();