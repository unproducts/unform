import { eq } from 'drizzle-orm';
import { formsTable, formResponsesTable, websitesTable } from '~~/server/db/schema';
import { useDatabase } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  console.log('[Form Submission] Starting form submission handler');
  const { id: formId } = getRouterParams(event);
  console.log('[Form Submission] Processing form ID:', formId);

  const headers = getHeaders(event);
  console.log('[Form Submission] Request headers:', headers);
  const origin = headers.origin || headers.referer;
  console.log('[Form Submission] Request origin:', origin);
  let returnURL = origin;
  try {
    if (getQuery(event).return) {
      console.log('[Form Submission] Found return URL in query params');
      returnURL = atob(getQuery(event).return as string);
      console.log('[Form Submission] Decoded return URL:', returnURL);
    }
  } catch (e) {
    console.error('[Form Submission] Error decoding return URL:', e);
  }

  console.log('[Form Submission] Initializing database connection');
  const db = await useDatabase();

  console.log('[Form Submission] Fetching form details from database');
  const form = await db.select().from(formsTable).where(eq(formsTable.id, formId)).limit(1);
  console.log('[Form Submission] Form query result:', form);

  if (!form || form.length === 0) {
    console.error('[Form Submission] Form not found for ID:', formId);
    throw createError({
      statusCode: 404,
      message: 'Form not found',
    });
  }

  console.log('[Form Submission] Fetching website details');
  const website = await db.select().from(websitesTable).where(eq(websitesTable.id, form[0].websiteId)).limit(1);
  console.log('[Form Submission] Website query result:', website);

  if (!website || website.length === 0) {
    console.error('[Form Submission] Website not found for form:', formId);
    throw createError({
      statusCode: 404,
      message: 'Website not found',
    });
  }

  if (origin) {
    const websiteDomain = website[0].domain;
    console.log('[Form Submission] Checking domain authorization. Website domain:', websiteDomain);
    let originDomain = '';
    try {
      const originUrl = new URL(origin);
      originDomain = originUrl.hostname;
      console.log('[Form Submission] Origin domain:', originDomain);
    } catch (e) {
      console.error('[Form Submission] Invalid origin format:', origin, e);
      throw createError({
        statusCode: 400,
        message: 'Invalid origin',
      });
    }

    if (originDomain && !originDomain.includes(websiteDomain) && !websiteDomain.includes(originDomain)) {
      console.error('[Form Submission] Domain authorization failed. Origin:', originDomain, 'Website:', websiteDomain);
      throw createError({
        statusCode: 403,
        message: 'Forbidden: Form submission from unauthorized domain',
      });
    }
    console.log('[Form Submission] Domain authorization successful');
  }

  console.log('[Form Submission] Reading form data');
  const formData = await readFormData(event);
  const formDataObject: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    formDataObject[key] = value.toString();
  }
  console.log('[Form Submission] Processed form data:', formDataObject);

  console.log('[Form Submission] Inserting form response into database');
  const response = await db
    .insert(formResponsesTable)
    .values({
      formId,
      adminId: form[0].adminId,
      websiteId: form[0].websiteId,
      data: formDataObject,
    })
    .returning();
  console.log('[Form Submission] Form response inserted:', response);

  const isApiCall = headers['content-type']?.includes('application/json');
  console.log('[Form Submission] Request type:', isApiCall ? 'API' : 'Form submission');

  if (isApiCall) {
    console.log('[Form Submission] Returning API response');
    return { success: true, message: 'Form submission received' };
  } else {
    console.log('[Form Submission] Preparing redirect response');
    const returnURLObject = new URL(returnURL || website[0].domain);
    returnURLObject.searchParams.set('success', 'true');
    console.log('[Form Submission] Redirecting to:', returnURLObject.toString());
    return sendRedirect(event, returnURLObject.toString());
  }
});
