import { websitesTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { user } = await authenticateRequest(event);

  const db = await useDatabase();
  await db.delete(websitesTable).where(and(eq(websitesTable.id, id), eq(websitesTable.adminId, user.id)));

  return sendNoContent(event);
});
