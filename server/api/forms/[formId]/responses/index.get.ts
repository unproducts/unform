import authenticateRequest from '~~/server/utils/auth';
import { formResponsesTable } from '~~/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { FormResponse } from '~~/shared/schemas/form';

export default defineEventHandler(async (event) => {
  const { formId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const responses = await db
    .select()
    .from(formResponsesTable)
    .where(and(eq(formResponsesTable.formId, formId), eq(formResponsesTable.adminId, user.id)));

  return responses.map((response) => {
    const { adminId, formId, ...rest } = response;
    return rest as unknown as FormResponse;
  });
});
