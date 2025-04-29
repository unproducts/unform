import authenticateRequest from '~~/server/utils/auth';
import { formDomainsTable } from '~~/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { FormDomain } from '~~/shared/schemas/form';

export default defineEventHandler(async (event) => {
  const { formId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const domains = await db
    .select()
    .from(formDomainsTable)
    .where(and(eq(formDomainsTable.formId, formId), eq(formDomainsTable.adminId, user.id)));

  return domains.map((domain) => {
    const { adminId, formId, ...rest } = domain;
    return rest as unknown as FormDomain;
  });
});
