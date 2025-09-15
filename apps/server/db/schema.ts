import { relations } from 'drizzle-orm'
import {
  bigint,
  boolean,
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
import { ONE_GIGABYTE_IN_BYTES } from '~/lib/constants'

interface ActivitySectionBase {
  id: string
  isAttached?: boolean
  title?: string
  icon?: string
  color?: string
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
  points: any[]
  routes: any[]
  drawnRoutes: any[]
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
export const communityPrivacyEnum = pgEnum('community_privacy', ['public', 'private'])
export const communityMemberRoleEnum = pgEnum('community_member_role', ['admin', 'moderator', 'member'])

export const tripSectionTypeEnum = pgEnum('trip_section_type', [
  'bookings', // Бронирования (отели, авиа)
  'finances', // Финансы
  'checklist', // Чек-листы
  'notes', // Общие заметки (гибкий/кастомный раздел)
])

// Таблица для тарифных планов
export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(), // e.g., "Free", "Pro"
  maxTrips: integer('max_trips').notNull().default(1),
  maxStorageBytes: bigint('max_storage_bytes', { mode: 'number' }).notNull().default(ONE_GIGABYTE_IN_BYTES),
  isDeveloping: boolean('is_developing').default(false).notNull(),
})

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

  // --- ПОЛЯ ДЛЯ КВОТ ---
  planId: integer('plan_id').references(() => plans.id).notNull().default(1), // FK на тарифный план
  currentTripsCount: integer('current_trips_count').notNull().default(0),
  currentStorageBytes: bigint('current_storage_bytes', { mode: 'number' }).notNull().default(0),

  // --- ПОЛЯ ДЛЯ СТАТУСА ---
  statusText: text('status_text'),
  statusEmoji: text('status_emoji'),

  // Таймстампы
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, t => ({
  emailIndex: index('email_idx').on(t.email),
}))

// Новая таблица для токенов верификации почты
export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  token: text('token').notNull(), // 6-значный код
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(), // Хешированный пароль
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
}, t => ({
  emailIndex: index('verification_email_idx').on(t.email),
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

export const tripSections = pgTable('trip_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  type: tripSectionTypeEnum('type').notNull(),
  title: text('title').notNull(),
  icon: text('icon'),
  content: jsonb('content').$type<any>().default('{}'), // Позволяет хранить любую структуру
  order: integer('order').notNull().default(0),
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
  originalName: text('original_name').notNull(),
  url: text('url').notNull(),
  placement: tripImagePlacementEnum('placement').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull().default(0), // Размер файла в байтах

  takenAt: timestamp('taken_at'),
  latitude: real('latitude'), // Для отображения на карте
  longitude: real('longitude'), // Для отображения на карте

  width: integer('width'),
  height: integer('height'),

  variants: jsonb('variants').$type<Record<string, string>>(), // { small: '...', medium: '...', large: '...' }

  // --- Все остальные метаданные в одном поле JSONB ---
  metadata: jsonb('metadata'),
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

// Таблица для воспоминаний (Memories)
export const memories = pgTable('memories', {
  id: uuid('id').primaryKey().defaultRandom(),
  tripId: uuid('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp'), // Может быть null для неотсортированных
  comment: text('comment'),
  imageId: uuid('image_id').references(() => tripImages.id, { onDelete: 'cascade' }), // Если null - это текстовая заметка
  title: text('title'),
  tag: activityTagEnum('tag'),
  sourceActivityId: uuid('source_activity_id').references(() => activities.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// ===============================================
// ================= СООБЩЕСТВА ==================
// ===============================================

export const communities = pgTable('communities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  coverImageUrl: text('cover_image_url'),
  avatarUrl: text('avatar_url'),
  privacyType: communityPrivacyEnum('privacy_type').notNull().default('public'),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const communityMembers = pgTable('community_members', {
  communityId: uuid('community_id').notNull().references(() => communities.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: communityMemberRoleEnum('role').notNull().default('member'),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
}, t => ({
  pk: primaryKey({ columns: [t.communityId, t.userId] }),
}))

// ===============================================
// =================== СВЯЗИ =====================
// ===============================================

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
  sections: many(tripSections),
}))

export const tripSectionsRelations = relations(tripSections, ({ one }) => ({
  trip: one(trips, {
    fields: [tripSections.tripId],
    references: [trips.id],
  }),
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

export const commentParentTypeEnum = pgEnum('comment_parent_type', ['trip', 'day'])

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text('text').notNull(),

  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Полиморфная связь
  parentId: uuid('parent_id').notNull(),
  parentType: commentParentTypeEnum('parent_type').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, t => ({
  parentIndex: index('parent_idx').on(t.parentId),
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  // Обратные связи к trip, day, activity не указываем здесь из-за полиморфизма,
  // будем делать join в запросах
}))

export const usersRelations = relations(users, ({ many, one }) => ({
  trips: many(trips),
  refreshTokens: many(refreshTokens),
  tripParticipations: many(tripParticipants),
  comments: many(comments),
  plan: one(plans, { // Связь пользователя с его планом
    fields: [users.planId],
    references: [plans.id],
  }),
  communityMemberships: many(communityMembers), // Пользователь может состоять во многих сообществах
}))

export const plansRelations = relations(plans, ({ many }) => ({
  users: many(users), // Связь плана с пользователями
}))

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}))

// Связи для Сообществ
export const communitiesRelations = relations(communities, ({ one, many }) => ({
  owner: one(users, {
    fields: [communities.ownerId],
    references: [users.id],
  }),
  members: many(communityMembers),
}))

export const communityMembersRelations = relations(communityMembers, ({ one }) => ({
  community: one(communities, {
    fields: [communityMembers.communityId],
    references: [communities.id],
  }),
  user: one(users, {
    fields: [communityMembers.userId],
    references: [users.id],
  }),
}))
