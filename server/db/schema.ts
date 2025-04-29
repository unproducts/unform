import { sql } from 'drizzle-orm';
import { boolean, pgTable, timestamp, uuid, varchar, char, json, text } from 'drizzle-orm/pg-core';

const defaultUuidPkField = () =>
  uuid('id')
    .primaryKey()
    .$default(() => sql`gen_random_uuid()`);

export const adminsTable = pgTable('admins', {
  id: defaultUuidPkField(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: char('password', { length: 133 }).notNull(), // length of adonis scrypt output
  isSuperAdmin: boolean('is_super_admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const formsTable = pgTable('forms', {
  id: defaultUuidPkField(),
  name: varchar('name', { length: 255 }).notNull(),
  adminId: uuid('admin_id')
    .notNull()
    .references(() => adminsTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const formDomainsTable = pgTable('form_domains', {
  id: defaultUuidPkField(),
  adminId: uuid('admin_id')
    .notNull()
    .references(() => adminsTable.id),
  formId: uuid('form_id')
    .notNull()
    .references(() => formsTable.id, { onDelete: 'cascade' }),
  domain: varchar('domain', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const formResponsesTable = pgTable('form_responses', {
  id: defaultUuidPkField(),
  adminId: uuid('admin_id')
    .notNull()
    .references(() => adminsTable.id),
  formId: uuid('form_id')
    .notNull()
    .references(() => formsTable.id, { onDelete: 'cascade' }),
  data: json('data').notNull(),
  collectedData: json('collected_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
