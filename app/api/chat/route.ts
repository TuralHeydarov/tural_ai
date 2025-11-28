import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { ChatRequest, Message } from '@/types';
import { getModelConfig } from '@/lib/models';

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, model: modelId, context } = body;

    if (!messages || messages.length === 0) {
      return Response.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const modelConfig = getModelConfig(modelId);

    // Build system prompt with context
    const systemPrompt = context
      ? `You are a helpful AI assistant. Use the following context to help answer questions:\n\n${context}`
      : 'You are a helpful AI assistant.';

    if (modelConfig.provider === 'anthropic') {
      return handleAnthropicStream(messages, modelConfig.apiModelId, systemPrompt, modelConfig.maxTokens);
    } else {
      return handleOpenAIStream(messages, modelConfig.apiModelId, systemPrompt, modelConfig.maxTokens);
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleAnthropicStream(
  messages: Message[],
  model: string,
  systemPrompt: string,
  maxTokens: number
) {
  const anthropicMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

  const stream = anthropic.messages.stream({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: anthropicMessages,
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const data = JSON.stringify({
              type: 'text',
              content: event.delta.text,
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

async function handleOpenAIStream(
  messages: Message[],
  model: string,
  systemPrompt: string,
  maxTokens: number
) {
  const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    })),
  ];

  // o1 models don't support streaming yet and have different params
  const isO1Model = model.startsWith('o1');

  if (isO1Model) {
    // o1 models don't support system messages, prepend to first user message
    const filteredMessages = openaiMessages.filter((m) => m.role !== 'system');
    if (filteredMessages.length > 0 && filteredMessages[0].role === 'user') {
      filteredMessages[0].content = `${systemPrompt}\n\n${filteredMessages[0].content}`;
    }

    const response = await openai.chat.completions.create({
      model,
      messages: filteredMessages,
      max_completion_tokens: maxTokens,
    });

    const content = response.choices[0]?.message?.content || '';
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      start(controller) {
        const data = JSON.stringify({ type: 'text', content });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  const stream = await openai.chat.completions.create({
    model,
    messages: openaiMessages,
    max_tokens: maxTokens,
    stream: true,
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            const data = JSON.stringify({ type: 'text', content });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
