import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../lib/db/schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function diagnose() {
    const email = 'demo@hashi.com';
    const password = 'demo123';

    console.log(`--- DIAGNOSING LOGIN FOR ${email} ---`);

    const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
    });

    if (!user) {
        console.error('FAIL: User NOT found in database!');
        return;
    }

    console.log('SUCCESS: User found in database.');
    console.log('User ID:', user.id);
    console.log('Stored Hash:', user.password);

    if (!user.password) {
        console.error('FAIL: User has no password set!');
        return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
        console.log('SUCCESS: Hash comparison is CORRECT!');
    } else {
        console.error('FAIL: Hash comparison FAILED!');

        // Let's test if the hash was generated with a different bcrypt
        const testHash = await bcrypt.hash(password, 10);
        console.log('New Test Hash from this env:', testHash);
        const doubleCheck = await bcrypt.compare(password, testHash);
        console.log('Double check with new hash works?', doubleCheck);
    }
}

diagnose().catch(console.error);
