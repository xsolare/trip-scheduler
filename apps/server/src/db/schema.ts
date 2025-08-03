import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Таблица для путешествий (Trips)
export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  imageUrl: text('image_url'),
  description: text('description'),
  days: integer('days').default(0),
  startDate: text('start_date'),
  endDate: text('end_date'),
  cities: text('cities', { mode: 'json' }).$type<string[]>(),
  participants: text('participants', { mode: 'json' }).$type<string[]>(),
  tags: text('tags', { mode: 'json' }).$type<string[]>(),
  status: text('status', { enum: ['completed', 'planned', 'draft'] }).default('draft'),
  budget: real('budget').default(0),
  currency: text('currency').default('RUB'),
  visibility: text('visibility', { enum: ['public', 'private'] }).default('private'),
})

// Таблица для дней (Days)
export const days = sqliteTable('days', {
  id: text('id').primaryKey(),
  tripId: text('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  title: text('title').notNull(),
  description: text('description'),
})

// Таблица для активностей (Activities)
export const activities = sqliteTable('activities', {
  id: text('id').primaryKey(),
  dayId: text('day_id').notNull().references(() => days.id, { onDelete: 'cascade' }),
  startTime: text('start_time'),
  endTime: text('end_time'),
  title: text('title').notNull(),
  sections: text('sections', { mode: 'json' }).$type<Array<{ id: string, type: string, text: string }>>(),
})

// Определяем отношения между таблицами
export const tripsRelations = relations(trips, ({ many }) => ({
  days: many(days),
}))

export const daysRelations = relations(days, ({ one, many }) => ({
  trip: one(trips, {
    fields: [days.tripId],
    references: [trips.id],
  }),
  activities: many(activities),
}))

export const activitiesRelations = relations(activities, ({ one }) => ({
  day: one(days, {
    fields: [activities.dayId],
    references: [days.id],
  }),
}))
