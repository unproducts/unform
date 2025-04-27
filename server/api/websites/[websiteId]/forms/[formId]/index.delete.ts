import { formsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { formId, websiteId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  await db
    .delete(formsTable)
    .where(and(eq(formsTable.id, formId), eq(formsTable.websiteId, websiteId), eq(formsTable.adminId, user.id)));

  return sendNoContent(event);
});
