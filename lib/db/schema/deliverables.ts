import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { projects } from './projects';
import { projectChannels } from './projects';
import { tasks } from './tasks';

export const deliverables = pgTable('deliverables', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'set null' }),
    channelId: uuid('channel_id').references(() => projectChannels.id, { onDelete: 'set null' }),
    submittedBy: uuid('submitted_by').references(() => users.id),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    fileUrl: text('file_url').notNull(),
    fileType: varchar('file_type', { length: 50 }),
    version: integer('version').default(1),
    status: varchar('status', { length: 30 }).default('submitted'),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
});

export const deliverableFeedback = pgTable('deliverable_feedback', {
    id: uuid('id').primaryKey().defaultRandom(),
    deliverableId: uuid('deliverable_id').references(() => deliverables.id, { onDelete: 'cascade' }).notNull(),
    reviewerId: uuid('reviewer_id').references(() => users.id),
    comment: text('comment').notNull(),
    status: varchar('status', { length: 30 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
