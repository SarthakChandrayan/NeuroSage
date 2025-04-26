import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { TRPCError, initTRPC } from '@trpc/server'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

export const createContext = async ({ req }: { req: Request }) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  console.log('Context created with user:', user?.id)

  return {
    user,
    userId: user?.id,
    req,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create()
const middleware = t.middleware

const isAuth = middleware(async (opts) => {
  const { user, userId } = opts.ctx

  if (!user || !userId) {
    console.log('Auth failed - no user or userId')
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return opts.next({
    ctx: {
      userId,
      user,
      req: opts.ctx.req,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)
