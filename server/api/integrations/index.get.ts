import { eq } from 'drizzle-orm';
import { integrationConfigsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { IntegrationConfig } from '~~/shared/schemas/integration';

export default defineEventHandler(async (event) => {
  const { user } = await authenticateRequest(event);

  const db = await useDatabase();
  const integrationConfigs = await db
    .select()
    .from(integrationConfigsTable)
    .where(eq(integrationConfigsTable.adminId, user.id));
  return integrationConfigs.map((integrationConfig) => {
    const { adminId, ...rest } = integrationConfig;
    return rest as unknown as IntegrationConfig;
  });
});
