import { integrationConfigsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { integrationId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  await db
    .delete(integrationConfigsTable)
    .where(and(eq(integrationConfigsTable.id, integrationId), eq(integrationConfigsTable.adminId, user.id)));

  return sendNoContent(event);
});
