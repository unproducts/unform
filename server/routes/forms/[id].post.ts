import { eq } from 'drizzle-orm';
import { formsTable, formResponsesTable, websitesTable } from '~~/server/db/schema';
import { useDatabase } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  const { id: formId } = getRouterParams(event);

  const headers = getHeaders(event);
  console.log('headers', headers);
  const origin = headers.origin || headers.referer;

  const db = await useDatabase();

  const form = await db.select().from(formsTable).where(eq(formsTable.id, formId)).limit(1);

  if (!form || form.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Form not found',
    });
  }

  const website = await db.select().from(websitesTable).where(eq(websitesTable.id, form[0].websiteId)).limit(1);

  if (!website || website.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Website not found',
    });
  }

  if (origin) {
    const websiteDomain = website[0].domain;
    let originDomain = '';
    try {
      const originUrl = new URL(origin);
      originDomain = originUrl.hostname;
    } catch (e) {
      console.error('Invalid origin format:', origin);
      throw createError({
        statusCode: 400,
        message: 'Invalid origin',
      });
    }

    if (originDomain && !originDomain.includes(websiteDomain) && !websiteDomain.includes(originDomain)) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden: Form submission from unauthorized domain',
      });
    }
  }

  const formData = await readFormData(event);
  const formDataObject: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    formDataObject[key] = value.toString();
  }

  await db
    .insert(formResponsesTable)
    .values({
      formId,
      adminId: form[0].adminId,
      websiteId: form[0].websiteId,
      data: formDataObject,
    })
    .returning();

  const isApiCall = headers['content-type']?.includes('application/json');

  if (isApiCall) {
    return { success: true, message: 'Form submission received' };
  } else {
    const returnURL = headers.referer || headers.origin || website[0].domain;
    const returnURLObject = new URL(returnURL);
    returnURLObject.searchParams.set('success', 'true');
    return sendRedirect(event, returnURLObject.toString());
  }
});
