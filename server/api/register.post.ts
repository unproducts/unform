import { registerSchema } from '~~/shared/schemas/authentication';
import { adminsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema.parse);

  const db = await useDatabase();

  const users = await db.select({ id: adminsTable.id }).from(adminsTable).where(eq(adminsTable.email, body.email));
  const user = users && users.length === 1 ? users[0] : undefined;

  if (user) {
    throw createError({
      statusCode: 400,
      message: 'Email is already taken',
    });
  }

  const insertedAdmins = await db
    .insert(adminsTable)
    .values({
      name: body.name,
      email: body.email,
      password: await hashPassword(body.password),
    })
    .returning({
      id: adminsTable.id,
    });

  if (insertedAdmins && insertedAdmins.length === 1) {
    const admin = insertedAdmins[0]!;
    await setUserSession(event, {
      user: {
        id: admin.id,
      },
    });
    return sendNoContent(event);
  }

  throw createError({
    statusCode: 500,
    message: 'User not created',
  });
});
