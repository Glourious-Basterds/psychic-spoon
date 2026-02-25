import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

// ──────────────────────────────────────────────
// IP (Proprietà Intellettuale)
// ──────────────────────────────────────────────

export const ipPages = pgTable('ip_pages', {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    description: text('description'),
    genre: varchar('genre', { length: 100 }),
    format: varchar('format', { length: 100 }),
    visibility: varchar('visibility', { length: 20 }).default('private'),
    contactMode: varchar('contact_mode', { length: 30 }).default('applications'),
    safeSample: text('safe_sample'),
    styleGuideUrl: text('style_guide_url'),
    coverImageUrl: text('cover_image_url'),
    tags: text('tags').array(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const ipMaterials = pgTable('ip_materials', {
    id: uuid('id').primaryKey().defaultRandom(),
    ipId: uuid('ip_id').references(() => ipPages.id, { onDelete: 'cascade' }).notNull(),
    type: varchar('type', { length: 50 }),
    label: varchar('label', { length: 255 }),
    url: text('url').notNull(),
    isPublic: boolean('is_public').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const ipAccessGrants = pgTable('ip_access_grants', {
    ipId: uuid('ip_id').references(() => ipPages.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    grantedAt: timestamp('granted_at', { withTimezone: true }).defaultNow(),
});
