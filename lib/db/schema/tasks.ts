import { pgTable, uuid, varchar, text, integer, timestamp, date } from 'drizzle-orm/pg-core';
import { users } from './users';
import { projects } from './projects';
import { projectChannels } from './projects';

export const milestones = pgTable('milestones', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    dueDate: date('due_date'),
    status: varchar('status', { length: 30 }).default('pending'),
    position: integer('position').default(0),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const tasks = pgTable('tasks', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    milestoneId: uuid('milestone_id').references(() => milestones.id, { onDelete: 'set null' }),
    channelId: uuid('channel_id').references(() => projectChannels.id, { onDelete: 'set null' }),
    assignedTo: uuid('assigned_to').references(() => users.id, { onDelete: 'set null' }),
    createdBy: uuid('created_by').references(() => users.id),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 30 }).default('todo'),
    priority: varchar('priority', { length: 20 }).default('medium'),
    dueDate: timestamp('due_date', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const taskActivity = pgTable('task_activity', {
    id: uuid('id').primaryKey().defaultRandom(),
    taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id),
    action: varchar('action', { length: 50 }),
    oldValue: text('old_value'),
    newValue: text('new_value'),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
