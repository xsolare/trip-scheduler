import type { IAuthRepository } from '../../model/types'
import type { SignInPayload } from '~/shared/types/models/auth'
import { trpc } from '~/shared/services/trpc/trpc.service'
import { throttle } from '../../lib/decorators'

export class AuthRepository implements IAuthRepository {
  @throttle(1000)
  async signIn(payload: SignInPayload) {
    return trpc.user.signIn.mutate(payload)
  }

  @throttle(1000)
  async signOut() {
    await trpc.user.signOut.mutate()
  }

  @throttle(1000)
  async refresh(refreshToken: string) {
    return trpc.user.refresh.mutate({ refreshToken })
  }

  @throttle(500)
  async me() {
    return trpc.user.me.query()
  }
}
