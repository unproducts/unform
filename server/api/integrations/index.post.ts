import authenticateRequest from '~~/server/utils/auth';
import { createIntegrationConfigSchema, IntegrationConfig } from '~~/shared/schemas/integration';
import { integrationConfigsTable } from '~~/server/db/schema';

export default defineEventHandler(async (event) => {
  const { user } = await authenticateRequest(event);
  const body = await readValidatedBody(event, createIntegrationConfigSchema.parse);
  const db = await useDatabase();
  const integration = await db
    .insert(integrationConfigsTable)
    .values({
      ...body,
      adminId: user.id,
    })
    .returning();

  return integration[0]! as unknown as IntegrationConfig;
});
