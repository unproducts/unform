import { H3Event } from 'h3';
import { adminsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { User } from '~~/shared/schemas/authentication';

export type Credentials = {
  token: string;
  tokenType: string;
};

export function createUnauthorisedError() {
  return createError({
    statusCode: 401,
    message: 'Session not authenticated',
  });
}

export default async function authenticateRequest(event: H3Event): Promise<{ user: User }> {
  const session = await requireUserSession(event);

  if (IS_DEV) {
    console.log('Authenticating Admin', session.user.id);
  }

  const db = await useDatabase();
  const users = await db.select().from(adminsTable).where(eq(adminsTable.id, session.user.id));
  if (!users || !users.length) {
    throw createUnauthorisedError();
  }
  const user = users[0]!;

  // @ts-expect-error password deleted, but type says otherwise.
  delete user.password;
  return { user: user as unknown as User };
}
