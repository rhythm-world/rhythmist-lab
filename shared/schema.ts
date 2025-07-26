import { z } from 'zod';

export const ProjectStatuses = ['generating', 'completed', 'failed'] as const;
export const ProjectStatus = z.enum(ProjectStatuses);
export type ProjectStatus = z.infer<typeof ProjectStatus>;

export const ChartDifficulties = ['Basic', 'Advanced', 'Expert', 'Master', 'Re: Master'] as const;
export const ChartDifficulty = z.enum(ChartDifficulties);
export type ChartDifficulty = z.infer<typeof ChartDifficulty>;

export const Project = z.object({
  id: z.uuidv7(),
  ownerId: z.string(),
  title: z.string(),
  difficulty: ChartDifficulty,
  level: z.number().nullable(),
  tags: z.array(z.string()),
  prompt: z.string(),
  status: ProjectStatus,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Project = z.infer<typeof Project>;
