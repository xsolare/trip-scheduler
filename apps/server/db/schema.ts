import { relations } from 'drizzle-orm'
import {
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

interface ActivitySectionBase {
  id: string
  isAttached?: boolean
  title?: string
  icon?: string
}

export interface DayMetaInfo {
  id: string
  title: string
  subtitle?: string
  icon?: string
  color?: string
  content?: string
}

interface ActivitySectionText extends ActivitySectionBase {
  type: 'description'
  text: string
}

interface ActivitySectionGallery extends ActivitySectionBase {
  type: 'gallery'
  imageUrls: string[]
}

interface ActivitySectionGeolocation extends ActivitySectionBase {
  type: 'geolocation'
  latitude: number
  longitude: number
  address: string
}

export type ActivitySection = ActivitySectionText | ActivitySectionGallery | ActivitySectionGeolocation

// Обновленные Enums
export const statusEnum = pgEnum('status', ['completed', 'planned', 'draft'])
export const visibilityEnum = pgEnum('visibility', ['public', 'private'])
export const activityTagEnum = pgEnum('activity_tag', ['transport', 'walk', 'food', 'attraction', 'relax'])
export const activitySectionTypeEnum = pgEnum('activity_section_type', ['description', 'gallery', 'geolocation'])
export const activityStatusEnum = pgEnum('activity_status', ['none', 'completed', 'skipped'])
export const tripImagePlacementEnum = pgEnum('trip_image_placement', ['route', 'memories'])
export const userRoleEnum = pgEnum('user_role', ['user', 'admin'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),

  role: userRoleEnum('role').notNull().default('user'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  password: text('password'),

  name: text('name'),
  avatarUrl: text('avatar_url'),

  // Поля для OAuth
  githubId: text('github_id').unique(),
  googleId: text('google_id').unique(),

  // Таймстампы
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, t => ({
  emailIndex: index('email_idx').on(t.email),
}))

export const refreshTokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  token: text('token').notNull().unique(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

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
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  visibility: visibilityEnum('visibility').notNull().default('private'),

  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const tripParticipants = pgTable('trip_participants', {
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, t => ({
  pk: primaryKey({ columns: [t.tripId, t.userId] }),
}))

export const tripImages = pgTable('trip_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  placement: tripImagePlacementEnum('placement').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),

  takenAt: timestamp('taken_at'),
  latitude: real('latitude'), // Для отображения на карте
  longitude: real('longitude'), // Для отображения на карте

  width: integer('width'),
  height: integer('height'),

  variants: jsonb('variants').$type<Record<string, string>>(), // { small: '...', medium: '...', large: '...' }

  // --- Все остальные метаданные в одном поле JSONB ---
  metadata: jsonb('metadata'),
})

// Таблица для воспоминаний (Memories)
export const memories = pgTable('memories', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp'), // Может быть null для неотсортированных
  comment: text('comment'),
  imageId: uuid('image_id').references(() => tripImages.id, { onDelete: 'cascade' }), // Если null - это текстовая заметка
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
  meta: jsonb('meta').$type<DayMetaInfo[]>().notNull().default([]),
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
  tag: activityTagEnum('tag'),
  status: activityStatusEnum('status').notNull().default('none'),
  rating: integer('rating'),
  dayId: uuid('day_id').notNull().references(() => days.id, { onDelete: 'cascade' }),
})

// Отношения
export const tripsRelations = relations(trips, ({ one, many }) => ({
  user: one(users, {
    fields: [trips.userId],
    references: [users.id],
  }),
  days: many(days),
  images: many(tripImages),
  memories: many(memories),
  participants: many(tripParticipants),
}))

export const tripParticipantsRelations = relations(tripParticipants, ({ one }) => ({
  trip: one(trips, {
    fields: [tripParticipants.tripId],
    references: [trips.id],
  }),
  user: one(users, {
    fields: [tripParticipants.userId],
    references: [users.id],
  }),
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

export const memoriesRelations = relations(memories, ({ one }) => ({
  trip: one(trips, {
    fields: [memories.tripId],
    references: [trips.id],
  }),
  image: one(tripImages, {
    fields: [memories.imageId],
    references: [tripImages.id],
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  trips: many(trips),
  refreshTokens: many(refreshTokens),
  tripParticipations: many(tripParticipants),
}))

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}))
