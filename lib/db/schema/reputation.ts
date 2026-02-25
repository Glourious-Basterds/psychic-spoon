import { pgTable, uuid, varchar, text, boolean, decimal, smallint, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { projects } from './projects';
import { milestones } from './tasks';

export const peerReviews = pgTable('peer_reviews', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    milestoneId: uuid('milestone_id').references(() => milestones.id, { onDelete: 'set null' }),
    reviewerId: uuid('reviewer_id').references(() => users.id),
    reviewedId: uuid('reviewed_id').references(() => users.id),
    reliability: smallint('reliability'),
    communication: smallint('communication'),
    punctuality: smallint('punctuality'),
    quality: smallint('quality'),
    toneFit: smallint('tone_fit'),
    creativity: smallint('creativity'),
    collaboration: smallint('collaboration'),
    writtenNote: text('written_note'),
    isPublic: boolean('is_public').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const reputationPenalties = pgTable('reputation_penalties', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
    reason: varchar('reason', { length: 100 }),
    points: decimal('points', { precision: 5, scale: 2 }),
    appliedAt: timestamp('applied_at', { withTimezone: true }).defaultNow(),
    appliedBy: uuid('applied_by').references(() => users.id),
});
