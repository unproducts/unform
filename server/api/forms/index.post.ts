import authenticateRequest from '~~/server/utils/auth';
import { createFormSchema, Form } from '~~/shared/schemas/form';
import { formsTable } from '~~/server/db/schema';

export default defineEventHandler(async (event) => {
  const { user } = await authenticateRequest(event);
  const body = await readValidatedBody(event, createFormSchema.parse);
  const db = await useDatabase();
  const form = await db
    .insert(formsTable)
    .values({
      ...body,
      adminId: user.id,
    })
    .returning();

  return form[0]! as unknown as Form;
});
