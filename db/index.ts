import Dexie, { Table } from 'dexie';

// Define types for our database entities
export interface Book {
  id: string;
  name: string;
  preview: string;
  epubData: ArrayBuffer;
  dateAdded: Date;
  percentCompleted: number;
}

export interface Chat {
  id: string;
  bookId: string;
  messages: Array<Message>;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
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