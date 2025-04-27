import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
  createUploadthing,
  type FileRouter,
} from 'uploadthing/next'

import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
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
  metadata: { userId: string }
  file: {
    key: string
    name: string
    url: string
  }
}) => {
  try {
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
      // Download the file
      const response = await fetch(file.url)
      if (!response.ok) throw new Error('Failed to download PDF')
      
      const blob = await response.blob()
      
      // Load PDF directly from blob
      const loader = new PDFLoader(blob)
      const pages = await loader.load()
      
      // Update total pages
      await db.file.update({
        where: { id: createdFile.id },
        data: { totalPages: pages.length }
      })

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      })

      const splitDocs = await textSplitter.splitDocuments(pages)

      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      })

      const pinecone = getPineconeClient()
      const index = pinecone.Index('neurosage')

      // Process in smaller batches and update progress
      const batchSize = 50
      for (let i = 0; i < splitDocs.length; i += batchSize) {
        const batch = splitDocs.slice(i, i + batchSize)
        
        // Create embeddings for this batch
        const vectors = await Promise.all(
          batch.map(async (doc, batchIndex) => {
            const embedding = await embeddings.embedQuery(doc.pageContent)
            return {
              id: `${createdFile.id}-${i + batchIndex}`,
              values: embedding,
              metadata: {
                text: doc.pageContent,
                fileId: createdFile.id,
              },
            }
          })
        )

        // Upload to Pinecone
        await index.upsert(vectors)

        // Update progress
        const progress = Math.min(100, Math.round((i + batchSize) / splitDocs.length * 100))
        await db.file.update({
          where: { id: createdFile.id },
          data: { 
            pagesProcessed: Math.min(pages.length, Math.floor((i + batchSize) / batchSize)),
            processingProgress: progress
          }
        })
      }

      await db.file.update({
        data: {
          uploadStatus: 'SUCCESS',
          processingProgress: 100,
          pagesProcessed: pages.length
        },
        where: {
          id: createdFile.id
        }
      })
    } catch (err) {
      console.error('Error processing file:', err)
      await db.file.update({
        data: {
          uploadStatus: 'FAILED',
          processingProgress: 0
        },
        where: {
          id: createdFile.id
        }
      })
    }
  } catch (err) {
    console.error('Error in upload complete handler:', err)
  }
}

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: '32MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: '32MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
