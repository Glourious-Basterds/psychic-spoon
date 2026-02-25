import { pgTable, uuid, varchar, text, boolean, date, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { projects } from './projects';
import { projectChannels } from './projects';

export const jobPostings = pgTable('job_postings', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    channelId: uuid('channel_id').references(() => projectChannels.id, { onDelete: 'set null' }),
    postedBy: uuid('posted_by').references(() => users.id),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    role: varchar('role', { length: 100 }),
    type: varchar('type', { length: 30 }).notNull(),
    safeSample: text('safe_sample'),
    requirements: text('requirements').array(),
    isPaid: boolean('is_paid').default(false),
    deadline: date('deadline'),
    status: varchar('status', { length: 20 }).default('open'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const jobApplications = pgTable('job_applications', {
    id: uuid('id').primaryKey().defaultRandom(),
    postingId: uuid('posting_id').references(() => jobPostings.id, { onDelete: 'cascade' }).notNull(),
    applicantId: uuid('applicant_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    coverNote: text('cover_note'),
    portfolioUrl: text('portfolio_url'),
    submissionUrl: text('submission_url'),
    creativeDirection: text('creative_direction'),
    status: varchar('status', { length: 30 }).default('pending'),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
