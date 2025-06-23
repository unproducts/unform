import { integrationConfigsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { updateIntegrationConfigSchema, IntegrationConfig } from '~~/shared/schemas/integration';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { integrationId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const body = await readValidatedBody(event, updateIntegrationConfigSchema.parse);
  const integration = await db
    .update(integrationConfigsTable)
    .set(body)
    .where(and(eq(integrationConfigsTable.id, integrationId), eq(integrationConfigsTable.adminId, user.id)))
    .returning();

  if (!integration || !integration.length) {
    throw createError({
      statusCode: 404,
      message: 'Integration not found',
    });
  }

  return integration[0]! as unknown as IntegrationConfig;
});
