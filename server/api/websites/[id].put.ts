import { websitesTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { updateWebsiteSchema, Website } from '~~/shared/schemas/website';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const body = await readValidatedBody(event, updateWebsiteSchema.parse);
  const db = await useDatabase();
  const website = await db
    .update(websitesTable)
    .set(body)
    .where(and(eq(websitesTable.id, id), eq(websitesTable.adminId, user.id)))
    .returning();

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
