import authenticateRequest from '~~/server/utils/auth';
import { formResponsesTable, formsTable } from '~~/server/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const { formId } = getRouterParams(event);

  const formResponse = await db
    .select()
    .from(formsTable)
    .where(and(eq(formsTable.id, formId), eq(formsTable.adminId, user.id)));

  if (!formResponse || formResponse.length !== 1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Form response not found',
    });
  }

  const form = formResponse[0];

  await db.delete(formResponsesTable).where(and(eq(formResponsesTable.id, id), eq(formResponsesTable.formId, form.id)));

  return sendNoContent(event);
});
