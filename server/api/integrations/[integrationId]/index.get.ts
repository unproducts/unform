import { integrationConfigsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { and, eq } from 'drizzle-orm';
import { IntegrationConfig } from '~~/shared/schemas/integration';

export default defineEventHandler(async (event) => {
  const { integrationId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const integration = await db
    .select()
    .from(integrationConfigsTable)
    .where(and(eq(integrationConfigsTable.id, integrationId), eq(integrationConfigsTable.adminId, user.id)));

  if (!integration || !integration.length) {
    throw createError({
      statusCode: 404,
      message: 'Integration not found',
    });
  }

  // @ts-expect-error adminId deleted, but type says otherwise.
  delete integration[0]!.adminId;

  return integration[0]! as unknown as IntegrationConfig;
});
