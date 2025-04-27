import { formsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { updateFormSchema, Form } from '~~/shared/schemas/form';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { formId, websiteId } = getRouterParams(event);
  const { user } = await authenticateRequest(event);
  const db = await useDatabase();
  const body = await readValidatedBody(event, updateFormSchema.parse);
  const form = await db
    .update(formsTable)
    .set(body)
    .where(and(eq(formsTable.id, formId), eq(formsTable.websiteId, websiteId), eq(formsTable.adminId, user.id)))
    .returning();

  if (!form || !form.length) {
    throw createError({
      statusCode: 404,
      message: 'Form not found',
    });
  }

  return form[0]! as unknown as Form;
});
