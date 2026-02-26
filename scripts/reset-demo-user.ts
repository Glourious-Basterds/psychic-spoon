import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../lib/db/schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
    console.log('--- RESET DEMO USER ---');

    const email = 'demo@hashi.com';
    const password = 'demo123';
    const name = 'Demo User';
    const username = 'demo';

    console.log(`Target User: ${email}`);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully.');

    try {
        // We use a transaction or serial execution to ensure the user is reset
        console.log('Eliminating existing user if any...');
        await db.delete(schema.users).where(eq(schema.users.email, email));

        console.log('Inserting new demo user...');
        await db.insert(schema.users).values({
            email,
            password: hashedPassword,
            name,
            username,
            isVerified: true,
            reputationScore: '100.00',
        });

        console.log('SUCCESS: Demo user reset completed!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    } catch (error) {
        console.error('ERROR during reset:', error);
        process.exit(1);
    }
}

main().catch(console.error);
