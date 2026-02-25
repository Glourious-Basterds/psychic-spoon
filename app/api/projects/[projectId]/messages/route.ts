import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { messages, projectMembers } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

const messageSchema = z.object({
    content: z.string().min(1),
    channelId: z.string().uuid(),
    replyToId: z.string().uuid().optional(),
    type: z.enum(['text', 'file', 'system']).default('text'),
    fileUrl: z.string().url().optional(),
});

async function isMember(projectId: string, userId: string) {
    const m = await db.query.projectMembers.findFirst({
        where: and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, userId),
            eq(projectMembers.status, 'active')
        ),
    });
    return !!m;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!(await isMember(projectId, session.user.id)))
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');
    const limit = parseInt(searchParams.get('limit') ?? '50');

    const result = await db.query.messages.findMany({
        where: and(
            eq(messages.projectId, projectId),
            channelId ? eq(messages.channelId, channelId) : undefined,
            eq(messages.isDeleted, false)
        ),
        with: { sender: true },
        orderBy: [desc(messages.createdAt)],
        limit,
    });

    return NextResponse.json(result.reverse());
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!(await isMember(projectId, session.user.id)))
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const [msg] = await db
        .insert(messages)
        .values({ ...parsed.data, projectId, senderId: session.user.id })
        .returning();

    return NextResponse.json(msg, { status: 201 });
}
