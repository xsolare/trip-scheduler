// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
// @ts-expect-error - другой проект
import type { AppRouter } from '@xsolare/trip-scheduler-server/router'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_APP_SERVER_URL}/trpc`,
    }),
  ],
})
