import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Campi mancanti' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return NextResponse.json({ message: 'Utente già registrato con questa email' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: 'Registrazione completata' }, { status: 201 });
    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ message: 'Errore interno del server' }, { status: 500 });
    }
}
