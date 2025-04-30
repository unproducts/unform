import { integrationsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { and, eq } from 'drizzle-orm';
import { Integration } from '~~/shared/schemas/integration';

export default defineEventHandler(async (event) => {
  const { integrationId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const integration = await db
    .select()
    .from(integrationsTable)
    .where(and(eq(integrationsTable.id, integrationId), eq(integrationsTable.adminId, user.id)));

  if (!integration || !integration.length) {
    throw createError({
      statusCode: 404,
      message: 'Integration not found',
    });
  }

  // @ts-expect-error adminId deleted, but type says otherwise.
  delete integration[0]!.adminId;

  return integration[0]! as unknown as Integration;
});
