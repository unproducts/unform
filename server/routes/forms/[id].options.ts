import { eq } from 'drizzle-orm';
import { formsTable, websitesTable } from '~~/server/db/schema';
import { useDatabase } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  console.log('OPTIONS request received');
  const { id: formId } = getRouterParams(event);
  console.log('Form ID:', formId);

  const db = await useDatabase();
  const form = await db.select().from(formsTable).where(eq(formsTable.id, formId)).limit(1);
  console.log('Form found:', form ? 'yes' : 'no');

  if (!form || form.length === 0) {
    console.log('Form not found for ID:', formId);
    throw createError({
      statusCode: 404,
      message: 'Form not found',
    });
  }

  const website = await db.select().from(websitesTable).where(eq(websitesTable.id, form[0].websiteId)).limit(1);
  console.log('Website found:', website ? 'yes' : 'no');

  if (!website || website.length === 0) {
    console.log('Website not found for form ID:', formId);
    throw createError({
      statusCode: 404,
      message: 'Website not found',
    });
  }

  const websiteDomain = website[0].domain;
  console.log('Website domain:', websiteDomain);

  const referer = getRequestHeader(event, 'referer');
  console.log('Referer:', referer);

  if (!referer) {
    console.log('No referer header found');
    throw createError({
      statusCode: 400,
      message: 'Invalid request',
    });
  }

  let originDomain = '';
  try {
    const originUrl = new URL(referer);
    originDomain = originUrl.hostname;
    console.log('Parsed origin domain:', originDomain);
  } catch (e) {
    console.error('Error processing OPTIONS request for originDomain', originDomain, 'websiteDomain', websiteDomain, e);
    throw createError({
      statusCode: 400,
      message: 'Invalid origin',
    });
  }

  console.log('Domain comparison:', {
    originDomain,
    websiteDomain,
    originIncludesWebsite: originDomain.includes(websiteDomain),
    websiteIncludesOrigin: websiteDomain.includes(originDomain),
  });

  if (originDomain.includes(websiteDomain) || websiteDomain.includes(originDomain)) {
    const origin = new URL(referer).origin;
    console.log('Setting CORS headers for origin:', origin);
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
    });
  } else {
    console.log('Domains do not match, no CORS headers set');
  }

  console.log('Request headers:', getRequestHeaders(event));
  console.log('Response headers:', getResponseHeaders(event));

  return sendNoContent(event);
});
