import { db } from '@/db'
import { openai } from '@/lib/openai'
import { getPineconeClient } from '@/lib/pinecone'
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { NextRequest } from 'next/server'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const POST = async (req: NextRequest) => {
  // endpoint for asking a question to a pdf file

  const body = await req.json()

  const { getUser } = getKindeServerSession()
  const user = getUser()

  const { id: userId } = user

  if (!userId)
    return new Response('Unauthorized', { status: 401 })

  const { fileId, message } =
    SendMessageValidator.parse(body)

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  })

  if (!file)
    return new Response('Not found', { status: 404 })

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  })

  // 1: vectorize message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  const pinecone = getPineconeClient()
  const index = pinecone.index('neurosage')

  // Get message embedding
  const messageEmbedding = await embeddings.embedQuery(message)

  console.log('Querying Pinecone for file:', {
    fileId: file.id,
    message: message.slice(0, 100)
  })

  // Query Pinecone with multiple strategies
  const mainQuery = await index.query({
    vector: messageEmbedding,
    topK: 12,  // Increased for better coverage
    includeMetadata: true,
    filter: {
      fileId: { $eq: file.id }
    }
  });

  // Get introduction/overview sections
  const introQuery = await embeddings.embedQuery("introduction overview summary main topics");
  const introResults = await index.query({
    vector: introQuery,
    topK: 5,
    includeMetadata: true,
    filter: {
      fileId: { $eq: file.id }
    }
  });

  // Combine and deduplicate results
  const allMatches = [...mainQuery.matches, ...introResults.matches];
  const seenContent = new Set();
  const results = allMatches
    .map(match => ({
      pageContent: match.metadata?.text ?? '',
      metadata: match.metadata,
      score: match.score || 0
    }))
    .filter(result => {
      // Remove duplicates and very low scores
      if (result.score < 0.005) return false;
      const contentPreview = typeof result.pageContent === 'string' 
        ? result.pageContent.slice(0, 100) 
        : '';
      if (seenContent.has(contentPreview)) return false;
      seenContent.add(contentPreview);
      return true;
    })
    .slice(0, 10); // Keep top 10 unique sections

  if (results.length === 0) {
    console.log('No relevant results found in Pinecone for fileId:', file.id)
    return new Response(
      JSON.stringify({
        error: 'No relevant content found. Please try rephrasing your question.',
        suggestedPrompts: [
          "What are the main topics covered in this document?",
          "Can you summarize the key themes?",
          "What are the major sections of this document?",
          "What is the document's approach to ethics and morality?",
          "How does the document discuss environmental concerns?",
          "What is mentioned about cloning?",
          "How is gender discussed in the document?"
        ]
      }),
      { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  // Sort by relevance and log for debugging
  results.sort((a, b) => (b.score || 0) - (a.score || 0));
  console.log('Using sections:', results.map(r => ({
    score: r.score,
    preview: typeof r.pageContent === 'string' ? r.pageContent.slice(0, 100) + '...' : 'Content not available'
  })));

  const prevMessages = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  })

  const formattedPrevMessages = prevMessages
    .reverse()
    .map((msg: { isUserMessage: boolean; text: string }) => ({
      role: msg.isUserMessage ? ('user' as const) : ('assistant' as const),
      content: msg.text,
    }));

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    stream: true,
    presence_penalty: 0.6,
    frequency_penalty: 0.5,
    max_tokens: 1500,
    messages: [
      {
        role: 'system',
        content: `You are an expert AI tutor specializing in computer science and compiler construction. Your responses should be:

1. Analytical: Don't just list information - analyze concepts, explain their significance, and show how they connect to broader principles in computer science.

2. Interactive: Engage with the user's specific question. If they ask about a particular concept, focus on that rather than giving broad overviews.

3. Practical: Use real-world examples and code snippets when relevant. Explain how theoretical concepts translate to practical implementation.

4. Depth-First: Rather than shallow coverage of many topics, dive deep into the specific areas the user is asking about.

5. Contextual: Reference relevant information from previous messages when it helps build understanding.

Format your responses in clear markdown, but focus on natural, conversational explanations rather than rigid summaries.

If you don't know something or need clarification, say so directly and ask specific questions.`,
      },
      {
        role: 'user',
        content: `Use the following context and previous conversation to answer the user's question in a natural, analytical way.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message: { role: string; content: string }) => {
    if (message.role === 'user') return `User: ${message.content}\n`
    return `Assistant: ${message.content}\n`
  })}
  
  \n----------------\n
  
  DOCUMENT SECTIONS (organized by relevance):
  ${results.map((r, i) => `[Section ${i + 1} - Relevance: ${(r.score || 0).toFixed(4)}]\n${typeof r.pageContent === 'string' ? r.pageContent.trim() : r.pageContent}`).join('\n\n')}
  
  USER QUESTION: ${message}`,
      },
    ],
  })

  const stream = OpenAIStream(response as any, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId,
          userId,
        },
      })
    },
  })

  return new StreamingTextResponse(stream)
}
