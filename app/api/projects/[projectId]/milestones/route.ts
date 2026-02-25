import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { milestones, projectMembers, projects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const milestoneSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    position: z.number().int().default(0),
});

async function isLeader(projectId: string, userId: string) {
    const p = await db.query.projects.findFirst({ where: eq(projects.id, projectId) });
    return p?.leaderId === userId;
}

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

    const result = await db.query.milestones.findMany({
        where: eq(milestones.projectId, projectId),
        orderBy: (m, { asc }) => [asc(m.position)],
    });
    return NextResponse.json(result);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!(await isLeader(projectId, session.user.id)))
        return NextResponse.json({ error: 'Forbidden: leaders only' }, { status: 403 });

    const body = await req.json();
    const parsed = milestoneSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const [milestone] = await db
        .insert(milestones)
        .values({ ...parsed.data, projectId })
        .returning();
    return NextResponse.json(milestone, { status: 201 });
}
