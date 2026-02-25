import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { projects } from './projects';
import { ipPages } from './ip';

export const productionCredits = pgTable('production_credits', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    ipId: uuid('ip_id').references(() => ipPages.id, { onDelete: 'set null' }),
    role: varchar('role', { length: 100 }),
    contribution: text('contribution'),
    isPublic: boolean('is_public').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
