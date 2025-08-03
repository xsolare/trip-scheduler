import type { AppRouter } from '@xsolare/trip-scheduler-server/router'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
})
