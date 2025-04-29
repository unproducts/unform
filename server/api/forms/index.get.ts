import { eq } from 'drizzle-orm';
import { formsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { Form } from '~~/shared/schemas/form';

export default defineEventHandler(async (event) => {
  const { user } = await authenticateRequest(event);

  const db = await useDatabase();
  const forms = await db.select().from(formsTable).where(eq(formsTable.adminId, user.id));
  return forms.map((form) => {
    const { adminId, ...rest } = form;
    return rest as unknown as Form;
  });
});
