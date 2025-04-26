import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

let prisma: PrismaClient

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables')
}

try {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
  } else {
    if (!global.cachedPrisma) {
      global.cachedPrisma = new PrismaClient()
    }
    prisma = global.cachedPrisma
  }
} catch (error) {
  console.error('Failed to initialize Prisma client:', error)
  throw error
}

export const db = prisma