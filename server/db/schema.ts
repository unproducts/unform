import { sql } from 'drizzle-orm';
import { boolean, pgTable, timestamp, uuid, varchar, char, json } from 'drizzle-orm/pg-core';

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
export type Admin = typeof adminsTable.$inferSelect;

export const websitesTable = pgTable('websites', {
  id: defaultUuidPkField(),
  domain: varchar('domain', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type Website = typeof websitesTable.$inferSelect;

export const formsTable = pgTable('forms', {
  id: defaultUuidPkField(),
  name: varchar('name', { length: 255 }).notNull(),
  websiteId: uuid('website_id')
    .notNull()
    .references(() => websitesTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type Form = typeof formsTable.$inferSelect;

export const formResponsesTable = pgTable('form_responses', {
  id: defaultUuidPkField(),
  formId: uuid('form_id')
    .notNull()
    .references(() => formsTable.id),
  data: json('data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type FormResponse = typeof formResponsesTable.$inferSelect;
