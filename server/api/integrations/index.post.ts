import authenticateRequest from '~~/server/utils/auth';
import { createIntegrationSchema, Integration } from '~~/shared/schemas/integration';
import { integrationsTable } from '~~/server/db/schema';

export default defineEventHandler(async (event) => {
  const { user } = await authenticateRequest(event);
  const body = await readValidatedBody(event, createIntegrationSchema.parse);
  const db = await useDatabase();
  const integration = await db
    .insert(integrationsTable)
    .values({
      ...body,
      adminId: user.id,
    })
    .returning();

  return integration[0]! as unknown as Integration;
});
