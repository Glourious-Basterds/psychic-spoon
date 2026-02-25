import { pgTable, uuid, varchar, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { ipPages } from './ip';

// ──────────────────────────────────────────────
// Progetti
// ──────────────────────────────────────────────

export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    ipId: uuid('ip_id').references(() => ipPages.id, { onDelete: 'set null' }),
    leaderId: uuid('leader_id').references(() => users.id, { onDelete: 'restrict' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 30 }).default('setup'),
    currentPhase: varchar('current_phase', { length: 100 }),
    visibility: varchar('visibility', { length: 20 }).default('private'),
    coverImageUrl: text('cover_image_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const projectChannels = pgTable('project_channels', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    type: varchar('type', { length: 30 }).default('work'),
    position: integer('position').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const projectMembers = pgTable('project_members', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    role: varchar('role', { length: 100 }),
    channelId: uuid('channel_id').references(() => projectChannels.id, { onDelete: 'set null' }),
    status: varchar('status', { length: 20 }).default('active'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
    leftAt: timestamp('left_at', { withTimezone: true }),
    leaveReason: text('leave_reason'),
    leaveApproved: boolean('leave_approved'),
});
