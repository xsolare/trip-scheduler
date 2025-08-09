import type { IActivityRepository } from '../../model/types'
import type { Activity } from '~/shared/types/models/activity'
import { throttle } from '../../lib/decorators'

class ActivityRepository implements IActivityRepository {
  @throttle(1000)
  async create(activityData: Omit<Activity, 'id'>): Promise<Activity> {
    // eslint-disable-next-line no-console
    console.log('[Mock] Creating activity:', activityData)
    const newActivity: Activity = {
      ...activityData,
      id: `mock-activity-${Date.now()}`,
    }
    return Promise.resolve(newActivity)
  }

  @throttle(1000)
  async remove(id: string): Promise<Activity> {
    // В моке мы просто возвращаем фиктивный объект,
    // так как реальное удаление из MOCK_DATA не требуется для теста.
    // eslint-disable-next-line no-console
    console.log(`[Mock] Removing activity with id: ${id}`)

    return Promise.resolve({ id } as Activity)
  }
}

export { ActivityRepository }
