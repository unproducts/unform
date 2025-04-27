import { websitesTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { eq } from 'drizzle-orm';
import { Website } from '~~/shared/schemas/website';

export default defineEventHandler(async (event) => {
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const websites = await db.select().from(websitesTable).where(eq(websitesTable.adminId, user.id));
  return websites.map((website) => {
    // @ts-expect-error adminId deleted, but type says otherwise.
    delete website.adminId;
    return website as unknown as Website;
  });
});
