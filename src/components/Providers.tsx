'use client'

import { trpc } from '@/app/_trpc/client'
import { absoluteUrl } from '@/lib/utils'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { PropsWithChildren, useState } from 'react'

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 3,
        staleTime: 5 * 1000,
      },
      mutations: {
        retry: 3,
      },
    },
  }))

  const [trpcClient] = useState(() => {
    const url = absoluteUrl('/api/trpc')
    return trpc.createClient({
      links: [
        httpBatchLink({
          url,
          headers: () => ({
            'x-trpc-source': 'react',
          }),
        }),
      ],
    })
  })

  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default Providers
