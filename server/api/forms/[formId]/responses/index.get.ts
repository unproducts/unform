import authenticateRequest from '~~/server/utils/auth';
import { formResponsesTable, formsTable } from '~~/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { FormResponse } from '~~/shared/schemas/form';

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
  const responses = await db.select().from(formResponsesTable).where(eq(formResponsesTable.formId, form.id));

  return responses.map((response) => {
    const { formId, ...rest } = response;
    return rest as unknown as FormResponse;
  });
});
