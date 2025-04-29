import authenticateRequest from '~~/server/utils/auth';
import { formResponsesTable } from '~~/server/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const { formId } = getRouterParams(event);

  await db
    .delete(formResponsesTable)
    .where(
      and(eq(formResponsesTable.id, id), eq(formResponsesTable.adminId, user.id), eq(formResponsesTable.formId, formId))
    );

  return sendNoContent(event);
});
