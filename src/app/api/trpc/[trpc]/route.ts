import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/trpc'
import { createContext } from '@/trpc/trpc'

export async function POST(req: Request) {
  console.log('TRPC POST request received:', req.url)
  
  try {
    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      createContext: () => createContext({ req }),
      onError({ error, path }) {
        console.error(`Error in TRPC handler [${path}]:`, error)
      },
    })
    
    return response
  } catch (error) {
    console.error('TRPC handler error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  console.log('TRPC GET request received:', req.url)
  return POST(req)
}
