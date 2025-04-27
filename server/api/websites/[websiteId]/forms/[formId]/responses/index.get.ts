import authenticateRequest from '~~/server/utils/auth';
import { formResponsesTable } from '~~/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { FormResponse } from '~~/shared/schemas/form-response';

export default defineEventHandler(async (event) => {
  const { formId, websiteId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const responses = await db
    .select()
    .from(formResponsesTable)
    .where(
      and(
        eq(formResponsesTable.formId, formId),
        eq(formResponsesTable.websiteId, websiteId),
        eq(formResponsesTable.adminId, user.id)
      )
    );

  return responses.map((response) => {
    const { adminId, websiteId, formId, ...rest } = response;
    return rest as unknown as FormResponse;
  });
});
