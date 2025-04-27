import { formsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { and, eq } from 'drizzle-orm';
import { Form } from '~/shared/schemas/form';

export default defineEventHandler(async (event) => {
  const { formId, websiteId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const form = await db
    .select()
    .from(formsTable)
    .where(and(eq(formsTable.id, formId), eq(formsTable.websiteId, websiteId), eq(formsTable.adminId, user.id)));

  if (!form || !form.length) {
    throw createError({
      statusCode: 404,
      message: 'Form not found',
    });
  }

  // @ts-expect-error adminId deleted, but type says otherwise.
  delete form[0]!.adminId;
  // @ts-expect-error websiteId deleted, but type says otherwise.
  delete form[0]!.websiteId;

  return form[0]! as unknown as Form;
});
