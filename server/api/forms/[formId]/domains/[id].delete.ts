import authenticateRequest from '~~/server/utils/auth';
import { formDomainsTable } from '~~/server/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const { formId } = getRouterParams(event);

  await db
    .delete(formDomainsTable)
    .where(
      and(eq(formDomainsTable.id, id), eq(formDomainsTable.adminId, user.id), eq(formDomainsTable.formId, formId))
    );

  return sendNoContent(event);
});
