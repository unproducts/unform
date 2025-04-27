import { websitesTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { and, eq } from 'drizzle-orm';
import { Website } from '~/shared/schemas/website';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const website = await db
    .select()
    .from(websitesTable)
    .where(and(eq(websitesTable.id, id), eq(websitesTable.adminId, user.id)))
    .limit(1);

  if (!website || !website.length) {
    throw createError({
      statusCode: 404,
      message: 'Website not found',
    });
  }

  // @ts-expect-error adminId deleted, but type says otherwise.
  delete website[0]!.adminId;

  return website[0]! as unknown as Website;
});
