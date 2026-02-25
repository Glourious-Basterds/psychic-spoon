import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env before anything else
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
    console.log('Resetting auth tables...');

    // Import db dynamically AFTER env is loaded
    const { db } = await import('../lib/db');
    const { sql } = await import('drizzle-orm');

    try {
        await db.execute(sql`DROP TABLE IF EXISTS "sessions" CASCADE;`);
        await db.execute(sql`DROP TABLE IF EXISTS "accounts" CASCADE;`);
        await db.execute(sql`DROP TABLE IF EXISTS "verification_tokens" CASCADE;`);
        await db.execute(sql`DROP TABLE IF EXISTS "users" CASCADE;`);
        console.log('Auth tables dropped successfully.');
    } catch (e) {
        console.error('Error dropping tables:', e);
    }
}

main().catch(console.error).finally(() => process.exit(0));
