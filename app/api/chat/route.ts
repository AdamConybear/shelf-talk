import { NextRequest } from 'next/server';
import { Message, streamText } from 'ai';
import { google } from '@ai-sdk/google';

const geminiFlashModel = google("gemini-2.0-flash-001")

export async function POST(req: NextRequest) {
  const { bookId, messages }: { bookId: string; messages: Array<Message> } = await req.json();
  
  // TODO: Get epub text and provide it to system param

  const result = streamText({
    model: geminiFlashModel,
    system: 'You are a helpful assistant helping someones questions about a book.',
    messages,
  });

  return result.toDataStreamResponse();
}