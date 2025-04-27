import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
  privateProcedure,
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { db } from '@/db'
import { z } from 'zod'
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
import { absoluteUrl } from '@/lib/utils'

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id || !user.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    // check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    })

    if (!dbUser) {
      // create user in db
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      })
    }

    return { success: true }
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx

    return await db.file.findMany({
      where: {
        userId,
      },
    })
  }),

  getFileMessages: privateProcedure
    .input(z.object({
      fileId: z.string(),
      limit: z.number(),
      cursor: z.string().nullish().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx
      const { fileId, limit, cursor } = input

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId,
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        cursor: cursor ? { id: cursor } : undefined,
      })

      let nextCursor: typeof cursor = undefined
      if (messages.length > limit) {
        const nextItem = messages.pop()
        nextCursor = nextItem?.id
      }

      return {
        messages,
        nextCursor,
      }
    }),

  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Try to find file by ID first
      let file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
        select: {
          id: true,
          key: true,
          uploadStatus: true,
          processingProgress: true,
        },
      })

      // If not found by ID, try by key
      if (!file) {
        file = await db.file.findFirst({
          where: {
            key: input.fileId,
            userId: ctx.userId,
          },
          select: {
            id: true,
            key: true,
            uploadStatus: true,
            processingProgress: true,
          },
        })
      }

      if (!file) return { 
        status: 'PENDING' as const,
        progress: 0,
        id: input.fileId,
      }

      return { 
        status: file.uploadStatus,
        progress: file.processingProgress,
        id: file.id,
      }
    }),

  getFile: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx

      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId
        }
      })

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

      return file
    }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId
        }
      })

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

      await db.file.delete({
        where: {
          id: input.id
        }
      })

      return file
    }),
})

export type AppRouter = typeof appRouter
