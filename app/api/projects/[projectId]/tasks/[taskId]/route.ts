import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { tasks, taskActivity, projectMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const updateTaskSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'in_review', 'completed', 'blocked']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    assignedTo: z.string().uuid().nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
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

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
    const { projectId, taskId } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!(await isMember(projectId, session.user.id)))
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const existing = await db.query.tasks.findFirst({ where: eq(tasks.id, taskId) });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updates: Record<string, unknown> = {
        ...parsed.data,
        updatedAt: new Date(),
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : parsed.data.dueDate === null ? null : undefined,
    };
    if (parsed.data.status === 'completed') {
        updates.completedAt = new Date();
    }

    const [updated] = await db.update(tasks).set(updates).where(eq(tasks.id, taskId)).returning();

    if (parsed.data.status && parsed.data.status !== existing.status) {
        await db.insert(taskActivity).values({
            taskId: taskId,
            userId: session.user.id,
            action: 'status_change',
            oldValue: existing.status,
            newValue: parsed.data.status,
        });
    }

    return NextResponse.json(updated);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
    const { projectId, taskId } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!(await isMember(projectId, session.user.id)))
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await db.delete(tasks).where(eq(tasks.id, taskId));
    return NextResponse.json({ success: true });
}
