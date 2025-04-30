import { eq } from 'drizzle-orm';
import { integrationsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { Integration } from '~~/shared/schemas/integration';

export default defineEventHandler(async (event) => {
  const { user } = await authenticateRequest(event);

  const db = await useDatabase();
  const integrations = await db.select().from(integrationsTable).where(eq(integrationsTable.adminId, user.id));
  return integrations.map((integration) => {
    const { adminId, ...rest } = integration;
    return rest as unknown as Integration;
  });
});
