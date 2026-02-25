import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { projects, projectMembers, projectChannels } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const createProjectSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    ipId: z.string().uuid().optional(),
    visibility: z.enum(['public', 'private']).default('private'),
    channels: z.array(z.string()).optional(),
});

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const members = await db.query.projectMembers.findMany({
        where: eq(projectMembers.userId, session.user.id),
        with: { project: true },
    });

    const userProjects = members.map((m) => m.project).filter(Boolean);
    return NextResponse.json(userProjects);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const { title, description, ipId, visibility, channels = ['generale', 'annunci'] } = parsed.data;

    const [project] = await db
        .insert(projects)
        .values({ title, description, ipId, leaderId: session.user.id, visibility })
        .returning();

    // Crea canali di default
    const channelData = channels.map((name, i) => ({
        projectId: project.id,
        name,
        type: i === 0 ? 'general' : i === 1 ? 'announcements' : 'work',
        position: i,
    }));
    const createdChannels = await db.insert(projectChannels).values(channelData).returning();

    // Aggiungi il leader come membro
    await db.insert(projectMembers).values({
        projectId: project.id,
        userId: session.user.id,
        role: 'Project Leader',
        channelId: createdChannels[0]?.id,
        status: 'active',
    });

    return NextResponse.json(project, { status: 201 });
}
