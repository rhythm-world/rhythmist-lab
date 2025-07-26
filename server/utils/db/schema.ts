import { index, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';
import { ChartDifficulties, ProjectStatuses } from '../../../shared/schema';
import * as AuthSchema from './auth-schema';

export * from './auth-schema';

function buildCommonFields() {
  return {
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
  };
}

export const ProjectTable = pgTable('project', {
  id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
  ownerId: text('owner_id').notNull().references(() => AuthSchema.user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  difficulty: text('difficulty', { enum: ChartDifficulties }),
  level: real('level'),
  tags: text('tags').array().default([]),
  prompt: text('prompt'),
  chart: text('chart'),
  status: text('status', { enum: ProjectStatuses }).notNull(),
  ...buildCommonFields(),
}, t => [
  index('idx_owner_id').on(t.ownerId),
]);
