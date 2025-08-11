import type { AppRouter } from '~/shared/types/trpc'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_APP_SERVER_URL}/trpc`,
    }),
  ],
})
