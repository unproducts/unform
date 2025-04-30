import { integrationsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { updateIntegrationSchema, Integration } from '~~/shared/schemas/integration';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { integrationId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const body = await readValidatedBody(event, updateIntegrationSchema.parse);
  const integration = await db
    .update(integrationsTable)
    .set(body)
    .where(and(eq(integrationsTable.id, integrationId), eq(integrationsTable.adminId, user.id)))
    .returning();

  if (!integration || !integration.length) {
    throw createError({
      statusCode: 404,
      message: 'Integration not found',
    });
  }

  return integration[0]! as unknown as Integration;
});
