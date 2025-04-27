import { eq } from 'drizzle-orm';
import { formsTable } from '~~/server/db/schema';
import authenticateRequest from '~~/server/utils/auth';
import { Form } from '~~/shared/schemas/form';

export default defineEventHandler(async (event) => {
  await authenticateRequest(event);

  const { websiteId } = getRouterParams(event);
  const db = await useDatabase();
  const forms = await db.select().from(formsTable).where(eq(formsTable.websiteId, websiteId));
  return forms.map((form) => {
    const { adminId, websiteId, ...rest } = form;
    return rest as unknown as Form;
  });
});
