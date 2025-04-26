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

  // Query Pinecone directly
  const queryResponse = await index.query({
    vector: messageEmbedding,
    topK: 4,
    includeMetadata: true,
    filter: {
      fileId: { $eq: file.id }
    }
  })

  console.log('Pinecone query response:', {
    matchCount: queryResponse.matches.length,
    firstMatch: queryResponse.matches[0] ? {
      score: queryResponse.matches[0].score,
      metadata: queryResponse.matches[0].metadata
    } : 'No matches'
  })

  // Format results
  const results = queryResponse.matches.map(match => ({
    pageContent: match.metadata?.text ?? '',
    metadata: match.metadata
  }))

  if (results.length === 0) {
    console.log('No results found in Pinecone for fileId:', file.id)
  }

  const prevMessages = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 6,
  })

  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage
      ? ('user' as const)
      : ('assistant' as const),
    content: msg.text,
  }))

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
      },
      {
        role: 'user',
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === 'user')
      return `User: ${message.content}\n`
    return `Assistant: ${message.content}\n`
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join('\n\n')}
  
  USER INPUT: ${message}`,
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
