import { H3Event } from 'h3';
import { eq } from 'drizzle-orm';
import { formsTable, formResponsesTable, formDomainsTable } from '~~/server/db/schema';
import { useDatabase } from '~~/server/utils/db';
import { z } from 'zod';
const sendFormResponseRedirect = (event: H3Event, returnURL: string, success: boolean, errorCode?: string) => {
  const returnURLObject = new URL(returnURL);
  returnURLObject.searchParams.set('success', success.toString());
  if (errorCode) {
    returnURLObject.searchParams.set('error', errorCode);
  }
  return sendRedirect(event, returnURLObject.toString());
};

const errorCodes = {
  invalidOrigin: 'invalid_origin',
  forbidden: 'forbidden',
  invalidContentType: 'invalid_content_type',
  formNotFound: 'form_not_found',
  websiteNotFound: 'website_not_found',
  invalidReturnURL: 'invalid_return_url',
} as const;

export default defineEventHandler(async (event) => {
  const { id: formId } = getRouterParams(event);

  let source: 'API' | 'FORM';
  let returnURL: string | null = null;
  let origin: string | null = null;

  // check if the request is an API call
  const contentType = getHeader(event, 'content-type');

  if (contentType?.includes('application/json')) {
    source = 'API';
  } else if (contentType?.includes('application/x-www-form-urlencoded')) {
    source = 'FORM';

    const headers = getHeaders(event);
    origin = headers.origin || headers.referer || null;
    if (!origin) {
      throw createError({
        statusCode: 400,
        message: 'Invalid origin',
      });
    }

    returnURL = origin;
    try {
      if (getQuery(event).return) {
        returnURL = atob(getQuery(event).return as string);
      }
    } catch (e) {
      console.error('Error decoding return URL:', e);
      return sendFormResponseRedirect(event, returnURL, false, errorCodes.invalidReturnURL);
    }
  } else {
    throw createError({
      statusCode: 400,
      message: 'Invalid contentType',
    });
  }

  const isApiCall = source === 'API';

  let formDataObject: Record<string, string>;
  if (isApiCall) {
    const body = await readBody(event);
    formDataObject = body;
  } else {
    const formData = await readFormData(event);
    formDataObject = {};
    for (const [key, value] of formData.entries()) {
      formDataObject[key] = value.toString();
    }
  }

  const isFormIdValid = z.string().uuid().safeParse(formId);
  if (!isFormIdValid.success) {
    if (isApiCall) {
      throw createError({
        statusCode: 404,
        message: 'Form not found',
      });
    } else {
      return sendFormResponseRedirect(event, returnURL!, false, errorCodes.formNotFound);
    }
  }

  const db = await useDatabase();

  const formDbResponse = await db.select().from(formsTable).where(eq(formsTable.id, formId)).limit(1);

  if (!formDbResponse || formDbResponse.length === 0) {
    if (isApiCall) {
      throw createError({
        statusCode: 404,
        message: 'Form not found',
      });
    } else {
      return sendFormResponseRedirect(event, returnURL!, false, errorCodes.formNotFound);
    }
  }
  const form = formDbResponse[0]!;

  const formDomainsDbResponse = await db.select().from(formDomainsTable).where(eq(formDomainsTable.formId, formId));

  const formDomains = formDomainsDbResponse.map((domain) => domain.domain);

  if (!formDomains.length) {
    if (isApiCall) {
      throw createError({
        statusCode: 404,
        message: 'Form not found',
      });
    } else {
      return sendFormResponseRedirect(event, returnURL!, false, errorCodes.formNotFound);
    }
  }

  const collectedDataObject: Record<string, string> = {};

  if (!isApiCall) {
    // verify the origin of the request if form submission
    let originDomain: string | null = null;
    try {
      const originUrl = new URL(origin!);
      originDomain = originUrl.hostname;
    } catch (e) {
      console.error('Invalid origin format:', origin);
      return sendFormResponseRedirect(event, returnURL!, false, errorCodes.invalidOrigin);
    }

    const websiteDomain = formDomains.find(
      (domain) => originDomain!.includes(domain) || domain.includes(originDomain!)
    );
    if (!websiteDomain) {
      return sendFormResponseRedirect(event, returnURL!, false, errorCodes.forbidden);
    }
    collectedDataObject.websiteDomain = websiteDomain;
  }

  await db.insert(formResponsesTable).values({
    formId,
    adminId: form.adminId,
    data: formDataObject,
    collectedData: collectedDataObject,
  });

  if (isApiCall) {
    return { success: true, message: 'Form submission received' };
  } else {
    return sendFormResponseRedirect(event, returnURL!, true);
  }
});
