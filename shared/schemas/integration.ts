import { z } from 'zod';

export const integrationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: z.number().int().min(0).max(255),
  data: z.record(z.any()),
  createdAt: z.date(),
});

export type Integration = z.infer<typeof integrationSchema>;
export const createIntegrationSchema = integrationSchema.omit({ id: true, createdAt: true });
export const updateIntegrationSchema = integrationSchema.omit({ id: true, createdAt: true }).partial();
