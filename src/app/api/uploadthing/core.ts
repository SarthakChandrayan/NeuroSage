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
      const response = await fetch(file.url)
      const blob = await response.blob()
      const loader = new PDFLoader(blob)

      const pageLevelDocs = await loader.load()

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      })

      const splitDocs = await textSplitter.splitDocuments(pageLevelDocs)

      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      })

      const pinecone = getPineconeClient()
      const index = pinecone.Index('neurosage')

      // Prepare vectors array for upsert
      const vectors = await Promise.all(
        splitDocs.map(async (doc, i) => {
          const embedding = await embeddings.embedQuery(doc.pageContent)
          return {
            id: `${createdFile.id}-${i}`,
            values: embedding,
            metadata: {
              text: doc.pageContent,
              fileId: createdFile.id,
            },
          }
        })
      )

      // Upsert in batches of 100
      const batchSize = 100
      for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize)
        await index.upsert(batch)
      }

      await db.file.update({
        data: {
          uploadStatus: 'SUCCESS',
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
