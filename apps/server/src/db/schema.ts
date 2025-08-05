import { relations } from 'drizzle-orm'
import {
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

interface ActivitySectionText { id: string, type: 'description', text: string }
interface ActivitySectionGallery { id: string, type: 'gallery', imageUrls: string[] }
export type ActivitySection = ActivitySectionText | ActivitySectionGallery
export const statusEnum = pgEnum('status', ['completed', 'planned', 'draft'])
export const visibilityEnum = pgEnum('visibility', ['public', 'private'])
export const activitySectionTypeEnum = pgEnum('activity_section_type', ['description', 'gallery'])

// Таблица для путешествий (Trips)
export const trips = pgTable('trips', {
  id: uuid('id').primaryKey(),
  title: text('title').notNull(),
  imageUrl: text('image_url'),
  description: text('description'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  cities: jsonb('cities').$type<string[]>().notNull().default([]),
  status: statusEnum('status').notNull().default('draft'),
  budget: real('budget'),
  currency: text('currency').default('RUB'),
  participants: jsonb('participants').$type<string[]>().notNull().default([]),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  visibility: visibilityEnum('visibility').notNull().default('private'),
  days: integer('days').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const tripImages = pgTable('trip_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Таблица для дней (Days)
export const days = pgTable('days', {
  id: uuid('id').primaryKey(),
  date: date('date').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Таблица для активностей (Activities)
export const activities = pgTable('activities', {
  id: uuid('id').primaryKey(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  title: text('title').notNull(),
  sections: jsonb('sections').$type<ActivitySection[]>().notNull().default([]),
  dayId: uuid('day_id').notNull().references(() => days.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Отношения
export const tripsRelations = relations(trips, ({ many }) => ({
  days: many(days),
  images: many(tripImages),
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

export const tripImagesRelations = relations(tripImages, ({ one }) => ({
  trip: one(trips, {
    fields: [tripImages.tripId],
    references: [trips.id],
  }),
}))
