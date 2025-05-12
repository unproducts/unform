import authenticateRequest from '~~/server/utils/auth';
import { formIntegrationsTable, formsTable } from '~~/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { FormIntegration } from '~~/shared/schemas/form';

export default defineEventHandler(async (event) => {
  const { formId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const formResponse = await db
    .select()
    .from(formsTable)
    .where(and(eq(formsTable.id, formId), eq(formsTable.adminId, user.id)));

  if (!formResponse || formResponse.length !== 1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Form not found',
    });
  }

  const form = formResponse[0];

  const integrations = await db.select().from(formIntegrationsTable).where(eq(formIntegrationsTable.formId, form.id));

  return integrations.map((integration) => {
    const { formId, ...rest } = integration;
    return rest as unknown as FormIntegration;
  });
});
