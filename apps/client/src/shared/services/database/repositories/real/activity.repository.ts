import type { IActivityRepository } from '../../model/types'
import type { Activity } from '~/shared/types/models/activity'

class ActivityRepository implements IActivityRepository {
  async create(activityData: Omit<Activity, 'id'>): Promise<Activity> {
    // eslint-disable-next-line no-console
    console.log('[Real] Creating activity:', activityData)
    const newActivity: Activity = {
      ...activityData,
      id: `mock-activity-${Date.now()}`,
    }

    return Promise.resolve(newActivity)
  }

  async update(activityData: Activity): Promise<Activity> {
    // eslint-disable-next-line no-console
    console.log('[Mock] Updating activity:', activityData.id, activityData)

    return Promise.resolve(activityData)
  }

  async remove(id: string): Promise<Activity> {
    // eslint-disable-next-line no-console
    console.log(`[Real] Removing activity with id: ${id}`)

    return Promise.resolve({ id } as Activity)
  }
}

export { ActivityRepository }
