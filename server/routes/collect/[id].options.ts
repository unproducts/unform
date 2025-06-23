import { eq } from 'drizzle-orm';
import { formsTable, formDomainsTable } from '~~/server/db/schema';
import { useDatabase } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  console.log('[form-submission] Starting form submission handler OPTIONS');
  const { id: formId } = getRouterParams(event);
  console.log('[form-submission] Form ID:', formId, getRouterParams(event));

  const db = await useDatabase();
  const form = await db.select().from(formsTable).where(eq(formsTable.id, formId)).limit(1);

  if (!form || form.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Form not found',
    });
  }

  const referer = getRequestHeader(event, 'referer');
  if (!referer) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request',
    });
  }

  let originDomain = '';
  try {
    const originUrl = new URL(referer);
    originDomain = originUrl.hostname;
  } catch (e) {
    console.error('Error processing OPTIONS request for originDomain', originDomain, e);
    throw createError({
      statusCode: 400,
      message: 'Invalid origin',
    });
  }

  // Get all whitelisted domains for this form
  const whitelistedDomains = await db.select().from(formDomainsTable).where(eq(formDomainsTable.formId, formId));

  // Check if the origin domain matches any whitelisted domain
  const isWhitelisted = whitelistedDomains.some(({ domain }) => {
    // Allow both exact matches and subdomains
    return originDomain === domain || originDomain.endsWith('.' + domain);
  });

  if (isWhitelisted) {
    const origin = new URL(referer).origin;
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
    });
  }

  return sendNoContent(event);
});
