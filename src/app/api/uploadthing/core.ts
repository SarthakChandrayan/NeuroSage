import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
  createUploadthing,
  type FileRouter,
} from 'uploadthing/next'

import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { getPineconeClient } from '@/lib/pinecone'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const f = createUploadthing()

const middleware = async () => {
  const { getUser } = getKindeServerSession()
  const user = getUser()

  if (!user || !user.id) throw new Error('Unauthorized')

  return { userId: user.id }
}

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>
  file: {
    key: string
    name: string
    url: string
  }
}) => {
  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  })

  if (isFileExist) return

  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: file.url,
      uploadStatus: 'PROCESSING',
    },
  })

  try {
    const response = await fetch(
      file.url,
      {
        headers: {
          'Content-Type': 'application/pdf',
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()

    const loader = new PDFLoader(blob, {
      splitPages: false
    })

    const docs = await loader.load()
    
    // Get the raw text content
    const rawText = docs[0].pageContent
    
    // Use text splitter to count actual pages (based on form feeds)
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })
    
    const splitDocs = await textSplitter.splitDocuments(docs)
    console.log('Actual document chunks:', splitDocs.length)

    // vectorize and index entire document
    const pinecone = getPineconeClient()
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    })

    try {
      // Create embeddings in smaller batches
      const batchSize = 10
      for (let i = 0; i < splitDocs.length; i += batchSize) {
        const batch = splitDocs.slice(i, i + batchSize)
        
        // Generate embeddings for the batch
        const vectors = await Promise.all(
          batch.map(async (doc, idx) => {
            const embedding = await embeddings.embedQuery(doc.pageContent)
            const vectorId = `${createdFile.id}-${i + idx}`
            console.log('Creating vector:', {
              id: vectorId,
              metadata: {
                text: doc.pageContent.slice(0, 100) + '...',
                fileId: createdFile.id
              }
            })
            return {
              id: vectorId,
              values: embedding,
              metadata: {
                text: doc.pageContent,
                fileId: createdFile.id
              }
            }
          })
        )

        // Upsert vectors directly to the index
        await pinecone.index('neurosage').upsert(vectors)
        console.log(`Processed and uploaded batch ${i / batchSize + 1} of ${Math.ceil(splitDocs.length / batchSize)}`)
      }

      await db.file.update({
        data: {
          uploadStatus: 'SUCCESS',
        },
        where: {
          id: createdFile.id,
        },
      })
    } catch (error: any) {
      console.error('Error details:', {
        message: error?.message || 'Unknown error',
        code: error?.code,
        response: error?.response,
        stack: error?.stack,
      })
      
      await db.file.update({
        data: {
          uploadStatus: 'FAILED',
        },
        where: {
          id: createdFile.id,
        },
      })
      throw error
    }
  } catch (err) {
    console.error('Error processing file:', err)
    await db.file.update({
      data: {
        uploadStatus: 'FAILED',
      },
      where: {
        id: createdFile.id,
      },
    })
  }
}

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '16MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
