import type { IActivityRepository } from '../../model/types'
import type { Activity } from '~/shared/types/models/activity'
import { trpc } from '~/shared/services/trpc/trpc.service'
import { throttle } from '../../lib/decorators'

class ActivityRepository implements IActivityRepository {
  /**
   * Создает новую активность через tRPC мутацию.
   * @param activityData - Данные новой активности.
   * @returns Promise<Activity> - Созданная активность с ID от сервера.
   */
  @throttle(1000)
  async create(activityData: Omit<Activity, 'id'>): Promise<Activity> {
    const createdActivity = await trpc.activity.create.mutate(activityData)

    return createdActivity as unknown as Activity
  }

  /**
   * Удаляет активность по ID через tRPC мутацию.
   * @param id - Уникальный идентификатор активности.
   * @returns Promise<Activity> - Удаленная активность.
   */
  @throttle(1000)
  async remove(id: string): Promise<Activity> {
    const deletedActivity = await trpc.activity.delete.mutate({ id })

    return deletedActivity as unknown as Activity
  }
}

export { ActivityRepository }
