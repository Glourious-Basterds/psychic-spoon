import { pgTable, uuid, varchar, text, boolean, decimal, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';
import { type AdapterAccountType } from 'next-auth/adapters';

// ──────────────────────────────────────────────
// Users & Accounts (Auth.js Compatible)
// ──────────────────────────────────────────────

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).unique().notNull(),
    emailVerified: timestamp('email_verified', { withTimezone: true }),
    image: text('image'),
    // Hashi Custom Fields
    username: varchar('username', { length: 50 }).unique(),
    password: text('password'),
    bio: text('bio'),
    skills: text('skills').array(),
    portfolioUrl: text('portfolio_url'),
    isVerified: boolean('is_verified').default(false),
    reputationScore: decimal('reputation_score', { precision: 5, scale: 2 }).default('0'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const accounts = pgTable('accounts', {
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    type: varchar('type', { length: 255 }).$type<AdapterAccountType>().notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: text('session_state'),
}, (account) => [
    {
        compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    },
]);

export const sessions = pgTable('sessions', {
    sessionToken: text('session_token').primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
}, (vt) => [
    {
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    },
]);
