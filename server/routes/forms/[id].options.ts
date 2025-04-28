import { eq } from 'drizzle-orm';
import { formsTable, websitesTable } from '~~/server/db/schema';
import { useDatabase } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  const { id: formId } = getRouterParams(event);

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

  const websiteDomain = website[0].domain;
  const referer = getRequestHeader(event, 'referer');
  if (!referer) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request',
    });
  }

  console.log('websiteDomain', websiteDomain);
  console.log('referer', referer);
  let originDomain = '';
  try {
    const originUrl = new URL(referer);
    originDomain = originUrl.hostname;
    console.log('originDomain', originDomain);
  } catch (e) {
    console.error('Error processing OPTIONS request for originDomain', originDomain, 'websiteDomain', websiteDomain, e);
    throw createError({
      statusCode: 400,
      message: 'Invalid origin',
    });
  }

  if (originDomain.includes(websiteDomain) || websiteDomain.includes(originDomain)) {
    console.log('setting referer', referer);
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': referer,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
    });
  }

  return sendNoContent(event);
});
