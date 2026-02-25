import { db } from '@/lib/db';
import { ipPages, ipAccessGrants } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function checkIpAccess(ipId: string, userId: string | null) {
    const ip = await db.query.ipPages.findFirst({
        where: eq(ipPages.id, ipId),
    });

    if (!ip) return { allowed: false, reason: 'not_found' as const };
    if (ip.visibility === 'public') return { allowed: true, ip };
    if (!userId) return { allowed: false, reason: 'unauthenticated' as const };
    if (ip.ownerId === userId) return { allowed: true, ip };

    if (ip.visibility === 'selected') {
        const grant = await db.query.ipAccessGrants.findFirst({
            where: and(
                eq(ipAccessGrants.ipId, ipId),
                eq(ipAccessGrants.userId, userId)
            ),
        });
        return { allowed: !!grant, ip: grant ? ip : undefined };
    }

    return { allowed: false, reason: 'forbidden' as const };
}
