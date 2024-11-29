import { relations, sql } from 'drizzle-orm';
import {
  check,
  date,
  index,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'member']);

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 12 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique(),
    imageUrl: varchar('image_url', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    nameIdx: index('name_idx').on(table.name),
  }),
);

export type UserInsert = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  teamUserRelations: many(teamUserRelations),
  measurements: many(measurements),
}));

export const teams = pgTable(
  'teams',
  {
    id: varchar('id', { length: 12 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index('team_name_idx').on(table.name),
  }),
);

export type TeamSelect = typeof teams.$inferSelect;

export const teamsRelations = relations(teams, ({ many }) => ({
  teamUserRelations: many(teamUserRelations),
  invitations: many(invitations),
}));

export const teamUserRelations = pgTable(
  'team_user_relations',
  {
    userId: varchar('user_id', { length: 12 })
      .notNull()
      .references(() => users.id),
    teamId: varchar('team_id', { length: 12 })
      .notNull()
      .references(() => teams.id),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
    role: roleEnum('role').default('member').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.teamId] }),
    userIdIdx: index('team_user_relations_user_id_idx').on(table.userId),
    teamIdIdx: index('team_user_relations_team_id_idx').on(table.teamId),
    roleIdx: index('team_user_relations_role_idx').on(table.role),
  }),
);

export type TeamUserRelationsSelect = typeof teamUserRelations.$inferSelect;

export const teamUserRelationsRelations = relations(
  teamUserRelations,
  ({ one }) => ({
    user: one(users, {
      fields: [teamUserRelations.userId],
      references: [users.id],
    }),
    team: one(teams, {
      fields: [teamUserRelations.teamId],
      references: [teams.id],
    }),
  }),
);

export const invitations = pgTable(
  'invitations',
  {
    email: varchar('email', { length: 255 }).notNull(),
    teamId: varchar('team_id', { length: 12 })
      .notNull()
      .references(() => teams.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.email, table.teamId] }),
    emailIdx: index('invitations_email_idx').on(table.email),
    teamIdIdx: index('invitations_team_id_idx').on(table.teamId),
    createdAtIdx: index('invitations_created_at_idx').on(table.createdAt),
  }),
);

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
}));

export const measurements = pgTable(
  'measurements',
  {
    id: varchar('id', { length: 12 }).primaryKey(),
    userId: varchar('user_id', { length: 12 })
      .notNull()
      .references(() => users.id),
    weight: numeric('weight', { precision: 5, scale: 2 }).notNull(),
    measuredAt: date('measured_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    weightCheckMin: check('weight_check_min', sql`${table.weight} > 30`),
    weightCheckMax: check('weight_check_max', sql`${table.weight} < 200`),
    userIdIdx: index('measurements_user_id_idx').on(table.userId),
    measuredAtIdx: index('measurements_measured_at_idx').on(table.measuredAt),
  }),
);

export type MeasurementInsert = typeof measurements.$inferInsert;
export type MeasurementSelect = typeof measurements.$inferSelect & {
  weight: number;
};

export const measurementsRelations = relations(measurements, ({ one }) => ({
  user: one(users, {
    fields: [measurements.userId],
    references: [users.id],
  }),
}));
