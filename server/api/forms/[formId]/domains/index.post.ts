import { eq, and } from 'drizzle-orm';
import { formDomainsTable, formsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { createFormDomainSchema, FormDomain } from '~~/shared/schemas/form';

export default defineEventHandler(async (event) => {
  const { formId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const body = await readValidatedBody(event, createFormDomainSchema.parse);

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

  const domain = await db
    .insert(formDomainsTable)
    .values({
      ...body,
      formId: form.id,
    })
    .returning();

  return domain[0]! as unknown as FormDomain;
});
