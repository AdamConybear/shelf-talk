import { NextRequest } from 'next/server';
import { Message, streamText } from 'ai';
import { google } from '@ai-sdk/google';

const geminiFlashModel = google("gemini-2.0-flash-001")

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { bookText, bookName, messages } = body;
  
  const result = streamText({
    model: geminiFlashModel,
    system: `\n
      - You are a helpful assistant helping answer a users questions about a book
      - The book name is ${bookName}
      - They have read a certain percentage of the book and would like to ask questions about the book
      - Please answer the questions using information from the text.
      - Be concise and to the point.
      - Make your responses readable and easy to understand.
      - If you are quoting something from the book, use quotes
      - You may make assumptions about the book but you should notify user that you are doing so
      - You can use outside knowledge to answer questions if it doesn't directly come from the book
      - If you don't know the answer, please say so
      - The user does not know I have provided the text they are simply asking questions about the book
      - This is the text from the book that they have read so far: \n\n${bookText}\n\n
    `,
    messages,
  });

  return result.toDataStreamResponse();
}