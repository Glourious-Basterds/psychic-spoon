import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { tasks, taskActivity, projectMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const createTaskSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    assignedTo: z.string().uuid().optional(),
    milestoneId: z.string().uuid().optional(),
    channelId: z.string().uuid().optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    dueDate: z.string().datetime().optional(),
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
    const status = searchParams.get('status');

    let query = db.query.tasks.findMany({
        where: eq(tasks.projectId, projectId),
        with: { assignedUser: true },
        orderBy: (t, { asc }) => [asc(t.createdAt)],
    });

    const result = await query;
    const filtered = result.filter((t) => {
        if (channelId && t.channelId !== channelId) return false;
        if (status && t.status !== status) return false;
        return true;
    });

    return NextResponse.json(filtered);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!(await isMember(projectId, session.user.id)))
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const insertData = {
        ...parsed.data,
        projectId,
        createdBy: session.user.id,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
    };

    const [task] = await db.insert(tasks).values(insertData).returning();

    await db.insert(taskActivity).values({
        taskId: task.id,
        userId: session.user.id,
        action: 'created',
        newValue: 'todo',
    });

    return NextResponse.json(task, { status: 201 });
}
