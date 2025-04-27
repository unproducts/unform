import authenticateRequest from '~/server/utils/auth';
import { createWebsiteSchema, Website } from '~~/shared/schemas/website';
import { websitesTable } from '~~/server/db/schema';

export default defineEventHandler(async (event) => {
  const { user } = await authenticateRequest(event);
  const body = await readValidatedBody(event, createWebsiteSchema.parse);
  const db = await useDatabase();
  const website = await db
    .insert(websitesTable)
    .values({
      ...body,
      adminId: user.id,
    })
    .returning();

  // @ts-expect-error password deleted, but type says otherwise.
  delete website[0]!.adminId;

  return website as unknown as Website;
});
