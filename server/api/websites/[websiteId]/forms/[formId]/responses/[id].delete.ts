import authenticateRequest from '~~/server/utils/auth';
import { formResponsesTable } from '~~/server/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const { websiteId, formId } = getRouterParams(event);

  const response = await db
    .delete(formResponsesTable)
    .where(
      and(
        eq(formResponsesTable.id, id),
        eq(formResponsesTable.adminId, user.id),
        eq(formResponsesTable.websiteId, websiteId),
        eq(formResponsesTable.formId, formId)
      )
    );

  return response;
});
