import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { projects } from './projects';
import { projectChannels } from './projects';

export const messages = pgTable('messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    channelId: uuid('channel_id').references(() => projectChannels.id, { onDelete: 'cascade' }).notNull(),
    senderId: uuid('sender_id').references(() => users.id),
    content: text('content').notNull(),
    type: varchar('type', { length: 30 }).default('text'),
    fileUrl: text('file_url'),
    replyToId: uuid('reply_to_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    editedAt: timestamp('edited_at', { withTimezone: true }),
    isDeleted: boolean('is_deleted').default(false),
});

export const meetings = pgTable('meetings', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    title: varchar('title', { length: 255 }),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
    startedAt: timestamp('started_at', { withTimezone: true }),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    transcriptText: text('transcript_text'),
    summaryText: text('summary_text'),
    recordingUrl: text('recording_url'),
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const meetingParticipants = pgTable('meeting_participants', {
    meetingId: uuid('meeting_id').references(() => meetings.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true }),
    leftAt: timestamp('left_at', { withTimezone: true }),
});
