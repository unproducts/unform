import { and, eq } from 'drizzle-orm';
import { formIntegrationsTable, formsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { createFormIntegrationSchema, FormIntegration } from '~~/shared/schemas/form';

export default defineEventHandler(async (event) => {
  const { formId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const body = await readValidatedBody(event, createFormIntegrationSchema.parse);

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

  const integration = await db
    .insert(formIntegrationsTable)
    .values({ ...body, formId: form.id })
    .returning();

  console.log(integration);

  return integration[0]! as unknown as FormIntegration;
});
