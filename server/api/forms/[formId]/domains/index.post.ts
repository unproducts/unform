import { formDomainsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { createFormDomainSchema, FormDomain } from '~~/shared/schemas/form';

export default defineEventHandler(async (event) => {
  const { formId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const body = await readValidatedBody(event, createFormDomainSchema.parse);
  const domain = await db
    .insert(formDomainsTable)
    .values({
      ...body,
      adminId: user.id,
      formId,
    })
    .returning();

  return domain[0]! as unknown as FormDomain;
});
