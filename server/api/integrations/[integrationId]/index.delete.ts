import { integrationsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { integrationId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  await db
    .delete(integrationsTable)
    .where(and(eq(integrationsTable.id, integrationId), eq(integrationsTable.adminId, user.id)));

  return sendNoContent(event);
});
