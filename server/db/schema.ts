import { sql } from 'drizzle-orm';
import { boolean, pgTable, timestamp, uuid, varchar, char, json, smallint, unique } from 'drizzle-orm/pg-core';

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
  createdAt: timestamp('created_at').$type<string>().defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$type<string>().defaultNow().notNull(),
});

export const formsTable = pgTable('forms', {
  id: defaultUuidPkField(),
  name: varchar('name', { length: 255 }).notNull(),
  adminId: uuid('admin_id')
    .notNull()
    .references(() => adminsTable.id),
  createdAt: timestamp('created_at').$type<string>().defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$type<string>().defaultNow().notNull(),
});

export const formDomainsTable = pgTable('form_domains', {
  id: defaultUuidPkField(),
  formId: uuid('form_id')
    .notNull()
    .references(() => formsTable.id, { onDelete: 'cascade' }),
  domain: varchar('domain', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').$type<string>().defaultNow().notNull(),
});

export const formResponsesTable = pgTable('form_responses', {
  id: defaultUuidPkField(),
  formId: uuid('form_id')
    .notNull()
    .references(() => formsTable.id, { onDelete: 'cascade' }),
  data: json('data').notNull(),
  collectedData: json('collected_data').notNull(),
  createdAt: timestamp('created_at').$type<string>().defaultNow().notNull(),
});

export const formIntegrationConfigsTable = pgTable(
  'form_integration_configs',
  {
    id: defaultUuidPkField(),
    formId: uuid('form_id')
      .notNull()
      .references(() => formsTable.id, { onDelete: 'cascade' }),
    integrationConfigId: uuid('integration_config_id')
      .notNull()
      .references(() => integrationConfigsTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').$type<string>().defaultNow().notNull(),
  },
  (table) => [unique().on(table.formId, table.integrationConfigId)]
);

export const integrationConfigsTable = pgTable('integration_configs', {
  id: defaultUuidPkField(),
  adminId: uuid('admin_id')
    .notNull()
    .references(() => adminsTable.id),
  type: smallint('type').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  data: json('data').$type<Record<string, any>>().notNull(),
  createdAt: timestamp('created_at').$type<string>().defaultNow().notNull(),
});
