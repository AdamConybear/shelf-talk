import { NextRequest } from 'next/server';
import { Message, streamText } from 'ai';
import { google } from '@ai-sdk/google';

const geminiFlashModel = google("gemini-2.0-flash-001")

export async function POST(req: NextRequest) {
  const { bookText, bookName, messages }: { bookText: string, bookName: string, messages: Array<Message> } = await req.json();
  
  const result = streamText({
    model: geminiFlashModel,
    system: `\n
      - You are a helpful assistant helping someones questions about a book
      - The books name is ${bookName}
      - They have read a certain percentage of the book so far and would like to ask questions about the book
      - This is the text from the book that they have read so far: ${bookText}
      - Based on the text you make make assumptions about the book but you should notify user that you are making assumptions
      - Please answer the questions based on the text they have read so far
      - If you don't know the answer, please say so
    `,
    messages,
  });

  return result.toDataStreamResponse();
}